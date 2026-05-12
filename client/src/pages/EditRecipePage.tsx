import { useEffect, useState, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api";

export default function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setContent(data.content);
      });
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    const res = await fetch(`${API_URL}/posts/${id}`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to update recipe");
      return;
    }

    navigate(`/recipe/${id}`);
  };

  return (
    <div className="recipe-form-page">
      <h1>Redigera recept</h1>
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
          Ny bild (valfritt)
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </label>
        <button type="submit">Spara ändringar</button>
      </form>
    </div>
  );
}
