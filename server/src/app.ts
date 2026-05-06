import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
require("express-async-errors");

export const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

import userRoutes from "./routes/userRoutes";
app.use("/api/users", userRoutes);
