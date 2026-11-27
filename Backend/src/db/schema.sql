CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  description VARCHAR(1000) NOT NULL DEFAULT '',
  ingredients JSONB NOT NULL,
  steps TEXT[] NOT NULL,
  cuisine VARCHAR(80) NOT NULL,
  diet VARCHAR(40) NOT NULL DEFAULT '',
  difficulty VARCHAR(20) NOT NULL DEFAULT 'Easy',
  time INTEGER NOT NULL CHECK (time >= 0),
  servings INTEGER NOT NULL CHECK (servings > 0),
  rating NUMERIC(2, 1) NOT NULL DEFAULT 0,
  reviews INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] NOT NULL DEFAULT '{}',
  cover TEXT NOT NULL DEFAULT '',
  color VARCHAR(20) NOT NULL DEFAULT 'sage',
  author VARCHAR(50) NOT NULL,
  owner_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS recipes_created_at_idx ON recipes (created_at DESC);
CREATE INDEX IF NOT EXISTS recipes_cuisine_idx ON recipes (cuisine);
