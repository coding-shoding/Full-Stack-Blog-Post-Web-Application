import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();
const collection = db.collection("posts");

// Validate the body of create/update requests
function validate(body, requireAll) {
  const out = {};
  const { title, author, content, tags } = body || {};

  if (requireAll || title !== undefined) {
    if (typeof title !== "string" || !title.trim()) return { error: "Title is required" };
    out.title = title.trim();
  }
  if (requireAll || content !== undefined) {
    if (typeof content !== "string" || !content.trim()) return { error: "Content is required" };
    out.content = content.trim();
  }
  if (author !== undefined) out.author = String(author).trim() || "Anonymous";
  else if (requireAll) out.author = "Anonymous";

  if (tags !== undefined) {
    const list = Array.isArray(tags) ? tags : String(tags).split(",");
    out.tags = list.map((t) => String(t).trim()).filter(Boolean);
  } else if (requireAll) out.tags = [];

  return { data: out };
}

function parseId(req, res) {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json({ error: "Invalid post id" });
    return null;
  }
  return new ObjectId(req.params.id);
}

// GET /posts - all posts, newest first
router.get("/", async (req, res, next) => {
  try {
    const results = await collection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(results);
  } catch (err) { next(err); }
});

// GET /posts/latest - 3 most recent posts
router.get("/latest", async (req, res, next) => {
  try {
    const results = await collection.find({}).sort({ createdAt: -1 }).limit(3).toArray();
    res.json(results);
  } catch (err) { next(err); }
});

// GET /posts/:id - one post
router.get("/:id", async (req, res, next) => {
  try {
    const _id = parseId(req, res);
    if (!_id) return;
    const post = await collection.findOne({ _id });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) { next(err); }
});

// POST /posts - create
router.post("/", async (req, res, next) => {
  try {
    const { data, error } = validate(req.body, true);
    if (error) return res.status(400).json({ error });
    const now = new Date();
    const doc = { ...data, createdAt: now, updatedAt: now };
    const result = await collection.insertOne(doc);
    res.status(201).json({ ...doc, _id: result.insertedId });
  } catch (err) { next(err); }
});

// PATCH /posts/:id - update
router.patch("/:id", async (req, res, next) => {
  try {
    const _id = parseId(req, res);
    if (!_id) return;
    const { data, error } = validate(req.body, false);
    if (error) return res.status(400).json({ error });
    if (!Object.keys(data).length) return res.status(400).json({ error: "Nothing to update" });

    const updated = await collection.findOneAndUpdate(
      { _id },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    if (!updated) return res.status(404).json({ error: "Post not found" });
    res.json(updated);
  } catch (err) { next(err); }
});

// DELETE /posts/:id - delete
router.delete("/:id", async (req, res, next) => {
  try {
    const _id = parseId(req, res);
    if (!_id) return;
    const result = await collection.deleteOne({ _id });
    if (!result.deletedCount) return res.status(404).json({ error: "Post not found" });
    res.json({ message: "Post deleted" });
  } catch (err) { next(err); }
});

export default router;
