import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const API_URL = "http://localhost:3000/api";

interface Post {
  _id: string;
  title: string;
  imageUrl?: string;
  createdAt: string;
}

export default function MyRecipesPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/posts`)
      .then((res) => res.json())
      .then((data) =>
        setPosts(data.filter((p: any) => p.author._id === user?._id))
      );
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Är du säker på att du vill ta bort detta recept?")) return;
    const res = await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) setPosts(posts.filter((p) => p._id !== id));
  };

  return (
    <div className="my-recipes">
      <h1>Mina recept</h1>
      {posts.length === 0 ? (
        <p className="empty-state">
          Du har inga recept ännu. <Link to="/create">Skapa ett!</Link>
        </p>
      ) : (
        <div className="recipe-list">
          {posts.map((post) => (
            <div key={post._id} className="recipe-list-item">
              <Link to={`/recipe/${post._id}`}>{post.title}</Link>
              <div className="recipe-list-actions">
                <Link to={`/edit/${post._id}`} className="btn btn-small">
                  Redigera
                </Link>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="btn btn-small btn-danger"
                >
                  Ta bort
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
