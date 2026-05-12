import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:3000/api";

interface Post {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: { _id: string; username: string } | null;
  createdAt: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <div className="home">
      <h1>Välkommen till Smakminnen</h1>
      <p className="subtitle">Dela dina favoritrecept med världen</p>
      <div className="recipe-grid">
        {posts.map((post) => (
          <Link to={`/recipe/${post._id}`} key={post._id} className="recipe-card">
            {post.imageUrl && (
              <img
                src={`http://localhost:3000${post.imageUrl}`}
                alt={post.title}
                className="recipe-card-image"
              />
            )}
            <div className="recipe-card-body">
              <h2>{post.title}</h2>
              <p className="recipe-card-author">Av {post.author?.username ?? "okänd"}</p>
            </div>
          </Link>
        ))}
        {posts.length === 0 && (
          <p className="empty-state">Inga recept ännu. Bli den första att dela!</p>
        )}
      </div>
    </div>
  );
}
