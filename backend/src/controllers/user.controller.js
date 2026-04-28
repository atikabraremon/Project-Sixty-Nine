import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { uploadSingleToR2 } from "../services/upload.service.js";
import { deleteFromR2 } from "../services/delete.service.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    // Model method gulo jodi async hoy, tobe oboshoy await dite hobe
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error details: ", error);
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  // ১. বেসিক ফিল্ড চেক (ফুল নেম, ইমেইল, ইউজারনেম, পাসওয়ার্ড)
  if (
    [fullName, password, email, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(
      400,
      "Full Name, Email, Username and Password are required"
    );
  }

  // ২. ইউজার আগে থেকে আছে কি না চেক
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(400, "User with email or username already exists");
  }

  const avatarFile = req.files?.avatar?.[0] || req.files?.avatarFile?.[0];

  let avatarKey = "";
  if (avatarFile) {
    const avatarUpload = await uploadSingleToR2(avatarFile, "users/avatar");
    if (!avatarUpload.success) {
      throw new ApiError(500, "Failed to upload avatar to R2");
    }
    avatarKey = avatarUpload.key; // আপলোড সফল হলে কী (key) স্টোর করা
  }

  // ৫. ডাটাবেসে ইউজার তৈরি
  try {
    const user = await User.create({
      fullName,
      avatar: avatarKey,
      email,
      password,
      username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User Registered Successfully"));
  } catch (dbError) {
    if (avatarKey) {
      await deleteFromR2(avatarKey);
    }

    throw new ApiError(400, dbError?.message || "Registration failed");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Either email or username must be provided");
  }

  if (!password) {
    throw new ApiError(400, "Password is required.");
  }

  // 1. User khunje ber kora
  const user = await User.findOne({
    $or: [{ username }, { email }],
  }).select("+password");

  // 2. Prothome check korun user database-e ache kina (IMPORTANT)
  // if (!user) {
  //   throw new ApiError(404, "User does not exist");
  // }

  // eita publisher jonno dite hobe
  if (!user) {
    throw new ApiError(404, "Invalid user credentials");
  }

  // 3. Tarpor check korun user verified kina
  if (!user.isVerified) {
    throw new ApiError(401, "Your account is not verified.");
  }

  // 4. Password check kora
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // --- Baki code same thakbe ---
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  try {
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id, options);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh Token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);

  // Instance method use korte hobe, oldPassword pass korte hobe
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password.");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, username, email } = req.body;

  if (!fullName || !email || !username) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { fullName, email, username },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully."));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  // multer.single('avatar') ব্যবহার করলে ফাইল req.file এ থাকে
  const avatarFile = req.file;

  if (!avatarFile) {
    throw new ApiError(400, "Avatar file is missing");
  }

  // R2 তে আপলোড
  const avatarUpload = await uploadSingleToR2(avatarFile, "avatars");

  if (!avatarUpload.success) {
    throw new ApiError(500, "Error while uploading avatar to R2");
  }

  // ডাটাবেস আপডেট
  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatarUpload.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails, // Add this
  updateUserAvatar, // Add this
};
