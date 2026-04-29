import mongoose from "mongoose";
import { Affiliation } from "../models/affiliation.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * @desc    Toggle Affiliation (Add or Remove)
 * @route   POST /api/affiliations/toggle
 * @access  Private/Admin
 */
export const toggleAffiliation = asyncHandler(async (req, res) => {
  const { personId, networkId, roleInNetwork } = req.body;

  // 🔹 1. ID Validation
  if (
    !mongoose.Types.ObjectId.isValid(personId) ||
    !mongoose.Types.ObjectId.isValid(networkId)
  ) {
    res.status(400);
    throw new Error("Invalid Person or Network ID");
  }

  // 🔹 2. Connection Check
  const existing = await Affiliation.findOne({
    person: personId,
    network: networkId,
  });

  if (existing) {
    // Jodi thake, remove koro
    await Affiliation.findByIdAndDelete(existing._id);

    return res.status(200).json({
      success: true,
      action: "removed",
      message: "Affiliation removed successfully",
    });
  }

  // 🔹 3. Create Connection
  const newAffiliation = await Affiliation.create({
    person: personId,
    network: networkId,
    roleInNetwork: roleInNetwork || "Actor",
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, newAffiliation, "Affiliation added successfully")
    );
});
