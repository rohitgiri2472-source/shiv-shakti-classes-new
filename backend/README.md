# Shiv Shakti Classes Backend

## Requirements
- Node.js LTS
- MongoDB Atlas account/database
- VS Code

## Setup
1. Open terminal inside this `backend` folder.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Put your MongoDB Atlas connection string in `MONGO_URI`.
5. Change `JWT_SECRET`.
6. Make sure `FRONTEND_URL` matches your Live Server URL.
7. Run `npm run dev`.

## Create admin
After `.env` is ready:
`npm run create-admin`

Default admin values from `.env.example`:
Email: admin@shivshakti.com
Password: Admin@123456

Change these before using a real deployment.

## API
GET `/` health check
POST `/api/auth/register`
POST `/api/auth/login`
GET `/api/dashboard` (student/admin token)
GET `/api/lectures`
POST `/api/lectures` (admin)
DELETE `/api/lectures/:id` (admin)
GET `/api/announcements/public`
GET `/api/announcements` (logged in)
POST `/api/announcements` (admin)
GET `/api/notifications` (logged in)
POST `/api/notifications` (admin)

The frontend uses `http://localhost:5000/api` by default.
