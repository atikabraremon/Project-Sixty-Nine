import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { JSON_LIMIT } from "./constants.js";
import corsOptions from "./config/corsOptions.js";
import userRouter from "./routes/user.route.js";
import upload from "./routes/upload.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors(corsOptions));

app.use(express.json({ limit: JSON_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: JSON_LIMIT }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);

app.use("/api/v1/upload", upload);

app.use(errorHandler);

export default app;
