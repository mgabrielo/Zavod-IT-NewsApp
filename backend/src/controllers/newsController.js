import NodeCache from "node-cache";
import { newsDBPool, authDBPool, userInteractDBPool } from "../dbConfig/get-db.js";
import { addNewsQuery, addTagQuery, countReactionsQuery, deleteNewsQuery, deleteNewsTagQuery, deleteReactionsQuery, getAllNewsQuery, getTagIdsQuery, insertReactionsQuery, setNewTagsQuery, updateReactionsQuery } from "../queries/newsQueries.js";


const newsCache = new NodeCache({
    stdTTL: 30,
    checkperiod: 30
});

export const getAllNewsDetails = async (req, res) => {

    // const cachedNews = newsCache.get("allNews");
    try {

        const exsitingNews = await newsDBPool.query(getAllNewsQuery)
        if (exsitingNews?.rows?.length === 0) {
            res.status(404).json({ msg: 'News Content Not Found' })
        } else {
            const data = exsitingNews?.rows
            const result = await newsDBPool.query(`
                    SELECT COUNT(DISTINCT tag_id) AS total_tags FROM news_tags;
                `);
            newsCache.set("allNews", data);

            const allCachedNews = newsCache.get("allNews");
            // console.log(data?.length)
            res.status(200).json({
                news: allCachedNews,
                totalNews: exsitingNews?.rows?.length,
                totalTags: result.rows[0].total_tags
            })
        }
    } catch (error) {
        res.status(500).json({ message: error?.message || 'Server Error' })
    }
}


export const createNews = async (req, res) => {
    const { title, text, tags: newsTags } = req.body; // Expecting an array of tags
    const picture = req.file ? req.file.filename : null
    const tags = JSON.parse(newsTags);

    if (!title || !text || !tags || !Array.isArray(tags)) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    const client = await newsDBPool.connect(); // Get a DB connection
    try {
        await client.query('BEGIN'); // Start transaction

        const newsResult = await client.query(addNewsQuery, [title, text, picture]);
        const newsId = newsResult.rows[0].id;

        const insertTagQuery = addTagQuery(tags);

        // Insert tags (ignore duplicates)
        const tagResult = await client.query(insertTagQuery, tags);

        const tagIdsResult = await client.query(getTagIdsQuery, [tags]);
        const tagIds = tagIdsResult.rows.map(row => row.id);

        // Insert into news_tags
        const newsTagsInsertQuery = setNewTagsQuery(tagIds)
        await client.query(newsTagsInsertQuery, [newsId, ...tagIds]);

        await client.query('COMMIT'); // Commit transaction
        res.status(201).json({ message: 'News added successfully', newsId });

    } catch (error) {
        await client.query('ROLLBACK'); // Rollback on error
        console.error('Error adding news:', error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release(); // Release DB connection
    }
}

export const deleteNews = async (req, res) => {
    const { newsId } = req.params;

    const client = await newsDBPool.connect();
    try {
        await client.query("BEGIN");

        await client.query(deleteNewsTagQuery, [newsId]);

        const result = await client.query(deleteNewsQuery, [newsId]);

        if (result.rowCount === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "News not found" });
        }

        await client.query("COMMIT");
        res.status(200).json({ message: "News deleted successfully" });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error deleting news:", error);
        res.status(500).json({ message: "Server error" });
    } finally {
        client.release();
    }
}

export const updateNewsLikes = async (req, res) => {
    const { newsId, type } = req.params;
    const userId = req.userId;

    const client = await userInteractDBPool.connect();
    try {
        await client.query("BEGIN");

        const userExists = await authDBPool.query("SELECT id FROM users WHERE id = $1", [userId]);
        if (userExists.rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const newsExists = await newsDBPool.query("SELECT id FROM news WHERE id = $1", [newsId]);
        if (newsExists.rows.length === 0) {
            return res.status(400).json({ message: "News article not found" });
        }

        const existingReaction = await userInteractDBPool.query(
            "SELECT action FROM user_interactions WHERE user_id = $1 AND news_id = $2",
            [userId, newsId]
        );

        let likeChange = 0;
        let dislikeChange = 0;

        if (existingReaction.rows.length > 0) {
            const currentAction = existingReaction.rows[0].action;

            if (currentAction === type) {
                // If user presses the same button again → Remove reaction
                await userInteractDBPool.query(
                    "DELETE FROM user_interactions WHERE user_id = $1 AND news_id = $2",
                    [userId, newsId]
                );
                if (currentAction === "like") likeChange = -1;
                if (currentAction === "dislike") dislikeChange = -1;
            } else {
                // If user toggles between like and dislike → Update reaction
                await userInteractDBPool.query(
                    "UPDATE user_interactions SET action = $1 WHERE user_id = $2 AND news_id = $3",
                    [type, userId, newsId]
                );

                if (type === "like") {
                    likeChange = 1;
                    dislikeChange = -1;
                } else {
                    likeChange = -1;
                    dislikeChange = 1;
                }
            }
        } else {
            await userInteractDBPool.query(
                "INSERT INTO user_interactions (user_id, news_id, action) VALUES ($1, $2, $3)",
                [userId, newsId, type]
            );
            if (type === "like") likeChange = 1;
            if (type === "dislike") dislikeChange = 1;
        }

        await newsDBPool.query(
            `UPDATE news 
             SET likes = GREATEST(likes + $1, 0), 
                 dislikes = GREATEST(dislikes + $2, 0) 
             WHERE id = $3`,
            [likeChange, dislikeChange, newsId]
        );

        const countResult = await newsDBPool.query(
            "SELECT likes, dislikes FROM news WHERE id = $1",
            [newsId]
        );

        const result = await newsDBPool.query(`
                SELECT 
                    SUM(likes) AS total_likes, 
                    SUM(dislikes) AS total_dislikes 
                FROM news;
            `);

        // Commit the transaction
        await client.query("COMMIT");

        console.log({ reactCount: countResult.rows[0], likesaall: result.rows[0].total_likes, });

        res.status(200).json({
            message: "Reaction updated successfully",
            data: countResult.rows[0],
            totalLikes: result.rows[0].total_likes,
            totalDislikes: result.rows[0].total_dislikes,
        });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error updating reaction:", error);
        res.status(500).json({ message: "Server error" });
    } finally {
        client.release();
    }
};

