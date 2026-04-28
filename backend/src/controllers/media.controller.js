import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateSlug } from "../utils/slugify.js";

export const uploadVideo = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      genres,
      category,
      tags,
      releaseDate,
      isFeatured,
      isPremium,
      badgeText,
      stars,
      network,
      seoData,
    } = req.body;

    // 1. slug modifier
    const modifiedSlug = generateSlug(slug);

    // ২. স্লাগ চেক করা
    const existingVideo = await Video.findOne({ slug: modifiedSlug });

    if (existingVideo) {
      return res.status(400).json({
        success: false,
        message: "This slug is already taken. Please provide a unique slug.",
      });
    }

    // ৩. নতুন ভিডিও অবজেক্ট তৈরি
    const newVideo = new Video({
      title,
      slug: modifiedSlug,
      description,
      genres,
      category,
      tags,
      releaseDate,
      isFeatured,
      isPremium,
      badgeText,
      stars,
      network,
      seo: seoData,
      uploadedBy: req.user?._id, // অপশনাল চেইনিং ব্যবহার করা ভালো
      status: "pending",
    });

    const savedVideo = await newVideo.save();

    return res.status(201).json(
      new ApiResponse(
        201,
        { videoId: savedVideo._id }, // অবজেক্ট আকারে পাঠানো স্ট্যান্ডার্ড
        "Video metadata saved. Now start uploading file."
      )
    );
  } catch (error) {
    // এখানে error ভেরিয়েবলটি ব্যবহার করুন
    throw new ApiError(400, error?.message || "Create failed");
  }
});

export const checkSlugAvailability = asyncHandler(async (req, res) => {
  const { slug } = req.query; // Query parameter theke slug nile bhalo hoy

  if (!slug) {
    throw new ApiError(400, "Slug is required for checking");
  }

  // 1. Slug format
  const modifiedSlug = generateSlug(slug);

  // 2. Database-e check kora (Shudhu _id check korbo speed-er jonno)
  const existingVideo = await Video.findOne({ slug: modifiedSlug }).select(
    "_id"
  );

  if (existingVideo) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, { isAvailable: false }, "Slug is already taken")
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isAvailable: true, slug: modifiedSlug },
        "Slug is available"
      )
    );
});

