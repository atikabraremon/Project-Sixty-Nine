import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import r2Client from "../config/s3Client.js";

export const getDirectSingleUploadUrl = async (
  fileName,
  contentType,
  folder = "uploads"
) => {
  try {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const cleanName = fileName.replace(/\s+/g, "-");
    const fileKey = `${folder}/${uniqueSuffix}-${cleanName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 60 });

    return {
      success: true,
      uploadUrl,
      fileKey,
      publicUrl: `${process.env.R2_PUBLIC_DOMAIN}/${fileKey}`,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};



export const getDirectMultipleUploadUrls = async (
  files,
  folder = "uploads"
) => {
  try {
    const promises = files.map(async (file) => {
      const uniqueFileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.fileName.replace(/\s+/g, "-")}`;
      const fileKey = `${folder}/${uniqueFileName}`;

      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileKey,
        ContentType: file.contentType,
      });

      const uploadUrl = await getSignedUrl(r2Client, command, {
        expiresIn: 60,
      });

      return {
        fileName: file.fileName,
        uploadUrl,
        fileKey,
        publicUrl: `${process.env.R2_PUBLIC_DOMAIN}/${fileKey}`,
      };
    });

    const results = await Promise.all(promises);
    return { success: true, urls: results };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
