export const getUserByEmail = "SELECT * FROM users WHERE email ILIKE $1"
export const getRegisterUser = "INSERT INTO users(username,email,password) VALUES($1,$2,$3) RETURNING *"
export const getUserById = "SELECT username,email FROM users WHERE id=$1"

