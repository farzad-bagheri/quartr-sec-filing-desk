import { Router } from "express";
import { getFilingSummary } from "../controllers/filing.controller.js";

const router = Router();
router.get("/summary", getFilingSummary);

export default router;
