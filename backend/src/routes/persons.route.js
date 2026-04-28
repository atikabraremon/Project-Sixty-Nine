import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPerson } from "../controllers/person.controller.js";


const router = Router();

router.route("/create").post(createPerson);

export default router;
