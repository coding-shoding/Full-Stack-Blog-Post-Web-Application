import { Link } from "react-router-dom";
import { formatDate } from "../api.js";

export default function PostSummary({ post }) {
  const excerpt = post.content.length > 160 ? post.content.slice(0, 160).trimEnd() + "..." : post.content;
  return (
    <article className="summary">
      <h3><Link to={`/post/${post._id}`}>{post.title}</Link></h3>
      <p className="meta">{post.author} on {formatDate(post.createdAt)}</p>
      <p>{excerpt}</p>
      {post.tags?.length > 0 && (
        <ul className="tags">{post.tags.map((t) => <li key={t}>{t}</li>)}</ul>
      )}
    </article>
  );
}
