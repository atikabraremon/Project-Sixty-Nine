import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { createPerson } from "../controllers/person.controller.js";
import router from "./media.route.js";

const router = Router();

// router.route("/create").post(createPerson);

export default router;
