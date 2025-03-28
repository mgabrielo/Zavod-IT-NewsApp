import "dotenv/config";
import { missingVariables } from "./src/dbConfig/get-db.js";

if (missingVariables.length > 0) {
  missingVariables.forEach(({ name }) => {
    console.error(
      `Error creating database: Value for the environment variable ${name} is not provided.`
    );
  });
  process.exit(1);
}

const config = {
  development: {
    client: "postgresql",
    pool: { min: 2, max: 10 },
  },
  auth: {
    client: "postgresql",
    connection: {
      database: process.env.POSTGRES_BOOK_DB_NAME,
      user: process.env.POSTGRES_ADMIN_DB_USER,
      password: process.env.POSTGRES_ADMIN_PASSWORD,
    },
    pool: { min: 2, max: 10 },
    migrations: {
      tableName: "knex_auth_migrations", // Separate table for auth migrations
      directory: "./src/dbConfig/migrations/auth",
    },
    seeds: {
      directory: "./src/dbConfig/seeds/auth",
    },
  },

  // Separate configuration for BOOKS
  books: {
    client: "postgresql",
    connection: {
      database: process.env.POSTGRES_BOOK_DB_NAME,
      user: process.env.POSTGRES_ADMIN_DB_USER,
      password: process.env.POSTGRES_ADMIN_PASSWORD,
    },
    pool: { min: 2, max: 10 },
    migrations: {
      tableName: "knex_books_migrations", // Separate table for book migrations
      directory: "./src/dbConfig/migrations/books",
    },
    seeds: {
      directory: "./src/dbConfig/seeds/books",
    },
  },
};

export default config;
