import NodeCache from "node-cache";
import { newsDBPool, userInteractDBPool } from "../dbConfig/get-db.js";
import { addNewsQuery, addTagQuery, deleteNewsQuery, deleteNewsTagQuery, getAllNewsQuery, getTagIdsQuery, setNewTagsQuery } from "../queries/newsQueries.js";

const newsCache = new NodeCache({
    stdTTL: 30,
    checkperiod: 30
});

export const getAllNewsDetails = async (req, res) => {

    // const cachedNews = newsCache.get("allNews");
    try {

        const exsitingNews = await newsDBPool.query(`${getAllNewsQuery}`,)
        if (exsitingNews?.rows?.length === 0) {
            res.status(404).json({ msg: 'News Content Not Found' })
        } else {
            const data = exsitingNews?.rows
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
                totalDislikes: reactionResult.rows[0].total_dislikes
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
    const { newsId, type: reaction } = req.params;
    const userId = req.userId;
    try {
        if (!['like', 'dislike'].includes(reaction)) {
            return res.status(400).json({ error: 'Invalid reaction' });
        }

        // Check if the news item exists
        const newsCheck = await newsDBPool.query('SELECT id FROM news WHERE id = $1', [newsId]);

        if (newsCheck.rows.length === 0) {
            return res.status(404).json({ error: 'News item not found' });
        }

        // Check if the user has already interacted with this news item
        const existingInteraction = await userInteractDBPool.query(`
            SELECT * FROM user_interactions WHERE user_id = $1 AND news_id = $2
        `, [userId, newsId]);

        const client = await newsDBPool.connect(); // Get a DB connection for newsDBPool
        await client.query('BEGIN'); // Start a transaction

        if (existingInteraction.rows.length > 0) {
            // If the user has already interacted, check if it's the same reaction
            const existingReaction = existingInteraction.rows[0].reaction;

            if (existingReaction === reaction) {
                // User is trying to react the same way, return an error
                return res.status(400).json({ error: 'You have already reacted this way to this post' });
            } else {
                // User is trying to change their reaction (from like to dislike or vice versa)
                // Update the interaction with the new reaction
                await userInteractDBPool.query(`
                    UPDATE user_interactions
                    SET reaction = $1
                    WHERE user_id = $2 AND news_id = $3
                `, [reaction, userId, newsId]);

                // Update the news table accordingly
                if (reaction === 'like') {
                    await newsDBPool.query(`
                        UPDATE news
                        SET likes = likes + 1, dislikes = GREATEST(dislikes - 1, 0) -- Prevent negative dislikes
                        WHERE id = $1
                    `, [newsId]);
                } else if (reaction === 'dislike') {
                    await newsDBPool.query(`
                        UPDATE news
                        SET dislikes = dislikes + 1, likes = GREATEST(likes - 1, 0) -- Prevent negative likes
                        WHERE id = $1
                    `, [newsId]);
                }
            }
        } else {
            // If no existing interaction, insert a new interaction
            await userInteractDBPool.query(`
                INSERT INTO user_interactions (user_id, news_id, reaction)
                VALUES ($1, $2, $3)
            `, [userId, newsId, reaction]);

            // Update the news table accordingly
            if (reaction === 'like') {
                await newsDBPool.query(`
                    UPDATE news
                    SET likes = likes + 1
                    WHERE id = $1
                `, [newsId]);
            } else if (reaction === 'dislike') {
                await newsDBPool.query(`
                    UPDATE news
                    SET dislikes = dislikes + 1
                    WHERE id = $1
                `, [newsId]);
            }
        }

        // Commit the transaction
        await client.query('COMMIT');

        // Fetch the updated counts for likes and dislikes
        const updatedNews = await newsDBPool.query(`
            SELECT likes, dislikes FROM news WHERE id = $1
        `, [newsId]);

        const { likes, dislikes } = updatedNews.rows[0];

        res.status(200).json({
            message: 'Interaction recorded successfully',
            data: {
                likes,
                dislikes,
            }
        });


    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

