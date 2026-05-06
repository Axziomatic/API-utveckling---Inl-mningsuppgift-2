import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          Smakminnen
        </Link>
        <nav className="nav">
          <Link to="/">Hem</Link>
          {user ? (
            <>
              <Link to="/create">Nytt recept</Link>
              <Link to="/my-recipes">Mina recept</Link>
              {user.isAdmin && <Link to="/admin">Admin</Link>}
              <button onClick={logout} className="nav-button">
                Logga ut
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Logga in</Link>
              <Link to="/register">Registrera</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
