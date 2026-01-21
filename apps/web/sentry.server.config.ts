import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://example@sentry.io/45086789",
  tracesSampleRate: 1.0,
  debug: false,
});
