# Database Fix Instructions

## Issue: Missing 'slug' column in agents table

The error you're seeing indicates that the `agents.slug` column doesn't exist in your Supabase database:

```
Error fetching curated agents: {code: '42703', details: null, hint: null, message: 'column agents.slug does not exist'}
```

## Solution: Run the SQL Migration

You need to run the SQL migration script to add the missing `slug` column to your `agents` table.

### Steps to Fix:

1. **Open your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Navigate to your project

2. **Access the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration Script**
   Copy and paste the following SQL script and execute it:

```sql
-- Migration: Add slug column to agents table
-- This migration adds the missing slug column to the agents table
-- and populates it with generated slugs for existing agents

-- Add the slug column to the agents table
ALTER TABLE public.agents 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Function to generate a slug from name and id
CREATE OR REPLACE FUNCTION generate_agent_slug(agent_name TEXT, agent_id TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Simple slug generation: lowercase name, replace spaces with hyphens, add part of ID
    RETURN lower(regexp_replace(agent_name, '[^a-zA-Z0-9\s]', '', 'g')) 
           || '-' || substring(agent_id from 7 for 6); -- Take 6 chars after 'agent_'
END;
$$ LANGUAGE plpgsql;

-- Update existing agents with generated slugs
UPDATE public.agents 
SET slug = generate_agent_slug(name, id)
WHERE slug IS NULL;

-- Make slug column NOT NULL after populating existing data
ALTER TABLE public.agents 
ALTER COLUMN slug SET NOT NULL;

-- Add unique constraint to slug column
ALTER TABLE public.agents 
ADD CONSTRAINT agents_slug_unique UNIQUE (slug);

-- Drop the temporary function
DROP FUNCTION IF EXISTS generate_agent_slug(TEXT, TEXT);

-- Create index on slug for better performance
CREATE INDEX IF NOT EXISTS idx_agents_slug ON public.agents(slug);
```

4. **Execute the Script**
   - Click "Run" or press Ctrl+Enter to execute the SQL
   - You should see success messages for each operation

5. **Verify the Fix**
   - After running the migration, refresh your application
   - The "column agents.slug does not exist" error should be resolved

## What This Migration Does:

1. **Adds slug column**: Creates a new `slug` column in the `agents` table
2. **Generates slugs**: Creates slugs for existing agents based on their names and IDs
3. **Sets constraints**: Makes the slug column required and unique
4. **Adds index**: Improves query performance for slug-based lookups
5. **Cleanup**: Removes the temporary function used for slug generation

## Alternative: Using Supabase CLI (if you have it installed)

If you have the Supabase CLI installed, you can also run:

```bash
supabase db push --include-all
```

This will apply any pending migrations.

## Verification

After running the migration, you can verify it worked by running this query in the SQL Editor:

```sql
SELECT id, name, slug FROM public.agents LIMIT 5;
```

You should see that all agents now have slug values populated.
