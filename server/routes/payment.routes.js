import { Router } from "express";

import { createPreference } from "../controllers/payment.controller.js";

const router = Router();

router.post("/preferences", createPreference);

export default router;