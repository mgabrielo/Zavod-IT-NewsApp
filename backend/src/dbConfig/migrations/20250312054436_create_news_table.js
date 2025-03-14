/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
    await knex.schema.createTable("news", (table) => {
        table.increments("id").primary();
        table.string("title", 255).notNullable();
        table.text("text").notNullable();
        table.string("picture", 255);
        table.integer("likes").defaultTo(0);
        table.integer("dislikes").defaultTo(0);
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });

    await knex.raw('ALTER SEQUENCE news_id_seq RESTART WITH 1');

    await knex.schema.createTable("tags", (table) => {
        table.increments("id").primary();
        table.string("name", 100).unique().notNullable();
    });

    await knex.schema.createTable("news_tags", (table) => {
        table.integer("news_id").unsigned().references("id").inTable("news").onDelete("CASCADE");
        table.integer("tag_id").unsigned().references("id").inTable("tags").onDelete("CASCADE");
        table.primary(["news_id", "tag_id"]);
    });

};

export const down = async function (knex) {
    await knex.schema.dropTableIfExists("news_tags");
    await knex.schema.dropTableIfExists("news");
    await knex.schema.dropTableIfExists("tags");
};
