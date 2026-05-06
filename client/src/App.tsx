import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateRecipePage from "./pages/CreateRecipePage";
import EditRecipePage from "./pages/EditRecipePage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import MyRecipesPage from "./pages/MyRecipesPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/create" element={<CreateRecipePage />} />
            <Route path="/edit/:id" element={<EditRecipePage />} />
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
            <Route path="/my-recipes" element={<MyRecipesPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
