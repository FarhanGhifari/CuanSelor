import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();

app.listen(env.port, () => {
  console.log(`Server Backend berjalan di http://localhost:${env.port}`);
  console.log("Auth routes: /api/auth/*");
  console.log("Health route: GET /api/health");
});
