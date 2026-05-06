import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <p>Smakminnen &copy; 2026</p>
      </footer>
    </div>
  );
}
