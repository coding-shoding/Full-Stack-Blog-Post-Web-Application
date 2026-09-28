import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatDate } from "../api.js";

export default function Archive() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.list().then(setPosts).catch((e) => setError(e.message));
  }, []);

  async function remove(post) {
    if (!window.confirm(`Delete "${post.title}"?`)) return;
    try {
      await api.remove(post._id);
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <h1>Archive</h1>
      {error && <p className="notice error">{error}</p>}
      {!posts && !error && <p className="notice">Loading posts...</p>}
      {posts?.length === 0 && <p className="notice">Nothing here yet. <Link to="/create">Create a post.</Link></p>}
      {posts?.length > 0 && (
        <table className="archive">
          <thead><tr><th>Title</th><th>Author</th><th>Date</th><th></th></tr></thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p._id}>
                <td><Link to={`/post/${p._id}`}>{p.title}</Link></td>
                <td>{p.author}</td>
                <td>{formatDate(p.createdAt)}</td>
                <td><button className="link-danger" onClick={() => remove(p)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
