import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import { Toaster } from "react-hot-toast";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PrivateRoute from "./pages/PrivateRoute";
import AuthForm from "./components/auth/AuthForm";
import HomeLibrary from "./pages/home";
import UploadBookPage from "./pages/user/UploadBookPage";
import CheckOutBookPage from "./pages/user/CheckOutBookPage";
import Search from "./pages/user/SearchPage";

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
          <Route path="/" element={<HomeLibrary />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route element={<PrivateRoute />}>
            <Route path="/check-out-books" element={<CheckOutBookPage />} />
            <Route path="/upload-book/:bookId" element={<UploadBookPage />} />
            <Route path="/search" element={<Search />} />
          </Route>
          <Route path={"*"} element={<Navigate to={"/"} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
