/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
    await knex.schema.createTable("user_interactions", (table) => {
        table.increments("id").primary();
        table.integer("user_id").unsigned().notNullable();
        table.integer("news_id").unsigned().notNullable();
        table.enu("reaction", ["like", "dislike"]).notNullable();
        table.unique(["user_id", "news_id"]);
    });
};

export const down = async function (knex) {
    await knex.schema.dropTableIfExists('user_interactions'); // Drop the user_interactions table
};
