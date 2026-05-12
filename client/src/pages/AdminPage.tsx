import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const API_URL = "http://localhost:3000/api";

interface User {
  _id: string;
  username: string;
  isAdmin: boolean;
}

interface Post {
  _id: string;
  title: string;
  author: { _id: string; username: string } | null;
}

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/users`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUsers(data));

    fetch(`${API_URL}/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  const toggleAdmin = async (userId: string, currentStatus: boolean) => {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ isAdmin: !currentStatus }),
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers(users.map((u) => (u._id === userId ? updated : u)));
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Är du säker på att du vill ta bort denna användare?")) return;
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) setUsers(users.filter((u) => u._id !== userId));
  };

  const deletePost = async (postId: string) => {
    if (!confirm("Är du säker på att du vill ta bort detta recept?")) return;
    const res = await fetch(`${API_URL}/posts/${postId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) setPosts(posts.filter((p) => p._id !== postId));
  };

  return (
    <div className="admin-page">
      <h1>Admin</h1>

      <section>
        <h2>Användare</h2>
        <div className="admin-list">
          {users.map((u) => (
            <div key={u._id} className="admin-list-item">
              <span>
                {u.username} {u.isAdmin && <strong>(Admin)</strong>}
              </span>
              <div className="admin-list-actions">
                <button
                  onClick={() => toggleAdmin(u._id, u.isAdmin)}
                  className="btn btn-small"
                >
                  {u.isAdmin ? "Ta bort admin" : "Gör till admin"}
                </button>
                {user && u._id !== user._id && (
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="btn btn-small btn-danger"
                  >
                    Ta bort
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Alla recept</h2>
        <div className="admin-list">
          {posts.map((post) => (
            <div key={post._id} className="admin-list-item">
              <Link to={`/recipe/${post._id}`}>
                {post.title} <small>av {post.author?.username ?? "okänd"}</small>
              </Link>
              <div className="admin-list-actions">
                <Link to={`/edit/${post._id}`} className="btn btn-small">
                  Redigera
                </Link>
                <button
                  onClick={() => deletePost(post._id)}
                  className="btn btn-small btn-danger"
                >
                  Ta bort
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
