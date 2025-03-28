import NodeCache from "node-cache";
import {
  addNewsQuery,
  addTagQuery,
  deleteNewsQuery,
  deleteNewsTagQuery,
  getAllNewsQuery,
  getTagIdsQuery,
  setNewTagsQuery,
} from "../queries/newsQueries.js";
import pg from "pg";

export const newsDBPool = new pg.Pool({
  user: "psotgres",
  host: "postgres",
  database: "news",
  password: "scott",
  port: "5432",
});

const newsCache = new NodeCache({
  stdTTL: 30,
  checkperiod: 30,
});

export const getAllNewsDetails = async (req, res) => {
  // const cachedNews = newsCache.get("allNews");
  try {
    const exsitingNews = await newsDBPool.query(`${getAllNewsQuery}`);
    if (exsitingNews?.rows?.length === 0) {
      res.status(404).json({ msg: "News Content Not Found" });
    } else {
      const data = exsitingNews?.rows;
      const tagResult = await newsDBPool.query(`
                    SELECT COUNT(DISTINCT tag_id) AS total_tags FROM news_tags;
                `);
      newsCache.set("allNews", data);

      const allCachedNews = newsCache.get("allNews");

      const reactionResult = await newsDBPool.query(`
                SELECT 
                    SUM(likes) AS total_likes, 
                    SUM(dislikes) AS total_dislikes 
                FROM news;
            `);
      // console.log(data?.length)
      res.status(200).json({
        news: allCachedNews,
        totalNews: exsitingNews?.rows?.length,
        totalTags: tagResult.rows[0].total_tags,
        totalLikes: reactionResult.rows[0].total_likes,
        totalDislikes: reactionResult.rows[0].total_dislikes,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error?.message || "Server Error" });
  }
};

export const createNews = async (req, res) => {
  const { title, text, tags: newsTags } = req.body; // Expecting an array of tags
  const picture = req.file ? req.file.filename : null;
  const tags = JSON.parse(newsTags);

  if (!title || !text || !tags || !Array.isArray(tags)) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  const client = await newsDBPool.connect(); // Get a DB connection
  try {
    await client.query("BEGIN"); // Start transaction

    const newsResult = await client.query(addNewsQuery, [title, text, picture]);
    const newsId = newsResult.rows[0].id;

    const insertTagQuery = addTagQuery(tags);

    // Insert tags (ignore duplicates)
    const tagResult = await client.query(insertTagQuery, tags);

    const tagIdsResult = await client.query(getTagIdsQuery, [tags]);
    const tagIds = tagIdsResult.rows.map((row) => row.id);

    // Insert into news_tags
    const newsTagsInsertQuery = setNewTagsQuery(tagIds);
    await client.query(newsTagsInsertQuery, [newsId, ...tagIds]);

    await client.query("COMMIT"); // Commit transaction
    res.status(201).json({ message: "News added successfully", newsId });
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback on error
    console.error("Error adding news:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release(); // Release DB connection
  }
};
