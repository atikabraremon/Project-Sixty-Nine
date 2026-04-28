import { Router } from "express";
import { getDirectSingleUploadUrl } from "../services/r2DirectUpload.service.js"; // পাথ চেক করে নিন
import {
  checkSlugAvailability,
  uploadVideo,
} from "../controllers/media.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUploadUrl } from "../controllers/upload.controller.js";

const router = Router();

router.route("/check-slug").get(checkSlugAvailability);
// router.route("/create-video").post(verifyJWT, uploadVideo);
router.route("/create-video").post(uploadVideo);


router.route("/get-upload-url").post(getUploadUrl);

export default router;
