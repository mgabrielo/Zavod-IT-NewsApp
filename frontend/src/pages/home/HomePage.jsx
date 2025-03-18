import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { useDispatch } from "react-redux";
import { setTagParams } from "../../redux/news/newsSlice";
import Spinner from "../../components/spinner/Spinner";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const { deleteNews } = newsAction();
  const { isAuthenticated, currentUser } = getUser();
  const [newsData, setNewsData] = useState([]);
  const [handleOpen, setHandleOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef();
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
      const res = await axios.patch(
        `${BASE_URL}/news/reaction/${newsId}/${type}`,
        {},
        { withCredentials: true }
      );
      // console.log(res?.data?.data);
      setNewsData((prev) =>
        prev.map((newsItem) =>
          newsItem.news_id === newsId
            ? {
                ...newsItem,
                likes: res.data.data.likes,
                dislikes: res.data.data.dislikes,
              }
            : newsItem
        )
      );
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
    }
  };

  const fetchMoreNews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/news/all`);
      if (res.data?.news.length > 0) {
        setNewsData((prev) => {
          const newNews = res.data.news.filter(
            (newItem) =>
              !prev.some(
                (existingItem) => existingItem.news_id === newItem.news_id
              )
          ); // Remove duplicates
          return [...prev, ...newNews];
        });
        setLoading(false);

        setPage((prevPage) => prevPage + 1);
      } else {
        setLoading(false);

        setHasMore(false); // No more news to load
      }
    } catch (error) {
      setLoading(false);

      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => {
    fetchMoreNews();
  }, []);

  // Intersection Observer to detect when last item is visible

  if (loading) {
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
        {newsData?.map((article, index) => {
          const isLastElement = index === newsData.length - 1;
          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              key={index + article?.news_id}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
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

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    {article.tags &&
                      article.tags?.length > 0 &&
                      article.tags?.map((tag, tag_index) => (
                        <Typography
                          key={tag_index}
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
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                  {currentUser && (
                    <>
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
                          sx={{
                            color: "#000",
                            fontWeight: "bold",
                            fontSize: 15,
                          }}
                          onClick={() =>
                            handleLikeDislike(article?.news_id, "like")
                          }
                        >
                          👍 {article?.likes}
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
                          👎 {article?.dislikes}
                        </Button>
                      </Box>
                    </>
                  )}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default HomePage;
