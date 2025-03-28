export const up = async function (knex) {
  await knex.schema.createTable("books", (table) => {
    table.increments("id").primary(); // Auto-incrementing ID
    table.string("cover_page_image").notNullable(); // URL or file path of cover page
    table.string("title").notNullable();
    table.string("isbn").unique().notNullable();
    table.integer("revision_number").defaultTo(1);
    table.date("published_date");
    table.string("publisher").notNullable();
    table.json("authors").notNullable(); // JSON array for multiple authors
    table.string("genre");
    table.text("description"); // Optional field for book summary
    table.integer("reader_id").unsigned().nullable();
    table
      .foreign("reader_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.dateTime("checked_out_date").nullable(); // Checkout date
    table.dateTime("expected_check_in_date").nullable(); // Due date
    table.boolean("is_checked_in").defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
  });

  // await knex.schema.createTable("checkout_books", (table) => {
  //   table.increments("id").primary(); // Unique checkout ID
  //   table.integer("book_id").unsigned().notNullable();
  //   table
  //     .foreign("book_id")
  //     .references("id")
  //     .inTable("books")
  //     .onDelete("CASCADE");

  //   ; // Status: false = checked out, true = checked in

  //   table.timestamps(true, true); // created_at and updated_at
  // });
};

export const down = async function (knex) {
  await knex.schema.dropTable("books");
};
