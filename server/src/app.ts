import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import multer from "multer";
require("express-async-errors");

export const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err.name === "CastError") {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  if (err instanceof multer.MulterError) {
    const message = err.code === "LIMIT_FILE_SIZE" ? "Image is too large" : err.message;
    res.status(400).json({ error: message });
    return;
  }
  if (err.message === "Only image uploads are allowed") {
    res.status(400).json({ error: err.message });
    return;
  }
  if (err.code === 11000) {
    res.status(409).json({ error: "Duplicate value" });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};

app.use(errorHandler);
