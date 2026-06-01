import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();

app.listen(env.port, () => {
  console.log(`Server Backend berjalan di http://localhost:${env.port}`);
  console.log("Auth routes: /api/auth/*");
  console.log("Health route: GET /api/health");
  if (process.env.RESEND_API_KEY) {
    console.log(`[Email] Resend from: ${env.emailFromName} <${env.resendFromEmail}>`);
  }
});
