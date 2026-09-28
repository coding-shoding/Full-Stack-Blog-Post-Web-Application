import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

export default function Create() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", author: "", tags: "", content: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const post = await api.create(form);
      navigate(`/post/${post._id}`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <>
      <h1>New post</h1>
      <form onSubmit={submit} className="form">
        <label>Title
          <input name="title" value={form.title} onChange={change} required />
        </label>
        <label>Author
          <input name="author" value={form.author} onChange={change} placeholder="Anonymous" />
        </label>
        <label>Tags (comma separated)
          <input name="tags" value={form.tags} onChange={change} placeholder="react, node" />
        </label>
        <label>Content
          <textarea name="content" rows="10" value={form.content} onChange={change} required />
        </label>
        {error && <p className="notice error">{error}</p>}
        <button className="btn" disabled={saving}>{saving ? "Publishing..." : "Publish post"}</button>
      </form>
    </>
  );
}
