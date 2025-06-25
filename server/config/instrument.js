import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://3cb6ff29b4c180f471dfd639965b9b95@o4509525401141248.ingest.us.sentry.io/4509525419884544",
  integrations: [
    Sentry.mongooseIntegration()
  ],
  sendDefaultPii: true,
});
