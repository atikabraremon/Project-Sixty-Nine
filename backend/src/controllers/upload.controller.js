import { getDirectSingleUploadUrl } from "../services/r2DirectUpload.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUploadUrl = asyncHandler(async (req, res) => {
  const { fileName, contentType, folder } = req.body;

  if (!fileName || !contentType) {
    throw new ApiError(400, "fileName and contentType are required");
  }

  const targetFolder = folder || "uploads";

  const result = await getDirectSingleUploadUrl(
    fileName,
    contentType,
    targetFolder
  );

  if (!result.success) {
    throw new ApiError(500, result.error || "Upload URL generation failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Upload URL generated"));
});
