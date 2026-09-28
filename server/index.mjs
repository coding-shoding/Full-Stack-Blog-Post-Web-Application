import "./loadEnvironment.mjs";
import express from "express";
import cors from "cors";
import posts from "./routes/posts.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/posts", posts);

// Unknown routes
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// Uncaught errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Unexpected server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
