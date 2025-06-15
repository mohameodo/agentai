# URGENT: Database Schema Fix Required

## Problem
The error `record "new" has no field "updated_at"` indicates that the users table is missing the `updated_at` column, which is required by the database trigger.

## Solution
Run the following SQL migration in your Supabase dashboard:

### Option 1: Quick Fix (Recommended)
Run this migration file in Supabase SQL Editor:
```
/workspaces/agentai/sql/URGENT_fix_users_table.sql
```

### Option 2: Manual Steps
If you prefer to run the commands manually:

1. **Drop the problematic trigger temporarily:**
```sql
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
```

2. **Add the missing updated_at column:**
```sql
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
```

3. **Add other missing columns:**
```sql
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS message_count INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS daily_message_count INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS daily_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS anonymous BOOLEAN DEFAULT FALSE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS preferred_model TEXT DEFAULT 'gpt-4o-mini';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS premium BOOLEAN DEFAULT FALSE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS daily_pro_message_count INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS daily_pro_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS system_prompt TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS special_agent_count INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS special_agent_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW();
```

4. **Update existing records:**
```sql
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
```

5. **Recreate the trigger:**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## After Running the Migration
1. Test login functionality
2. Try creating a new chat
3. Verify that the model selector works and persists settings

## What Was Fixed
- Added missing `updated_at` column to users table
- Added all other missing columns required by the application
- Updated TypeScript database types to match the schema
- Fixed the trigger that was causing the error
- Added performance indexes

The login and chat creation should now work correctly after running this migration.
