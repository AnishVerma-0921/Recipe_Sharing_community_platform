# Recipe Sharing Community Platform

A web application where food lovers can discover, create, and share recipes with others.

## About the Project

The Recipe Sharing Community Platform, named **Forkful**, is designed to bring cooking enthusiasts together. Users can explore different recipes, discover new cuisines, save their favourite dishes, and share their own cooking ideas with the community.

## Features

- Browse recipes shared by the community.
- Search recipes by title, ingredients, and tags.
- Filter recipes by cuisine, diet, and cooking time.
- View recipe details, ingredients, and cooking instructions.
- Save favourite recipes.
- Publish and share your own recipes.
- Explore ratings and reviews.

## Tech Stack

- **Frontend:** React.js, Vite, CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Image Storage:** Cloudinary *(planned)*

## Run locally

### Prerequisites

- Node.js
- npm
- [PostgreSQL 13+ for Windows](https://www.postgresql.org/download/windows/) (or Docker Desktop)

### Installation

1. Install PostgreSQL for Windows, then use SQL Shell (psql) or pgAdmin to create
   the local app role and database:

   ```sql
   CREATE USER forkful WITH PASSWORD 'choose-a-local-password';
   CREATE DATABASE forkful OWNER forkful;
   ```

   From the `Backend` directory, copy the environment template and set the
   database password:

   ```powershell
   if (-not (Test-Path .env)) { Copy-Item .env.example .env }
   ```

   If `.env` already exists, keep it and add/update `DATABASE_URL` and
   `SESSION_SECRET` from `.env.example` instead of overwriting it.

   Alternatively, from `Backend`, run `docker compose up -d` if Docker Desktop
   is installed; the example `DATABASE_URL` matches the Compose development
   credentials.

2. In `Backend/.env`, optionally set `ADMIN_NAME`, `ADMIN_EMAIL`, and
   `ADMIN_PASSWORD` before starting the API to create the initial administrator.
   Public sign-ups always create standard user accounts.

3. In the `Backend` directory, install dependencies and start the API:

   ```powershell
   npm install
   npm run dev
   ```

4. In a separate terminal, install frontend dependencies and start Vite:

   ```powershell
   cd Frontend
   npm install
   npm run dev
   ```

4. Open the frontend URL shown by Vite.

The API creates its tables and a sample recipe automatically on first startup.
Use a strong `SESSION_SECRET` and unique database credentials before deploying.
Database connection settings are in `Backend/.env` (`DATABASE_URL`).

## Project Status

The app is under development. User accounts and published recipes are stored in
PostgreSQL; passwords are hashed and sessions are stored in PostgreSQL. Existing
browser-local accounts and published recipes are not migrated automatically.

## Future Enhancements

- User registration and login
- Recipe ratings and reviews
- Personal recipe collections
- Recipe image uploads
- Personalised recipe feeds
- Shopping lists with adjustable serving sizes

## Author

Anish Verma
Amber Gupta

---

Made with ❤️ for people who love cooking and sharing food.
