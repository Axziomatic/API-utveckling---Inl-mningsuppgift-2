import { Router, Response } from "express";
import multer from "multer";
import path from "path";
import { Post } from "../models/Post";
import { auth, AuthRequest } from "../middleware/auth";

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../uploads"),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });
const router = Router();

// Get all posts (public)
router.get("/", async (_req, res: Response) => {
  const posts = await Post.find().populate("author", "username").sort({ createdAt: -1 });
  res.json(posts);
});

// Get single post (public)
router.get("/:id", async (req, res: Response) => {
  const post = await Post.findById(req.params.id).populate("author", "username");
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(post);
});

// Create post (authenticated)
router.post("/", auth, upload.single("image"), async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400).json({ error: "Title and content are required" });
    return;
  }

  const post = await Post.create({
    title,
    content,
    author: req.userId,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
  });

  res.status(201).json(post);
});

// Update post (author or admin)
router.put("/:id", auth, upload.single("image"), async (req: AuthRequest, res: Response) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  if (post.author.toString() !== req.userId && !req.isAdmin) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }

  const { title, content } = req.body;
  if (title) post.title = title;
  if (content) post.content = content;
  if (req.file) post.imageUrl = `/uploads/${req.file.filename}`;

  await post.save();
  res.json(post);
});

// Delete post (author or admin)
router.delete("/:id", auth, async (req: AuthRequest, res: Response) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  if (post.author.toString() !== req.userId && !req.isAdmin) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }

  await post.deleteOne();
  res.json({ message: "Post deleted" });
});

export default router;
