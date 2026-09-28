import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import PostSummary from "../components/PostSummary.jsx";

export default function Home() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.latest().then(setPosts).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <h1>Latest posts</h1>
      {error && <p className="notice error">{error}</p>}
      {!posts && !error && <p className="notice">Loading posts...</p>}
      {posts?.length === 0 && (
        <p className="notice">No posts yet. <Link to="/create">Write the first one.</Link></p>
      )}
      {posts?.map((p) => <PostSummary key={p._id} post={p} />)}
      {posts?.length > 0 && <p><Link to="/archive">Browse all posts</Link></p>}
    </>
  );
}
