CREATE TABLE IF NOT EXISTS email_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT email_signups_email_key UNIQUE (email)
);

ALTER TABLE email_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on email_signups"
  ON email_signups
  FOR INSERT
  TO public
  WITH CHECK (true);