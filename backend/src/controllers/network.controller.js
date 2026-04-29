import { Affiliation } from "../models/affiliation.model.js";
import { Network } from "../models/network.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateSlug } from "../utils/slugify.js";
import { networkValidationSchema } from "../validation/network.validation.js";

// crate Network
export const createNetwork = asyncHandler(async (req, res) => {
  const validatedBody = networkValidationSchema.safeParse(req.body);

  if (!validatedBody.success) {
    const errorMessage =
      validatedBody.error?.errors?.[0]?.message || "Validation failed";
    throw new ApiError(400, errorMessage);
  }

  const data = validatedBody.data;

  // Duplicate check
  const existingNetwork = await Network.findOne({ name: data.name });

  if (existingNetwork)
    throw new ApiError(
      400,
      "Network already exists. Duplicate entry is not allowed."
    );

  const lastNetwork = await Network.findOne()
    .sort("-priority")
    .select("priority");

  const nextGlobalPriority = lastNetwork ? (lastNetwork.priority || 0) + 1 : 1;

  const slug = generateSlug(data.name);

  const newNetwork = await Network.create({
    ...data,
    slug,
    priority: nextGlobalPriority,
    createdBy: req.user?._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, newNetwork, "Network created successfully"));
});

// Swap Network Order
export const swapNetworkPriority = asyncHandler(async (req, res) => {
  const { firstNetworkId, secondNetworkId } = req.body;

  if (!firstNetworkId || !secondNetworkId) {
    throw new ApiError(400, "Both Network IDs are required for swapping");
  }

  // 1. Duto person-kei khuje ber koro
  const firstNetwork = await Network.findById(firstNetworkId);
  const secondNetwork = await Network.findById(secondNetworkId);

  if (!firstNetwork || !secondNetwork) {
    throw new ApiError(404, "One or both persons not found");
  }

  // 2. Priority swap koro (Temporary variable use kore)
  const tempPriority = firstNetwork.priority;
  firstNetwork.priority = secondNetwork.priority;
  secondNetwork.priority = tempPriority;

  // 3. Database-e save koro
  await firstNetwork.save();
  await secondNetwork.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Order swapped successfully"));
});

// Delete Network
// DELETE /api/v1/network/:id
export const deleteNetwork = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const network = await Network.findById(id);
  if (!network) throw new ApiError(404, "Network not found");

  // 1. Related data clean-up
  // 'network' field onujayi sob affiliation delete hobe
  await Affiliation.deleteMany({ network: id });

  // 2. Jodi ei network-ti karo 'parentNetwork' hoy, shegulo ke null kore dewa uchit
  await Network.updateMany({ parentNetwork: id }, { parentNetwork: null });

  await Network.findByIdAndDelete(id);

  res.status(200).json(new ApiResponse(200, { id }, "Deleted successfully"));
});

// Get all Network with Pagination
// /api/v1/network?page=1&limit=10&sortBy=latest
export const getAllNetwork = asyncHandler(async (req, res) => {
  // 1. Query parameters theke value gulo nawa
  const { page = 1, limit = 10, sortBy = "priority" } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // 2. Sorting map ready kora
  // Frontend 'latest' pathale createdAt: -1 hobe, noile priority: -1 hobe
  const sortCriteria =
    sortBy === "latest" ? { createdAt: -1 } : { priority: -1 };

  // 3. Database query run kora
  const [network, totalNetwork] = await Promise.all([
    Network.find().sort(sortCriteria).skip(skip).limit(limitNum),
    Network.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalNetwork / limitNum);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        network,
        pagination: {
          totalNetwork,
          totalPages,
          currentPage: pageNum,
          pageSize: network.length,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
      `Network fetched by ${sortBy}`
    )
  );
});
