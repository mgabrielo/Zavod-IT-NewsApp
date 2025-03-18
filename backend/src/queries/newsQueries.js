export const getAllNewsQuery = `SELECT news.id AS news_id,news.title,news.text,news.picture,news.created_at,likes,dislikes,
array_agg(tags.name) AS tags FROM news JOIN news_tags ON news.id = news_tags.news_id
JOIN tags ON news_tags.tag_id = tags.id GROUP BY news.id ORDER BY news.id ASC`

export const addNewsQuery = `INSERT INTO news (title, text, picture) VALUES ($1, $2, $3) RETURNING id;`

export const addTagQuery = (tags) => `INSERT INTO tags (name) VALUES ${tags.map((_, i) => `($${i + 1})`).join(',')}
ON CONFLICT (name) DO NOTHING RETURNING id, name;`

export const getTagIdsQuery = `SELECT id FROM tags WHERE name = ANY($1);`

export const setNewTagsQuery = (tagIds) => `INSERT INTO news_tags (news_id, tag_id)
VALUES ${tagIds.map((_, i) => `($1, $${i + 2})`).join(',')}
ON CONFLICT (news_id, tag_id) DO NOTHING;`

export const deleteNewsTagQuery = `DELETE FROM news_tags WHERE news_id = $1;`
export const deleteNewsQuery = `DELETE FROM news WHERE id = $1 RETURNING id;`
export const countReactionsQuery = `SELECT COUNT(*) FILTER (WHERE action = 'like') AS likes, COUNT(*) 
FILTER (WHERE action = 'dislike') AS dislikes FROM user_interactions WHERE news_id = $1;`
export const insertReactionsQuery = "INSERT INTO user_interactions (user_id, news_id, action) VALUES ($1, $2, $3);"
export const updateReactionsQuery = "UPDATE user_interactions SET action = $1 WHERE user_id = $2 AND news_id = $3;"
export const deleteReactionsQuery = "DELETE FROM user_interactions WHERE user_id = $1 AND news_id = $2;"
