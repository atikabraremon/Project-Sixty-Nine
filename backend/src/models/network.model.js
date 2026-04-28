import mongoose from "mongoose";

const networkSchema = new mongoose.Schema(
  {
    // 🔹 Basic Info
    name: {
      type: String,
      required: [true, "Network name is required"],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },

    // 🔹 Status
    status: {
      type: String,
      enum: ["Active", "Defunct", "Hidden"],
      default: "Active",
      index: true,
    },
    isVerified: { type: Boolean, default: true },

    // 🔹 Media
    media: {
      type: {
        logo: {
          url: { type: String, default: "" },
          fileKey: { type: String, default: "" },
        },
        coverImage: {
          url: { type: String, default: "" },
          fileKey: { type: String, default: "" },
        },
      },
      _id: false,
    },
    // 🔹 Company Details
    foundedDate: Date,
    location: String,
    website: String,

    // 🔹 Type
    type: {
      type: String,
      enum: ["Network", "Studio", "Site", "Production House"],
      required: true,
      index: true,
    },

    priority: {
      type: Number,
      default: 0,
      index: true,
    },

    // 🔹 Hierarchy
    parentNetwork: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Network",
      default: null,
      index: true,
    },

    // 🔹 Social & Links
    social: {
      type: {
        twitter: String,
        instagram: String,
        others: String,
      },
      _id: false,
    },

    // 🔹 Stats & Metadata
    metadata: {
      popularity: { type: Number, default: 0, index: -1 },
      totalVideos: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// --- Indexes ---
networkSchema.index({ name: "text" });

// --- Virtual Populate (Very Important) --
networkSchema.virtual("videos", {
  ref: "Video", // Video model-er nam
  localField: "_id", // network-er ID
  foreignField: "network", // Video schema-r jei field-e network ID
});

// Ei network-er under-e ki ki sub-networks/sites ache
networkSchema.virtual("subNetworks", {
  ref: "Network",
  localField: "_id",
  foreignField: "parentNetwork",
});

networkSchema.virtual("members", {
  ref: "Affiliation",
  localField: "_id",
  foreignField: "network",
});

export const Network = mongoose.model("Network", networkSchema);
