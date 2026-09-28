import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, formatDate } from "../api.js";

export default function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [form, setForm] = useState(null); // non-null while editing
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(id).then(setPost).catch((e) => setError(e.message));
  }, [id]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  function startEdit() {
    setForm({ title: post.title, author: post.author, tags: (post.tags || []).join(", "), content: post.content });
  }

  async function save(e) {
    e.preventDefault();
    setError("");
    try {
      setPost(await api.update(id, form));
      setForm(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove() {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    try {
      await api.remove(id);
      navigate("/archive");
    } catch (err) {
      setError(err.message);
    }
  }

  if (error && !post) return <p className="notice error">{error} <Link to="/">Go home</Link></p>;
  if (!post) return <p className="notice">Loading post...</p>;

  if (form) {
    return (
      <>
        <h1>Edit post</h1>
        <form onSubmit={save} className="form">
          <label>Title<input name="title" value={form.title} onChange={change} required /></label>
          <label>Author<input name="author" value={form.author} onChange={change} /></label>
          <label>Tags (comma separated)<input name="tags" value={form.tags} onChange={change} /></label>
          <label>Content<textarea name="content" rows="10" value={form.content} onChange={change} required /></label>
          {error && <p className="notice error">{error}</p>}
          <div className="actions">
            <button className="btn">Save changes</button>
            <button type="button" className="btn ghost" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      </>
    );
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <p className="meta">
        {post.author} on {formatDate(post.createdAt)}
        {post.updatedAt !== post.createdAt && ` (edited ${formatDate(post.updatedAt)})`}
      </p>
      {post.tags?.length > 0 && <ul className="tags">{post.tags.map((t) => <li key={t}>{t}</li>)}</ul>}
      <div className="body">{post.content}</div>
      {error && <p className="notice error">{error}</p>}
      <div className="actions">
        <button className="btn" onClick={startEdit}>Edit post</button>
        <button className="btn danger" onClick={remove}>Delete post</button>
      </div>
    </article>
  );
}
