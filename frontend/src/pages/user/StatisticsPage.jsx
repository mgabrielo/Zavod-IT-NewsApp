import React, { useEffect, useState } from "react";
import { getUser } from "../../hooks/getUser";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { newsAction } from "../../hooks/newsAction";

const StatisticsPage = () => {
  const { newsTotal } = useSelector((state) => state.news);
  const { fetchAllNews, totalTags, totalLikes, totalDisLikes } = newsAction();
  const { totalUsers } = getUser();
  const [totalReactions, setTotalReactions] = useState({
    totalLikes: 0,
    totalDislikes: 0,
  });

  useEffect(() => {
    fetchAllNews();
  }, []);

  useEffect(() => {
    const fetchReactionCount = async () => {
      setTotalReactions((prev) => ({
        ...prev,
        totalLikes: totalLikes,
        totalDislikes: totalDisLikes,
      }));
    };
    fetchReactionCount();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      <Card
        sx={{
          width: { xs: 350, sm: 400, md: 450, lg: 500 },
          bgcolor: "#808080",
          color: "#fff",
        }}
      >
        <CardContent sx={{ gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography fontSize={18}>Total Number of News Post:</Typography>
            <Typography>{newsTotal}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography fontSize={18}>Number of Likes:</Typography>
            <Typography>{totalReactions.totalLikes}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography fontSize={18}>Number of Dislikes:</Typography>
            <Typography>{totalReactions.totalDislikes}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography fontSize={18}>Number of Users:</Typography>
            <Typography>{totalUsers}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography fontSize={18}>
              Number of Available Unique Tags:
            </Typography>
            <Typography>{totalTags}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StatisticsPage;
