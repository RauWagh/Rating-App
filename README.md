Store Ratings App

Full-stack app with Express (Node.js), PostgreSQL, and React.

Backend Setup
- cd backend
- Copy .env.example to .env and adjust DATABASE_URL/JWT_SECRET
- Start Postgres (Docker): docker compose up -d
- Initialize DB schema: npm run db:init
- Seed sample data: npm run db:seed
- Start API: npm run dev

Frontend Setup
- cd frontend
- npm install
- npm run dev

Notes
- Vite proxy forwards /api to http://localhost:4000
- Seed credentials: admin@example.com / Admin@123
# Rating-App