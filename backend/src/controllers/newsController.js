import NodeCache from "node-cache";
import { newsDBPool, authDBPool, userInteractDBPool } from "../dbConfig/get-db.js";
import { addNewsQuery, addTagQuery, countReactionsQuery, deleteNewsQuery, deleteNewsTagQuery, deleteReactionsQuery, getAllNewsQuery, getTagIdsQuery, insertReactionsQuery, setNewTagsQuery, updateReactionsQuery } from "../queries/newsQueries.js";


const newsCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

export const getAllNewsDetails = async (req, res) => {

    const { page = 1 } = req.query;

    try {
        // Check cache for news data
        const cachedNews = newsCache.get("allNews");
        if (cachedNews) {
            // Paginate from the cached data
            const pageSize = 6;
            const startIdx = (page - 1) * pageSize;
            const paginatedNews = cachedNews.slice(startIdx, startIdx + pageSize);

            return res.status(200).json({ news: paginatedNews });
        }

        // Fetch news from the database if not in cache
        const exsitingNews = await newsDBPool.query(getAllNewsQuery);

        if (exsitingNews?.rows?.length === 0) {
            return res.status(404).json({ msg: 'News Content Not Found' });
        }

        const data = exsitingNews?.rows;

        // Cache the fetched news data for future requests
        newsCache.set("allNews", data);

        // Paginate the news data
        const pageSize = 3;
        const startIdx = (page - 1) * pageSize;
        const paginatedNews = data.slice(startIdx, startIdx + pageSize);

        const result = await newsDBPool.query(`
        SELECT COUNT(DISTINCT tag_id) AS total_tags FROM news_tags;
    `);

        res.status(200).json({
            news: data,
            totalNews: exsitingNews?.rows?.length,
            totalTags: result.rows[0].total_tags
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: error?.message || 'Server Error' });
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

        // Step 1: Check if the user exists
        const userExists = await authDBPool.query("SELECT * FROM users WHERE id = $1", [userId]);
        if (userExists.rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        // Step 2: Check if the news article exists
        const newsExists = await newsDBPool.query("SELECT * FROM news WHERE id = $1", [newsId]);
        if (newsExists.rows.length === 0) {
            return res.status(400).json({ message: "News article not found" });
        }

        // Step 3: Check if the user has already reacted
        const existingReaction = await userInteractDBPool.query(
            "SELECT * FROM user_interactions WHERE user_id = $1 AND news_id = $2",
            [userExists.rows[0].id, newsExists.rows[0].id]
        );

        // Step 4: Handle existing reaction or insert new one
        if (existingReaction.rows.length > 0 && existingReaction.rows[0] !== undefined) {
            const currentAction = existingReaction.rows[0].action;
            // Case 1: Delete the existing reaction if the user presses the same button again
            if (currentAction === type) {
                await userInteractDBPool.query(
                    deleteReactionsQuery,
                    [userId, newsId]
                );
            } else {
                // Case 2: Update the reaction if user toggles between like/dislike
                await userInteractDBPool.query(
                    updateReactionsQuery,
                    [type, userId, newsId]
                );
            }
        } else {
            // Case 3: Insert a new reaction if no previous reaction exists
            await userInteractDBPool.query(
                insertReactionsQuery,
                [userExists.rows[0].id, newsExists.rows[0].id, type]
            );
        }

        // Step 5: Get the updated like and dislike counts
        const countResult = await userInteractDBPool.query(countReactionsQuery,
            [newsId]
        );

        const result = await userInteractDBPool.query(`
        SELECT 
            COALESCE(SUM(CASE WHEN action = 'like' THEN 1 ELSE 0 END), 0) AS total_likes,
            COALESCE(SUM(CASE WHEN action = 'dislike' THEN 1 ELSE 0 END), 0) AS total_dislikes
        FROM user_interactions;
    `);

        // Commit the transaction
        await client.query("COMMIT");

        // Send the updated like and dislike counts in response
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

