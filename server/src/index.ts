import { config } from "./config/config.js";
import { createApp } from "./app.js";

const app = createApp();

app.listen(config.port, () =>
  console.log(`Quartr API listening on http://localhost:${config.port}`),
);
