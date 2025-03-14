import { Navigate, Outlet } from "react-router-dom";
import Spinner from "../components/spinner/Spinner";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getUser } from "../hooks/getUser";

export default function PrivateRoute() {
  const { currentUser, loading } = useSelector((state) => state.user);
  const { fetchUser } = getUser();

  useEffect(() => {
    if (currentUser) {
      fetchUser();
    }
  }, []);

  return currentUser !== null ? <Outlet /> : <Navigate to={"/login"} />;
}
