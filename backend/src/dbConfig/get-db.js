import "dotenv/config";
import pg from "pg";
import { checkDbQuery, createDbQuery } from "../queries/dbMigrationQueries.js";

export const adminDBName = process.env.POSTGRES_ADMIN_DB_NAME;
export const adminDBUser = process.env.POSTGRES_ADMIN_DB_USER;
export const adminDBHost = process.env.POSTGRES_ADMIN_HOST;
export const adminDBPORT = process.env.POSTGRES_ADMIN_PORT;
export const adminDBPassword = process.env.POSTGRES_ADMIN_PASSWORD;
export const authDBName = process.env.POSTGRES_AUTH_DB_NAME;
export const booksDBName = process.env.POSTGRES_BOOK_DB_NAME;
export const dbPassword = process.env.POSTGRES_DB_PASSWORD;
export const dbPort = process.env.POSTGRES_DB_PORT;
export const dbUser = process.env.POSTGRES_DB_USER;
export const dbHost = process.env.POSTGRES_DB_HOST;

const envVariables = [
  { name: "POSTGRES_AUTH_DB_NAME", value: authDBName },
  { name: "POSTGRES_BOOK_DB_NAME", value: booksDBName },
  { name: "POSTGRES_DB_PASSWORD", value: dbPassword },
  { name: "POSTGRES_DB_PORT", value: dbPort },
  { name: "POSTGRES_DB_USER", value: dbUser },
  { name: "POSTGRES_DB_HOST", value: dbHost },
  { name: "POSTGRES_ADMIN_DB_NAME", value: adminDBName },
  { name: "POSTGRES_ADMIN_PASSWORD", value: adminDBPassword },
  { name: "POSTGRES_ADMIN_PORT", value: adminDBPORT },
  { name: "POSTGRES_ADMIN_DB_USER", value: adminDBUser },
  { name: "POSTGRES_ADMIN_HOST", value: adminDBHost },
];

export const missingVariables = envVariables.filter(({ value }) => !value);

if (missingVariables.length > 0) {
  missingVariables.forEach(({ name }) => {
    console.error(
      `Error creating database: Value for the environment variable ${name} is not provided.`
    );
  });
  process.exit(1);
}

const adminPool = new pg.Pool({
  user: adminDBUser,
  host: adminDBHost,
  database: adminDBName,
  password: adminDBPassword,
  port: adminDBPORT,
});

export const booksDBPool = new pg.Pool({
  user: dbUser,
  host: dbHost,
  database: booksDBName,
  password: dbPassword,
  port: dbPort,
});

async function createDatabaseIfNotExists(dbName) {
  try {
    const client = await adminPool.connect();
    try {
      const res = await client.query(checkDbQuery, [dbName]);
      if (res.rows.length === 0) {
        await client.query(createDbQuery(dbName));
        console.log(`Database "${dbName}" created successfully.`);
      } else {
        console.log(`${dbName} is ready and available for use.`);
      }
    } catch (err) {
      console.error(`Error creating database "${dbName}":`, err);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("❌ Error connecting to Postgres Admin DB:", err);
  }
}

async function getDatabase() {
  await createDatabaseIfNotExists(booksDBName);
}

getDatabase();

export default { booksDBPool };
