import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import router from "./media.route.js";
import {
  createNetwork,
  deleteNetwork,
  getAllNetwork,
  swapNetworkPriority,
} from "../controllers/network.controller.js";

const router = Router();

// Base Route: /api/v1/network

// 1. Get All Network with Pagination & Sorting (GET)
// query: /api/v1/network?page=1&limit=20&sortBy=latest
// router
//   .route("/")
//   .get(verifyJWT, restrictTo("admin", "super-admin"), getAllNetwork);
router.route("/").get(getAllNetwork);

// 2. Create Network (POST)
// post: /api/v1/network/create
// router
//   .route("/create")
//   .post(verifyJWT, restrictTo("admin", "super-admin"), createNetwork);
router.route("/create").post(createNetwork);

// 3. Swap Network Priority (PUT)
// URL: /api/v1/network/swap-priority
// router
//   .route("/swap-priority")
//   .put(verifyJWT, restrictTo("admin", "super-admin"), swapNetworkPriority);
router.route("/swap-priority").put(swapNetworkPriority);

// 4. Delete Network (DELETE)
// query: /api/v1/network/:id
// router
//   .route("/:id")
//   .delete(verifyJWT, restrictTo("admin", "super-admin"), deleteNetwork);
router.route("/:id").delete(deleteNetwork);

export default router;
