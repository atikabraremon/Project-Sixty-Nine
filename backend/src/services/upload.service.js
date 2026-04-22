import { PutObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "../config/r2Config.js";

export const uploadMultipleToR2 = async (files, folder = "uploads") => {
  const uploadPromises = files.map(async (file) => {
    // for file name clean
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileName = `${uniqueSuffix}-${file.originalname.replace(/\s+/g, "-")}`;

    const params = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: `${folder}/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await r2Client.send(new PutObjectCommand(params));

    return {
      fileName,
      url: `${process.env.R2_PUBLIC_DOMAIN}/${folder}/${fileName}`,
    };
  });

  return await Promise.all(uploadPromises);
};
