import { useState } from "react";
import { BASE_URL } from "../utils/utils";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { persistor } from "../redux/store";
import {
  signInFailure,
  signInStart,
  signInSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signUpFailure,
  signUpStart,
  signUpSuccess,
} from "../redux/user/userSlice";

export const authAction = () => {
  const [checkError, setCheckError] = useState(false);
  const { loading, currentUser, authError, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  const handleLoginAuth = async (data) => {
    try {
      dispatch(signInStart());
      await axios
        .post(`${BASE_URL}/user/login`, data, { withCredentials: true })
        .then((res) => {
          if (res.status == 200 && res.data?.user) {
            dispatch(signInSuccess(res.data.user));
            toast.success(res.data.message);
          }
        })
        .catch((err) => {
          dispatch(
            signInFailure(
              err?.response?.data?.msg
                ? err?.response?.data?.msg
                : "Error in Signing In"
            )
          );
        });
    } catch (error) {
      dispatch(signInFailure("Something Went Wrong"));
      console.log(error);
    }
  };

  const handleRegisterAuth = async (data) => {
    try {
      dispatch(signUpStart());
      console.log({ AxiosFormData: data });
      await axios
        .post(`${BASE_URL}/user/register`, data, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          if (res.data?.user) {
            dispatch(signUpSuccess(res.data.user));
            toast.success(res.data.message);
          }
        })
        .catch((err) => {
          dispatch(
            signUpFailure(
              err?.response?.data?.message[0]?.msg ||
                err?.response?.data?.message
                ? err?.response?.data?.message[0]?.msg ||
                    err?.response?.data?.message
                : "User Registration Failed"
            )
          );
        });
    } catch (error) {
      console.log(error);
      dispatch(signUpFailure("Something Went Wrong"));
    }
  };

  const handleLogoutAuth = async () => {
    try {
      signOutUserStart();
      await axios
        .get(`${BASE_URL}/user/logout`, { withCredentials: true })
        .then((res) => {
          if (res.status == 200) {
            dispatch(signOutUserSuccess());
            toast.success(res.data?.message);
            persistor.purge();
          }
        })
        .catch(() => {
          dispatch(signOutUserFailure("Could Not Sign Out"));
        });
    } catch (error) {
      dispatch(signOutUserFailure("Something Went Wrong"));
    }
  };

  return {
    loading,
    currentUser,
    isAuthenticated,
    handleLoginAuth,
    authError,
    checkError,
    setCheckError,
    handleRegisterAuth,
    handleLogoutAuth,
  };
};
