import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { BASE_IMG_URL, BASE_URL } from "../../utils/utils";
import { newsAction } from "../../hooks/newsAction";
import { Card, CardActions, CardContent, CardMedia } from "@mui/material";
import axios from "axios";
import DialogBox from "../../components/dialog/Dialog";
import { getUser } from "../../hooks/getUser";
import { useDispatch, useSelector } from "react-redux";
import {
  setDislikeCounts,
  setDislikeId,
  setLikeCount,
  setLikeId,
  setTagParams,
} from "../../redux/news/newsSlice";
import Spinner from "../../components/spinner/Spinner";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const { news, fetchAllNews, deleteNews, newsLoading } = newsAction();
  const { likeCount, likeId, dislikeCounts, dislikeId } = useSelector(
    (state) => state.news
  );
  const { isAuthenticated } = getUser();
  const [newsData, setNewsData] = useState([]);
  const [handleOpen, setHandleOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const dispatch = useDispatch();

  const handleDeleteNews = (e, closed) => {
    e.preventDefault();
    if (deleteId !== null) {
      deleteNews(deleteId);
      if (closed === true) {
        const filteredNewsData = newsData.filter(
          (item) => item.news_id !== deleteId
        );
        setNewsData(filteredNewsData);
      }
    }
  };

  const handleLikeDislike = async (newsId, type) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/news/reaction/${newsId}/${type}`,
        {},
        { withCredentials: true }
      );
      console.log(response?.data?.data?.likes);
      if (response?.data?.data?.likes === 1) {
        dispatch(setLikeCount(1));
      } else {
        dispatch(setLikeCount(0));
      }

      dispatch(setLikeId(newsId));

      if (response?.data?.data?.dislikes === 1) {
        dispatch(setDislikeCounts(1));
      } else {
        dispatch(setDislikeCounts(0));
      }

      dispatch(setDislikeId(newsId));
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
    }
  };

  useEffect(() => {
    setNewsData((prev) => [...prev, ...news]);
  }, [news]);

  useEffect(() => {
    fetchAllNews();
  }, []);

  if (newsLoading) {
    return <Spinner />;
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        my: 8,
        mt: 12,
        flexDirection: "column",
      }}
    >
      <Typography variant="h3" align="center" gutterBottom>
        News Page
      </Typography>

      {isAuthenticated && (
        <DialogBox
          isOpen={handleOpen}
          setIsOpen={setHandleOpen}
          trigger={"deleteNews"}
          handleNewsDelete={({ e, closed }) => handleDeleteNews(e, closed)}
        />
      )}

      <Grid container spacing={3}>
        {newsData?.map((article, index) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                component="img"
                height="200"
                image={`${BASE_IMG_URL}/${article.picture}`}
                alt={article.title}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {article.title}
                </Typography>

                <Typography
                  variant="h3"
                  sx={{ mt: 3, fontSize: 16 }}
                  gutterBottom
                >
                  {article.text.length > 50
                    ? article.text.substring(0, 50) + "..."
                    : article.text}
                </Typography>

                {article.tags &&
                  article.tags?.length > 0 &&
                  article.tags?.map((tag) => (
                    <Typography
                      variant="h3"
                      sx={{
                        mt: 3,
                        fontSize: 16,
                        color: "#808080",
                        cursor: "pointer",
                      }}
                      gutterBottom
                      onClick={() => {
                        dispatch(setTagParams(`${tag}`));
                        navigate("/news-by-tag");
                      }}
                    >
                      #{tag}
                    </Typography>
                  ))}
              </CardContent>
              <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={(e) => {
                    setHandleOpen(true);
                    setDeleteId(article?.news_id);
                  }}
                  sx={{ fontSize: 12, textTransform: "capitalize" }}
                >
                  Delete
                </Button>
                <Box>
                  <Button
                    variant="outlined"
                    color="success"
                    sx={{ color: "#000", fontWeight: "bold", fontSize: 15 }}
                    onClick={() => handleLikeDislike(article?.news_id, "like")}
                  >
                    👍 {likeId === article?.news_id && likeCount}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() =>
                      handleLikeDislike(article?.news_id, "dislike")
                    }
                    sx={{
                      ml: 1,
                      color: "#000",
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    👎 {dislikeId === article?.news_id && dislikeCounts}
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomePage;
