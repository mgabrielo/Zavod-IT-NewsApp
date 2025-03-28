import axios from "axios";
import { BASE_URL } from "../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  getAllNewsFailure,
  getAllNewsStart,
  getAllNewsSuccess,
  setNewsTotal,
  setNewsTotalTags,
  setTotalDisLikes,
  setTotalLikes,
} from "../redux/news/newsSlice";

export const newsAction = () => {
  const {
    news = [],
    newsLoading,
    totalTags = [],
    totalLikes = [],
    totalDisLikes = [],
  } = useSelector((state) => state.news);
  const dispatch = useDispatch();
  const fetchAllNews = async () => {
    dispatch(getAllNewsStart());
    try {
      const res = await axios.get(`${BASE_URL}/news/all`);
      console.log({ allNews: res.data.news });
      if (res.data?.news) {
        dispatch(getAllNewsSuccess(res.data.news));
        if (
          res.data?.totalNews &&
          res.data?.totalTags &&
          res.data?.totalLikes &&
          res.data?.totalDislikes
        ) {
          dispatch(setNewsTotal(res.data.totalNews));
          dispatch(setNewsTotalTags(res.data?.totalTags));
          dispatch(setTotalLikes(res.data?.totalLikes));
          dispatch(setTotalDisLikes(res.data?.totalDislikes));
        }
      } else {
        dispatch(getAllNewsFailure("Failed to get News"));
      }
    } catch (err) {
      dispatch(getAllNewsFailure("Something Went Wrong"));
    }
  };

  const addNews = async (formData) => {
    try {
      const res = await axios.post(`${BASE_URL}/news/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.newsId) {
        toast.success("News Created Successfully");
        return res.data.newsId;
      } else {
        toast.error("Failed to save News");
      }
    } catch (err) {
      toast.error("Failed to save News");
    }
  };
  const deleteNews = async (id) => {
    try {
      const res = await axios.delete(`${BASE_URL}/news/delete/${id}`);

      if (res.status === 200) {
        toast.success("News Deleted Successfully");
        return res.data.newsId;
      } else {
        toast.error("Failed to delete News");
      }
    } catch (err) {
      toast.error("Failed to delete News");
    }
  };
  return {
    fetchAllNews,
    news,
    addNews,
    deleteNews,
    newsLoading,
    totalTags,
    totalLikes,
    totalDisLikes,
  };
};
