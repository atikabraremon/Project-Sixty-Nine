import mongoose, { Schema } from "mongoose";

const affiliationSchema = new Schema(
  {
    person: {
      type: Schema.Types.ObjectId,
      ref: "Person",
      required: true,
      index: true,
    },
    network: {
      type: Schema.Types.ObjectId,
      ref: "Network",
      required: true,
      index: true,
    },
    roleInNetwork: {
      type: String,
      default: "Actor",
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Ek-i person ek-i network-e jeno duplicate na hoy
affiliationSchema.index({ person: 1, network: 1 }, { unique: true });

export const Affiliation = mongoose.model("Affiliation", affiliationSchema);
