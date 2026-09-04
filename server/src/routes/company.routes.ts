import { Router } from "express";
import { getCompanyFilings } from "../controllers/company.controller.js";

const router = Router();
router.get("/:ticker/filings", getCompanyFilings);

export default router;
