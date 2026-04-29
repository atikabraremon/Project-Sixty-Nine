import { Router } from "express";
import { restrictTo, verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPerson,
  deletePerson,
  getAllPerson,
  swapPersonPriority,
} from "../controllers/person.controller.js";

const router = Router();

// Base Route: /api/v1/persons

// 1. Get All Persons with Pagination & Sorting (GET)
// query: /api/v1/persons?page=1&limit=20&sortBy=latest
// router
//   .route("/")
//   .get(verifyJWT, restrictTo("admin", "super-admin"), getAllPerson);
router.route("/").get(getAllPerson);

// 2. Create Person (POST)
// post: /api/v1/persons/create
// router
//   .route("/create")
//   .post(verifyJWT, restrictTo("admin", "super-admin"), createPerson);
router.route("/create").post(createPerson);

// 3. Swap Person Priority (PUT)
// URL: /api/v1/persons/swap-priority
// router
//   .route("/swap-priority")
//   .put(verifyJWT, restrictTo("admin", "super-admin"), swapPersonPriority);
router.route("/swap-priority").put(swapPersonPriority);

// 4. Delete Person (DELETE)
// query: /api/v1/persons/:id
// router
//   .route("/:id")
//   .delete(verifyJWT, restrictTo("admin", "super-admin"), deletePerson);
router.route("/:id").delete(deletePerson);

export default router;
