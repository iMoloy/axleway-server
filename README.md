# AxleWay Server

Express.js and MongoDB API server for the AxleWay car rental platform.

## Features

- JWT token issue and logout through HTTP-only cookies.
- Protected private APIs using cookie-based JWT verification.
- Cars CRUD APIs with owner protection.
- Search cars by name and filter by car type.
- Booking creation with booking count increment using MongoDB `$inc`.
- User-specific bookings endpoint.
- Environment-based MongoDB and CORS configuration.

## Tech Stack

- Express.js
- MongoDB Node.js Driver
- JSON Web Token
- Cookie Parser
- CORS
- Dotenv

## Environment Variables

Create `.env` from `.env.example`.

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net
DB_NAME=axleway
JWT_SECRET=replace_with_a_long_secret
```

For multiple client URLs, separate them with commas:

```env
CLIENT_URL=http://localhost:3000,https://axleway.vercel.app
```

## API Routes

### Auth

- `POST /auth/token`
- `POST /auth/logout`

### Cars

- `GET /cars`
- `GET /cars?search=sedan&type=SUV`
- `GET /cars/:id`
- `POST /cars`
- `GET /cars/owner/:email`
- `PATCH /cars/:id`
- `DELETE /cars/:id`

### Bookings

- `GET /bookings`
- `POST /bookings`
- `DELETE /bookings/:id`

## Local Development

```bash
npm install
npm run dev
```

## Production

```bash
npm start
```

## Render Deployment

Use these settings for a simple Render web service:

- Build Command: `npm install`
- Start Command: `npm start`
- Node Version: `20` or newer

Required Render environment variables:

```env
NODE_ENV=production
CLIENT_URL=https://axleway.vercel.app
MONGODB_URI=your_mongodb_connection_string
DB_NAME=axleway
JWT_SECRET=replace_with_a_long_secret
```

After deployment, update the client `VITE_API_URL` in Vercel with `/api` (or the live server URL if not using proxy).
