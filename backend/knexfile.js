import 'dotenv/config';
import { missingVariables } from './src/dbConfig/get-db.js';

if (missingVariables.length > 0) {
    missingVariables.forEach(({ name }) => {
        console.error(`Error creating database: Value for the environment variable ${name} is not provided.`);
    });
    process.exit(1);
}


const config = {
    development: {
        client: 'postgresql',
        pool: { min: 2, max: 10 },
    },
    auth: {
        client: 'postgresql',
        connection: {
            database: process.env.POSTGRES_AUTH_DB_NAME,
            user: process.env.POSTGRES_ADMIN_DB_USER,
            password: process.env.POSTGRES_ADMIN_PASSWORD,
        },
        pool: { min: 2, max: 10 },
        migrations: { tableName: 'knex_user_migrations', directory: './src/dbConfig/migrations' },
        seeds: { directory: './src/dbConfig/seeds/auth' }
    },
    news: {
        client: 'postgresql',
        connection: {
            database: process.env.POSTGRES_NEWS_DB_NAME,
            user: process.env.POSTGRES_ADMIN_DB_USER,
            password: process.env.POSTGRES_ADMIN_PASSWORD,
        },
        pool: { min: 2, max: 10 },
        migrations: { tableName: 'knex_news_migrations', directory: './src/dbConfig/migrations' },
        seeds: { directory: './src/dbConfig/seeds/news' }
    },
    user_interactions: {
        client: 'postgresql',
        connection: {
            database: process.env.POSTGRES_USER_INTERACTIONS_DB_NAME,
            user: process.env.POSTGRES_ADMIN_DB_USER,
            password: process.env.POSTGRES_ADMIN_PASSWORD,
        },
        pool: { min: 2, max: 10 },
        migrations: { tableName: 'knex_user_interactions_migrations', directory: './src/dbConfig/migrations' },
    }
}

export default config