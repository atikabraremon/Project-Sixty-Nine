import { Router } from "express";
import { restrictTo, verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  loginUser,
  registerUser,
  refreshAccessToken,
  logoutUser,
  updateAccountDetails, // Add if needed
  updateUserAvatar, // Add if needed
} from "../controllers/user.controller.js";

const router = Router();

router
  .route("/register")
  .post(
    verifyJWT,
    restrictTo("super-admin"),
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    registerUser
  );

router.route("/login").post(loginUser);

// secured routes

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
