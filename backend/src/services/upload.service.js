import { PutObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "../config/s3Client.js";
import fs from "fs";
import { response } from "express";

// ফাইলের নাম ক্লিন এবং ইউনিক করার ইন্টারনাল ফাংশন
const generateFileName = (originalname) => {
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const cleanName = originalname.replace(/\s+/g, "-");
  return `${uniqueSuffix}-${cleanName}`;
};

export const uploadMultipleToR2 = async (files, folder = "uploads") => {
  if (!files || files.length === 0) return [];

  const uploadPromises = files.map(async (file) => {
    try {
      const fileName = generateFileName(file.originalname);

      const params = {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: `${folder}/${fileName}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      await r2Client.send(new PutObjectCommand(params));
      fs.unlinkSync(files);

      return {
        success: true,
        fileName,
        url: `${process.env.R2_PUBLIC_DOMAIN}/${folder}/${fileName}`,
      };
    } catch (error) {
      // কোনো একটি ফাইল ফেইল করলে সেটাকে অবজেক্টে পাঠানো
      fs.unlinkSync(files);
      return {
        success: false,
        originalName: file.originalname,
        error: error.message,
      };
    }
  });

  return await Promise.all(uploadPromises);
};

/// Single File Upload

export const uploadSingleToR2 = async (file, folder = "uploads") => {
  if (!file) return { success: false, error: "No file provided" };

  try {
    // ১. ডিস্ক থেকে ফাইল পড়া
    const fileContent = fs.readFileSync(file.path);
    const fileKey = `${folder}/${file.filename}`; // ফাইলের ইউনিক পাথ (কী)

    const params = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileKey,
      Body: fileContent,
      ContentType: file.mimetype,
    };

    // ২. R2 তে পাঠানো
    await r2Client.send(new PutObjectCommand(params));

    // ৩. আপলোড শেষে লোকাল সার্ভার (temp) থেকে ডিলিট
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    return {
      success: true,
      // url: `${process.env.R2_PUBLIC_DOMAIN}/${fileKey}`,
      key: fileKey,
    };
  } catch (error) {
    // এরর হলে লোকাল ফাইল ডিলিট করা নিশ্চিত করুন
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    return { success: false, error: error.message };
  }
};
