import { Router } from "express";
import { getDirectSingleUploadUrl } from "../services/r2DirectUpload.service.js"; // পাথ চেক করে নিন

const router = Router();

router.route("/get-upload-url").post(async (req, res) => {
  try {
    const { fileName, contentType, folder } = req.body;

    if (!fileName || !contentType) {
      return res
        .status(400)
        .json({
          success: false,
          error: "fileName and contentType are required",
        });
    }

    const result = await getDirectSingleUploadUrl(
      fileName,
      contentType,
      folder
    );

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
