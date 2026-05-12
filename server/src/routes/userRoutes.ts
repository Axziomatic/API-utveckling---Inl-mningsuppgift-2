import { Router, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { auth, adminOnly, AuthRequest } from "../middleware/auth";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-change-me";
const router = Router();

// Register
router.post("/register", async (req: AuthRequest, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  const existing = await User.findOne({ username });
  if (existing) {
    res.status(409).json({ error: "Username already exists" });
    return;
  }

  const userCount = await User.countDocuments();
  const isAdmin = userCount === 0;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    password: hashedPassword,
    isAdmin,
  });

  res.status(201).json(user);
});

// Login
router.post("/login", async (req: AuthRequest, res: Response) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
  });

  res.json({ user, token });
});

// Logout
router.post("/logout", (_req: AuthRequest, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

// Get current user
router.get("/me", auth, async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.userId);
  if (!user) {
    res.clearCookie("token");
    res.status(401).json({ error: "User no longer exists" });
    return;
  }
  res.json(user);
});

// Get all users (admin only)
router.get("/", auth, adminOnly, async (_req: AuthRequest, res: Response) => {
  const users = await User.find();
  res.json(users);
});

// Update user role (admin only)
router.put("/:id", auth, adminOnly, async (req: AuthRequest, res: Response) => {
  const { isAdmin } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isAdmin },
    { new: true }
  );
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(user);
});

// Delete user (admin only)
router.delete("/:id", auth, adminOnly, async (req: AuthRequest, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ message: "User deleted" });
});

export default router;
