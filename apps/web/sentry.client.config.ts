import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://4b072cf3b6be4f4c0f9fe1a12444f35c@o4510320861839361.ingest.de.sentry.io/4510749421797456",
  tracesSampleRate: 1.0,
  debug: false,
});
