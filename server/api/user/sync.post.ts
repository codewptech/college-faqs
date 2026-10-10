export default defineEventHandler(async (event) => {
  const auth0 = useAuth0(event);

  const session = await auth0.getSession();

  if (!session) {
    return {
      synced: false,
    };
  }

  const profile = await auth0.getUser();

  if (!profile?.sub || !profile.email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Authenticated user profile is incomplete.',
    });
  }

  const user = await prisma.user.upsert({
    where: {
      auth0_id: profile.sub,
    },
    update: {
      email: profile.email,
      name: profile.name ?? null,
      picture: profile.picture ?? null,
      email_verified: profile.email_verified ?? false,
    },
    create: {
      auth0_id: profile.sub,
      email: profile.email,
      name: profile.name ?? null,
      picture: profile.picture ?? null,
      email_verified: profile.email_verified ?? false,
    },
  });

  return {
    synced: true,
    userId: user.id,
  };
});
