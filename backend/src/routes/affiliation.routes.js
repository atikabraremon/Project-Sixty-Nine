import { Router } from "express";
import { restrictTo, verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleAffiliation } from "../controllers/affiliation.controller.js";

const router = Router();

// Route: /api/v1/affiliation/toggle
router
  .route("/toggle")
  .post(verifyJWT, restrictTo("admin", "super-admin"), toggleAffiliation);

export default router;
