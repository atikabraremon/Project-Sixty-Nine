import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: { type: String, required: true },
    badgeText: { type: String, trim: true },

    // 🔹 Media Section
    thumbnail: { type: String }, // Final selected image
    thumbnailOptions: {
      type: [String], // Array of strings
      select: false, // Pura array-tai hidden thakbe
    }, // Temporary options from FFmpeg

    previewVideo: { type: String }, // Final selected 5s clip
    previewOptions: {
      type: [String],
      select: false,
    }, // Temporary clip options

    // 🔹 Admin Control
    isApproved: { type: Boolean, default: false, index: true },

    // 🔹 Video duration
    duration: { type: Number, default: 0 },

    // Categorization
    genres: [{ type: String, lowercase: true, trim: true, index: true }],
    category: [{ type: String, lowercase: true, trim: true, index: true }],
    tags: [{ type: String, lowercase: true, trim: true, index: true }],
    contentRating: { type: String, default: "18+" },
    releaseDate: { type: Date, default: Date.now },

    // 🔹 File & HLS
    originalFileKey: { type: String, select: false },
    hlsFileKey: { type: String, select: false },
    hlsUrl: { type: String },
    availableResolutions: [
      {
        resolution: String,
        url: String,
        size: Number,
      },
    ],

    // 🔹 Status
    status: {
      type: String,
      enum: [
        "pending",
        "uploading",
        "processing",
        "review-required",
        "completed",
        "failed",
      ],
      default: "pending",
      index: true,
    },
    processingProgress: { type: Number, default: 0, select: false },
    processError: { type: String, select: false },

    // 🔹 Metrics (Shudhu numbers rakho)
    views: { type: Number, default: 0, index: -1 },
    likes: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false, index: true },
    isPremium: { type: Boolean, default: false, index: true },

    // 🔹 Relations
    stars: [{ type: Schema.Types.ObjectId, ref: "Person", index: true }],
    network: { type: Schema.Types.ObjectId, ref: "Brand", index: true },

    // 🔹 SEO Section
    seo: {
      type: {
        metaTitle: { type: String, trim: true },
        metaDescription: { type: String, trim: true },
        keywords: { type: [String], trim: true },
        ogImage: { type: String },
        _id: false,
      },
    },

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

videoSchema.path("seo").select(false);
videoSchema.path("thumbnailOptions").select(false);
videoSchema.path("previewOptions").select(false);

// Indexes
videoSchema.index({ title: "text", description: "text", tags: "text" });
videoSchema.index({ createdAt: -1 });
videoSchema.index({ views: -1, createdAt: -1 });

export const Video = mongoose.model("Video", videoSchema);
