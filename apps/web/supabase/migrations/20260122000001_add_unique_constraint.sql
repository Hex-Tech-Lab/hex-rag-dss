-- Fix for Error 42P10: ON CONFLICT mismatch
-- Add missing UNIQUE constraint to profiles.user_email
ALTER TABLE profiles ADD CONSTRAINT profiles_user_email_key UNIQUE (user_email);
