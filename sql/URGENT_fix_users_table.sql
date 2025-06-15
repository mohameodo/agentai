-- Fix missing columns that cause login failures
-- Run this in Supabase SQL Editor
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS display_name TEXT,
    ADD COLUMN IF NOT EXISTS anonymous BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS daily_message_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS daily_reset TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS message_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS preferred_model TEXT,
    ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS daily_pro_message_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS daily_pro_reset TIMESTAMPTZ;
