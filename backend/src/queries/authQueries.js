export const getUserByEmail = "SELECT * FROM users WHERE email ILIKE $1";
export const getRegisterUser =
  "INSERT INTO users(username,email,password,photo) VALUES($1,$2,$3,$4) RETURNING *";
export const getUserById =
  "SELECT id,username,email,role FROM users WHERE id=$1";
