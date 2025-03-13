import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/home/HomePage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PrivateRoute from "./pages/PrivateRoute";
import AuthForm from "./components/auth/AuthForm";
import NewsByTag from "./pages/user/NewsByTagPage";
import CreateNewsPage from "./pages/user/CreateNewsPage";
import StatisticsPage from "./pages/user/StatisticsPage";

function App() {
  return (
    <div className="App">
      <Header />
      <Toaster
        position="bottom-right"
        toastOptions={{ style: { backgroundColor: "#000", color: "#fff" } }}
      />
      <main>
        <Routes>
          <Route path="/news" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route element={<PrivateRoute />}>
            <Route path="/news-by-tag" element={<NewsByTag />} />
            <Route path="/create-news" element={<CreateNewsPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
          </Route>
          #
          <Route path={"*"} element={<Navigate to={"/news"} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
