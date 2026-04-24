import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "../config/s3Client.js";

export const deleteFromR2 = async (key) => {
  try {
    if (!key) return;

    const params = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    };

    await r2Client.send(new DeleteObjectCommand(params));
    console.log(`Successfully deleted orphaned file from R2: ${key}`);
  } catch (error) {
    console.error(`Failed to delete file from R2: ${error.message}`);
  }
};
