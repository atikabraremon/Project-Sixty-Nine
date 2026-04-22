import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "super-admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "super-admin") {
    return res
      .status(403)
      .json({ message: "Access denied. Super Admin only." });
  }
  next();
};

export const verifyJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    // Eikhane throw na kore next(error) use kora safe
    next(new ApiError(401, error?.message || "Invalid access token"));
  }
});
