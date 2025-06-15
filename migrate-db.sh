#!/bin/bash

# Database Migration Script
# This script will help you run the agents slug column migration

echo "🚀 Starting database migration for agents.slug column..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null
then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   npm install -g supabase"
    echo "   Or follow: https://supabase.com/docs/guides/cli/getting-started"
    exit 1
fi

# Check if we're in a Supabase project
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ This doesn't appear to be a Supabase project directory."
    echo "   Make sure you're in the project root and have run 'supabase init'"
    exit 1
fi

echo "✅ Supabase CLI found!"

# Run the migration
echo "📄 Running migration: sql/add_agents_slug_column.sql"

if [ -f "sql/add_agents_slug_column.sql" ]; then
    echo "🔄 Applying migration..."
    supabase db push --include-all
    
    if [ $? -eq 0 ]; then
        echo "✅ Migration completed successfully!"
        echo "🎉 The agents.slug column has been added to your database."
        echo ""
        echo "Next steps:"
        echo "1. Restart your application"
        echo "2. Test the agents functionality" 
        echo "3. Verify no more 'column agents.slug does not exist' errors"
    else
        echo "❌ Migration failed. Please check the error messages above."
        echo "💡 You can also manually run the SQL in your Supabase dashboard:"
        echo "   https://supabase.com/dashboard → SQL Editor → Run the contents of sql/add_agents_slug_column.sql"
    fi
else
    echo "❌ Migration file not found: sql/add_agents_slug_column.sql"
    echo "💡 You can manually run the SQL in your Supabase dashboard:"
    echo "   https://supabase.com/dashboard → SQL Editor → Paste and run the migration SQL"
fi

echo ""
echo "📋 Manual Migration Instructions:"
echo "1. Go to https://supabase.com/dashboard"
echo "2. Select your project"
echo "3. Go to SQL Editor"
echo "4. Copy and paste the contents of sql/add_agents_slug_column.sql"
echo "5. Click 'Run' to execute the migration"
