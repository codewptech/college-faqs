/** Minimal Chrome DevTools adapter; uses Node's WebSocket, without test dependencies. */
export async function openBrowserTab(port) {
  const target = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, {
    method: "PUT",
  }).then((response) => response.json());
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  let nextId = 0;
  const pending = new Map();
  const listeners = new Map();
  const errors = [];
  const warnings = [];
  const scripts = new Set();
  let activity = Date.now();
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (
      message.method === "Network.requestWillBeSent" &&
      message.params.type === "Script"
    ) {
      scripts.add(message.params.requestId);
      activity = Date.now();
    }
    if (
      ["Network.loadingFinished", "Network.loadingFailed"].includes(
        message.method,
      ) &&
      scripts.delete(message.params.requestId)
    )
      activity = Date.now();
    if (message.method === "Runtime.exceptionThrown") {
      errors.push(message.params.exceptionDetails);
    }
    if (message.method === "Runtime.consoleAPICalled") {
      const messageText = message.params.args
        .map((arg) => arg.value ?? arg.description ?? "")
        .join(" ");
      if (/hydration.*mismatch|hydration completed/i.test(messageText))
        warnings.push(messageText);
    }
    for (const listener of listeners.get(message.method) ?? []) {
      Promise.resolve()
        .then(() => listener(message.params))
        .catch((error) => errors.push(error.message));
    }
    if (!message.id) return;
    const entry = pending.get(message.id);
    if (!entry) return;
    pending.delete(message.id);
    clearTimeout(entry.timer);
    if (message.error) entry.reject(new Error(JSON.stringify(message.error)));
    else entry.resolve(message.result);
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++nextId;
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`CDP timeout: ${method}`));
      }, 20000);
      pending.set(id, { resolve, reject, timer });
      socket.send(JSON.stringify({ id, method, params }));
    });
  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails)
      throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const waitFor = async (expression, timeout = 15000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (await evaluate(expression)) return;
      await new Promise((resolve) => setTimeout(resolve, 75));
    }
    throw new Error(`Browser condition timed out: ${expression}`);
  };
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Page.bringToFront");
  return {
    send,
    evaluate,
    waitFor,
    errors,
    warnings,
    on(method, listener) {
      if (!listeners.has(method)) listeners.set(method, new Set());
      listeners.get(method).add(listener);
      return () => listeners.get(method)?.delete(listener);
    },
    async navigate(url) {
      await send("Page.bringToFront");
      const previousOrigin = await evaluate("performance.timeOrigin");
      const navigation = await send("Page.navigate", { url });
      if (navigation.errorText)
        throw new Error(`Navigation failed: ${navigation.errorText}`);
      const newDocument = navigation.loaderId
        ? `performance.timeOrigin !== ${previousOrigin} && `
        : "";
      await waitFor(
        `${newDocument}location.href === ${JSON.stringify(url)} && document.readyState === 'complete'`,
      );
      const deadline = Date.now() + 20_000;
      while (
        (scripts.size || Date.now() - activity < 250) &&
        Date.now() < deadline
      )
        await new Promise((resolve) => setTimeout(resolve, 50));
      if (scripts.size)
        throw new Error("Application scripts did not finish loading");
      await evaluate(
        "Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2000))])",
      );
      // Hidden tabs can suspend requestAnimationFrame indefinitely. Geometry reads
      // in the checks force layout; this bounded host-side wait never depends on it.
      await new Promise((resolve) => setTimeout(resolve, 75));
    },
    async close() {
      socket.close();
      await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`);
    },
  };
}
