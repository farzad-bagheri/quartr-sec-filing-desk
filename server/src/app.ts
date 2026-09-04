import cors from "cors";
import express from "express";
import companyRoutes from "./routes/company.routes.js";
import filingRoutes from "./routes/filing.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.get("/api/health", (_, response) => response.json({ ok: true }));
  app.use("/api/companies", companyRoutes);
  app.use("/api/filings", filingRoutes);
  app.use(errorHandler);
  return app;
}
