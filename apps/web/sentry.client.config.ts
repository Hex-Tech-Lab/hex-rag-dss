import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://example@sentry.io/45086789", // Placeholder, user to provide actual DSN
  tracesSampleRate: 1.0,
  debug: false,
});
