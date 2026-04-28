import mongoose, { Schema } from "mongoose";

const viewSchema = new Schema(
  {
    // 🔹 Core Relations
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
      index: true,
    },

    // 🔹 Identity & Tracking (Public user-er jonno)
    visitorId: {
      type: String,
      required: true,
      index: true,
    }, // Browser-er LocalStorage theke pathabe (Persistent)

    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    }, // Refresh marle ba notun kore video play korle generate hobe (Temporary)

    // 🔹 Watch Metrics (Heartbeat diye update hobe)
    watchTime: {
      type: Number,
      default: 0,
    }, // Seconds-e koto khon video-ta chollo

    isCompleted: {
      type: Boolean,
      default: false,
    }, // Jodi duration-er pray shesh porjonto dekhe

    // 🔹 Technical Info
    device: {
      type: { type: String }, // Mobile, Desktop, Tablet
      os: String, // Windows, Android, iOS
      browser: String, // Chrome, Safari
    },

    // 🔹 Location & Source
    ip: { type: String },
    location: {
      city: String,
      country: String,
      countryCode: String,
      regionName: String,
      lon: Number,
      lat: Number,
    },

    referrer: {
      type: String,
      default: "Direct",
    }, // User kothay theke link-e click kore ashlo

    // 🔹 Metadata
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true, // createdAt and updatedAt auto thakbe
  }
);

// --- Indexing for Analytics Queries ---
// 1. Video-wise views sorted by time
viewSchema.index({ videoId: 1, createdAt: -1 });

// 2. Retention Analytics (WatchTime calculation-er jonno)
viewSchema.index({ videoId: 1, watchTime: -1 });

export const VideoView = mongoose.model("VideoView", viewSchema);
