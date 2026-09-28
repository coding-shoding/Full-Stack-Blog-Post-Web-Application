import { NavLink, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Create from "./pages/Create.jsx";
import Post from "./pages/Post.jsx";
import Archive from "./pages/Archive.jsx";

export default function App() {
  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand">Inkwell</Link>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/archive">Archive</NavLink>
          <NavLink to="/create" className="btn-nav">New post</NavLink>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/create" element={<Create />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="*" element={<p className="notice">Page not found. <Link to="/">Go home</Link></p>} />
        </Routes>
      </main>
    </>
  );
}
