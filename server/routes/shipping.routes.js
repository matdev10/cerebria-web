import { Router } from "express";
import { getShippingQuote } from "../controllers/shipping.controller.js";

const router = Router();

router.post("/quote", getShippingQuote);

export default router;