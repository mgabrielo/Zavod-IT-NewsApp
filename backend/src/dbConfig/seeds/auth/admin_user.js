import bcrypt from "bcrypt";
import "dotenv/config";

export const seed = async function (knex) {
  // Check if admin already exists
  const existingAdmin = await knex("users")
    .where({ email: process.env.ADMIN_EMAIL })
    .first();

  if (existingAdmin) {
    console.log("✅ Admin user already exists, skipping seed.");
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  // Insert the admin user
  await knex("users").insert([
    {
      username: "Admin-User",
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      photo: "cover-photo.png",
      created_at: new Date(),
      updated_at: new Date(),
      role: "admin",
    },
  ]);

  console.log("✅ Admin user seeded successfully!");
};
