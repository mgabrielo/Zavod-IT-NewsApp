export const createDbQuery = (dbName) => {
    return `CREATE DATABASE ${dbName}`;
}
export const checkDbQuery = `SELECT 1 FROM pg_database WHERE datname = $1`;
