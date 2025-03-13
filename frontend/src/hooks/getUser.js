import axios from "axios";
import { BASE_URL } from "../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, saveUserDetailsFailure, saveUserDetailsStart, saveUserDetailsSuccess, setTotatUsers } from "../redux/user/userSlice";
import { toast } from "react-hot-toast";

export const getUser = () => {
  const { error, loading, isAuthenticated, currentUser, totalUsers } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const fetchUser = async () => {
    dispatch(saveUserDetailsStart());
    try {
      const res = await axios.get(`${BASE_URL}/user`, {
        withCredentials: true,
      });
      if (res.status === 200 && res.data?.user && res.data?.totalUsers) {
        dispatch(clearAuthError());
        dispatch(saveUserDetailsSuccess(res.data.user));
        dispatch(setTotatUsers(res.data.totalUsers));
      } else {
        dispatch(clearAuthError())
        dispatch(saveUserDetailsFailure('Failed to get user'));
        toast.error('Failed to get user')
      }
    } catch (err) {
      dispatch(clearAuthError());
      dispatch(saveUserDetailsFailure('Something Went Wrong'));
      toast.error('Please Log In to Continue')
    }
  };



  return { error, loading, currentUser, fetchUser, isAuthenticated, totalUsers };
};
