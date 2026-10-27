import type { IncomingMessage } from "node:http";
import {
  defineEventHandler,
  getRequestHeaders,
  getRequestURL,
  setResponseHeader,
  setResponseStatus,
} from "h3";
import {
  MAX_SUBMISSION_BYTES,
  SubmissionBodyError,
} from "./submission-security.ts";
import type { createSubmissionService } from "./submission-service.ts";

/** Counts bytes as they arrive, including requests without Content-Length. */
export function readSubmissionBody(
  request: IncomingMessage,
  timeoutMs = 10_000,
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks: Buffer[] = [];
    let finished = false;
    const timer = setTimeout(
      () => finish(new SubmissionBodyError("REQUEST_TIMEOUT")),
      timeoutMs,
    );
    timer.unref();

    function finish(error?: SubmissionBodyError) {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      request.off("data", onData);
      request.off("end", onEnd);
      request.off("error", onError);
      request.off("aborted", onError);
      if (error) {
        chunks.length = 0;
        // A disconnected IncomingMessage emits aborted followed by error.
        // Keep that subsequent transport error from becoming unhandled.
        request.once("error", () => {});
        request.resume();
        reject(error);
      } else resolve(Buffer.concat(chunks, size));
    }
    function onData(chunk: Buffer | string) {
      const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      size += bytes.byteLength;
      if (size > MAX_SUBMISSION_BYTES)
        finish(new SubmissionBodyError("BODY_TOO_LARGE"));
      else chunks.push(bytes);
    }
    function onEnd() {
      finish();
    }
    function onError() {
      finish(new SubmissionBodyError("INVALID_BODY"));
    }
    request.on("data", onData);
    request.once("end", onEnd);
    request.once("error", onError);
    request.once("aborted", onError);
  });
}

export function createSubmissionHandler(
  submit: ReturnType<typeof createSubmissionService>,
) {
  return defineEventHandler(async (event) => {
    setResponseHeader(event, "Cache-Control", "no-store");
    setResponseHeader(event, "X-Content-Type-Options", "nosniff");
    let requestOrigin: string;
    try {
      requestOrigin = getRequestURL(event, {
        xForwardedHost: false,
        xForwardedProto: false,
      }).origin;
    } catch {
      setResponseStatus(event, 400);
      return {
        ok: false,
        error: {
          code: "INVALID_REQUEST",
          message: "Unable to accept this request.",
        },
      };
    }
    const result = await submit({
      method: event.method,
      headers: getRequestHeaders(event),
      requestOrigin,
      readBody: () => readSubmissionBody(event.node.req),
    });
    setResponseStatus(event, result.status);
    for (const [key, value] of Object.entries(result.headers ?? {}))
      setResponseHeader(event, key, value);
    // Do not hold an HTTP connection open while rejecting an unread/oversize body.
    if (result.status >= 400 && !event.node.req.complete) {
      setResponseHeader(event, "Connection", "close");
      event.node.req.resume();
    }
    return result.body;
  });
}
