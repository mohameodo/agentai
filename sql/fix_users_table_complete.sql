-- Fix Users Table Schema - Add Missing Columns
-- This migration adds missing columns to the users table to fix chat creation errors

-- Add missing columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS message_count INTEGER DEFAULT 0;

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS daily_message_count INTEGER DEFAULT 0;

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS daily_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS anonymous BOOLEAN DEFAULT FALSE;

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS display_name TEXT;

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS preferred_model TEXT DEFAULT 'gpt-4o-mini';

-- Add the critical updated_at column that's referenced in many places
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add premium and pro usage tracking columns
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS premium BOOLEAN DEFAULT FALSE;

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS daily_pro_message_count INTEGER DEFAULT 0;

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS daily_pro_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS system_prompt TEXT;

-- Add missing columns that might be referenced elsewhere
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS special_agent_count INTEGER DEFAULT 0;

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS special_agent_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update any existing records to have proper defaults
UPDATE public.users 
SET 
  message_count = COALESCE(message_count, 0),
  daily_message_count = COALESCE(daily_message_count, 0),
  daily_reset = COALESCE(daily_reset, NOW()),
  anonymous = COALESCE(anonymous, false),
  preferred_model = COALESCE(preferred_model, 'gpt-4o-mini'),
  special_agent_count = COALESCE(special_agent_count, 0),
  special_agent_reset = COALESCE(special_agent_reset, NOW()),
  updated_at = COALESCE(updated_at, NOW()),
  premium = COALESCE(premium, false),
  daily_pro_message_count = COALESCE(daily_pro_message_count, 0),
  daily_pro_reset = COALESCE(daily_pro_reset, NOW()),
  last_active_at = COALESCE(last_active_at, NOW());

-- Create indexes for better performance on frequently queried columns
CREATE INDEX IF NOT EXISTS idx_users_daily_reset ON public.users(daily_reset);
CREATE INDEX IF NOT EXISTS idx_users_message_count ON public.users(message_count);
CREATE INDEX IF NOT EXISTS idx_users_anonymous ON public.users(anonymous);
CREATE INDEX IF NOT EXISTS idx_users_updated_at ON public.users(updated_at);

-- Ensure updated_at trigger exists for users table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.users 
ALTER COLUMN special_agent_count TYPE INTEGER USING special_agent_count::integer;

ALTER TABLE public.users 
ALTER COLUMN special_agent_count TYPE INTEGER USING special_agent_count::integer;