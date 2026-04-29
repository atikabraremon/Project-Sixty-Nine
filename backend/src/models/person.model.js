import mongoose, { Schema } from "mongoose";
import z from "zod";

const personSchema = new mongoose.Schema(
  {
    // 🔹 Basic Identity
    name: {
      type: String,
      required: [true, "Person name is required"],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    bio: {
      type: String,
      maxLength: [1000, "Bio cannot exceed 1000 characters"],
    },

    // 🔹 Personal Details
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Non-binary"],
      required: true,
    },
    birthDate: { type: Date },
    deathDate: { type: Date },
    placeOfBirth: { type: String },
    nationality: {
      type: [String],
      default: [],
    },

    // 🔹 Media & Assets
    avatar: {
      url: { type: String, default: "" },
      fileKey: { type: String, default: "" },
      _id: false,
    },
    coverImage: {
      url: { type: String, default: "" },
      fileKey: { type: String, default: "" },
      _id: false,
    },

    isVerified: { type: Boolean, default: true },
    isTrending: { type: Boolean, default: false },

    priority: {
      type: Number,
      default: 0,
      index: true,
    },

    // 🔹 Professional Info
    knownFor: {
      type: [String],
      enum: ["Actor", "Director", "Producer", "Writer", "Cinematographer"],
      default: ["Actor"],
      index: true,
    },

    // 🔹 Social Presence
    socialLinks: {
      type: {
        instagram: { type: String, trim: true },
        twitter: { type: String, trim: true },
        facebook: { type: String, trim: true },
        others: { type: String, trim: true },
        _id: false,
      },
      default: {},
      validate: {
        validator: function (v) {
          return v && typeof v === "object" && !Array.isArray(v);
        },
        message: "socialLinks must be an object!",
      },
    },

    // 🔹 Stats & Business Logic
    metadata: {
      popularity: { type: Number, default: 0, min: 0 },
      totalVideos: { type: Number, default: 0 },
      _id: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      select: false,
    },
  },

  {
    timestamps: true,
    // ❗ AI DUITA LINE ADD KORA KHUB DORKAR VIRTUALS ER JONNO
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// --- Indexes ---
personSchema.index({ name: "text" });
// Index on knownFor field along with sorting fields
personSchema.index({ knownFor: 1, priority: -1, createdAt: -1 });

// --- ❗ Virtual Populate (Ei connection ta bad porechilo) ---
personSchema.virtual("videos", {
  ref: "Video", // Video model er reference
  localField: "_id", // Person er ID
  foreignField: "stars", // Video model er jei array-te star ID thake
});

personSchema.virtual("affiliations", {
  ref: "Affiliation", // Affiliation model-er name
  localField: "_id",
  foreignField: "person",
});

export const Person = mongoose.model("Person", personSchema);
