import { Router } from "express";

import {
  createPreference,
  reconcilePayment,
} from "../controllers/payment.controller.js";

const router = Router();

router.post("/preferences", createPreference);
router.post("/reconcile", reconcilePayment);

export default router;