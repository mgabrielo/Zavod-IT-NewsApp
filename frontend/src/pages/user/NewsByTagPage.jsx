import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { newsAction } from "../../hooks/newsAction";
import { CardMedia, FormControl, Grid, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../../utils/utils";
import Spinner from "../../components/spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { removeTagParams } from "../../redux/news/newsSlice";

const NewsByTag = () => {
  const [selectedTag, setSelectedTag] = useState("");
  const { news } = newsAction();
  const [newsData, setNewsData] = useState(news || []);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const { tagParams } = useSelector((state) => state.news);
  const dispatch = useDispatch();
  // Extract unique tags from all news items
  const uniqueTags = [
    ...new Set(newsData.flatMap((newsItem) => newsItem.tags || [])),
  ];

  // Fetch news on mount
  useEffect(() => {
    const fetchAnyNews = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/news/all`);
        if (res.data?.news) {
          setNewsData(res.data.news);
          setFilteredNews(res.data.news);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };
    fetchAnyNews();
  }, []);

  // Filter news based on selected tag
  useEffect(() => {
    if (selectedTag) {
      setLoading(true);
      setFilteredNews(
        newsData.filter((newsItem) => newsItem.tags.includes(selectedTag))
      );
      setLoading(false);
    } else {
      setLoading(true);
      setFilteredNews(newsData);
      setLoading(false);
    }
  }, [selectedTag, newsData]);

  useEffect(() => {
    if (tagParams) {
      setSelectedTag(tagParams);
      dispatch(removeTagParams());
    }
  }, [tagParams]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
        p: 3,
        mt: 10,
      }}
    >
      {/* Dropdown Selector */}
      <Typography variant="h5" sx={{ my: 3 }}>
        Filter News by Tag
      </Typography>
      <FormControl sx={{ width: 300, mb: 3 }}>
        <Select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">All</MenuItem>
          {uniqueTags.map((tag) => (
            <MenuItem key={tag} value={tag}>
              {tag}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* News Grid */}
      <Grid container spacing={3} justifyContent="center">
        {filteredNews.length > 0 ? (
          filteredNews.map((article, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ bgcolor: "#f5f5f5", height: "100%" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:3000/images/${article.picture}`} // Adjust API path
                  alt={article.title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
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
                        onClick={() => setSelectedTag(`${tag}`)}
                      >
                        #{tag}
                      </Typography>
                    ))}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : news.length > 0 || loading ? (
          <Spinner />
        ) : (
          <Typography>No news found for this tag</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default NewsByTag;
