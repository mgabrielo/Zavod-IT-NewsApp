# Library App Project built with React Vite, Material UI, Redux ToolKit, Node js, Knex, Express js, JWT, and PostgreSQL

# 1. Back-end :

This procedeure should start up the backend application:

- In the backend directory, Create .env file and copy contents from env.example into your env file.

- Fill In the env variables with your Postgres DB Configuration values including JWT SECRET value and PORT value

- Navigate to the backend directory on your terminal using the command: cd backend

- Open a terminal in your backend directory, and run the command: " npm run get-db " to create your database

- Next run this command in your backend terminal: " npm run migrate:auth " to start auth database migration

- Next run this command in your backend terminal: " npm run migrate:books " to start books database migration

- Next run this command in your backend terminal: " npm run seed:auth" to populate user table

- Next run this command in your backend terminal: " npm run seed:books" to populate books table

- Finally, Run the command: " npm run start " to start the backend node server on http://localhost:3000

# 2. Front-end :

This procedeure should start up the frontend application:

- In the frontend directory, if not available; create a .env file and add VITE_API_URL environment variable that communicates with your node server (for example: VITE_API_URL="http://localhost:3000")

- Navigate to the frontend directory on your terminal using the command: cd frontend

- Run the command: " npm run dev " on your frontend terminal to start the frontend client application

- Thereafter you can visit the frontend url on your browser by visiting the webpage on http://localhost:5173/ to see the application

# 3. Authentication :

- Go to env example file in backend folder

- Use values of ADMIN_EMAIL and ADMIN_PASSWORD to sign in to the react front end after seeding of user data is complete in backend via npm run seed:auth
