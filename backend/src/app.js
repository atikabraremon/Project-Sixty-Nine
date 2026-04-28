import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { JSON_LIMIT } from "./constants.js";
import corsOptions from "./config/corsOptions.js";
import userRouter from "./routes/user.route.js";
import mediaRouter from "./routes/media.route.js";
import personsRouter from "./routes/persons.route.js";
import affiliationRouter from "./routes/affiliation.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors(corsOptions));

app.use(express.json({ limit: JSON_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: JSON_LIMIT }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);

app.use("/api/v1/media", mediaRouter);

app.use("/api/v1/persons", personsRouter);
app.use("/api/v1/affiliation", affiliationRouter);

// app.use(errorHandler);

export default app;
