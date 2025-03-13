import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { newsAction } from "../../hooks/newsAction";
import { CardMedia, FormControl, Grid, MenuItem, Select } from "@mui/material";

const NewsByTag = () => {
  const [selectedTag, setSelectedTag] = useState("");
  const { fetchAllNews, news } = newsAction();

  const uniqueTags = [...new Set(news.flatMap((newsItem) => newsItem.tags))]; // Extract tags

  const filteredNews = selectedTag
    ? news.filter((newsItem) => newsItem.tags.includes(selectedTag))
    : news;

  useEffect(() => {
    if (!news) {
      fetchAllNews();
    }
  }, [news]);

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
                    {article.text.length > 100
                      ? article.text.substring(0, 100) + "..."
                      : article.text}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No news found for this tag</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default NewsByTag;
