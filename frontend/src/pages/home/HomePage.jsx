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

const HomePage = () => {
  const { news, fetchAllNews, deleteNews, newsLoading } = newsAction();
  const { isAuthenticated } = getUser();
  const [page, setPage] = useState(1);
  const [newsData, setNewsData] = useState([]);
  const [handleOpen, setHandleOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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
      setNewsData(
        news.map((item) => {
          return {
            ...item,
            likes: item.news_id === newsId ? response.data.data.likes : 0,
            dislikes: item.news_id === newsId ? response.data.data.dislikes : 0,
          };
        })
      );
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
    }
  };

  const handleScroll = (event) => {
    const bottom =
      event.target.scrollHeight ===
      event.target.scrollTop + event.target.clientHeight;
    if (bottom && !newsLoading) {
      setPage((prev) => prev + 1); // Load next page when the user reaches the bottom
    }
  };

  useEffect(() => {
    setNewsData((prev) => [...prev, ...news]);
  }, [news]);

  useEffect(() => {
    fetchAllNews(page);
  }, [page]);

  // console.log({ news });

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        my: 8,
        mt: 12,
        flexDirection: "column",
      }}
      onScroll={handleScroll}
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
                    👍 {article.likes}
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
                    👎 {article.dislikes}
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
