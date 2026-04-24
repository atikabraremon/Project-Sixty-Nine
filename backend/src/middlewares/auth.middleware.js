import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // 1. User login check (Auth middleware er por eita use korben)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
        errorCode: "AUTH_REQUIRED",
      });
    }

    // 2. Role permission check
    // user.role jodi roles array er moddhe thake, tobe access pabe
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
        errorCode: "FORBIDDEN_ACCESS",
      });
    }

    next();
  };
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
