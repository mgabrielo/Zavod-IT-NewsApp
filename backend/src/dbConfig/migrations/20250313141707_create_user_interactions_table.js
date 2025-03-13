/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
    await knex.schema.createTable('user_interactions', (table) => {
        table.increments("id").primary(); // Auto-incrementing primary key
        table.integer("user_id").unsigned()
        table.integer("news_id").unsigned()
        table.enu("action", ["like", "dislike"]); // Action taken by user (like/dislike)
        table.timestamp("created_at").defaultTo(knex.fn.now()); // Timestamp of the interaction
        table.unique(["user_id", "news_id"]); // Prevent multiple interactions from the same user on the same article
    });
};

export const down = async function (knex) {
    await knex.schema.dropTableIfExists('user_interactions'); // Drop the user_interactions table
};
