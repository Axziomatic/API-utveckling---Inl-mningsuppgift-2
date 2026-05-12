import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api";

export default function CreateRecipePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    const res = await fetch(`${API_URL}/posts`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create recipe");
      return;
    }

    navigate("/");
  };

  return (
    <div className="recipe-form-page">
      <h1>Nytt recept</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="recipe-form">
        <label>
          Titel
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Innehåll
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            required
          />
        </label>
        <label>
          Bild
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </label>
        <button type="submit">Skapa recept</button>
      </form>
    </div>
  );
}
