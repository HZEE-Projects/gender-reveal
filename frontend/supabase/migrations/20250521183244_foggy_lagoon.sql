/*
  # Create guesses table for gender reveal website

  1. New Tables
    - `guesses`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `guess` (text, required)
      - `message` (text)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `guesses` table
    - Add policies for:
      - Anyone can insert new guesses
      - Anyone can read guesses
*/

CREATE TABLE IF NOT EXISTS guesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  guess text NOT NULL,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE guesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert guesses"
  ON guesses
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read guesses"
  ON guesses
  FOR SELECT
  TO public
  USING (true);