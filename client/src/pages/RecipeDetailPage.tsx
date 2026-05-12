import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const API_URL = "http://localhost:3000/api";

interface Post {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: { _id: string; username: string } | null;
  createdAt: string;
}

export default function RecipeDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Är du säker på att du vill ta bort detta recept?")) return;
    const res = await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) navigate("/");
  };

  if (!post) return <p>Laddar...</p>;

  const isOwner = user && post.author && user._id === post.author._id;
  const canEdit = isOwner || user?.isAdmin;

  return (
    <div className="recipe-detail">
      {post.imageUrl && (
        <img
          src={`http://localhost:3000${post.imageUrl}`}
          alt={post.title}
          className="recipe-detail-image"
        />
      )}
      <h1>{post.title}</h1>
      <p className="recipe-detail-author">
        Av {post.author?.username ?? "okänd"} &middot;{" "}
        {new Date(post.createdAt).toLocaleDateString("sv-SE")}
      </p>
      <div className="recipe-detail-content">{post.content}</div>
      {canEdit && (
        <div className="recipe-detail-actions">
          <Link to={`/edit/${post._id}`} className="btn">
            Redigera
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Ta bort
          </button>
        </div>
      )}
    </div>
  );
}
