#!/bin/bash

# Script to create a pull request from mohameodo/agentai to nexiloop/ai
# Since you own both repositories, this will help you create the PR manually

echo "🚀 Nexiloop AI - Pull Request Setup Script"
echo "=========================================="
echo ""

echo "Step 1: Push the current branch to your mohameodo/agentai repository..."
git push origin contribute-template-features

echo ""
echo "Step 2: Creating pull request information..."
echo ""

echo "📋 Pull Request Details:"
echo "FROM: mohameodo/agentai (contribute-template-features branch)"
echo "TO: nexiloop/ai (main branch)"
echo ""

echo "🔗 To create the pull request manually:"
echo "1. Go to: https://github.com/nexiloop/ai"
echo "2. Click 'New Pull Request'"
echo "3. Click 'compare across forks'"
echo "4. Set:"
echo "   - Base repository: nexiloop/ai"
echo "   - Base branch: main"
echo "   - Head repository: mohameodo/agentai" 
echo "   - Compare branch: contribute-template-features"
echo "5. Use the title: '🚀 Complete AI Chat Application Refactor & Template Setup'"
echo "6. Copy the description from PULL_REQUEST_DESCRIPTION.md"
echo ""

echo "📄 Pull Request Description has been prepared in PULL_REQUEST_DESCRIPTION.md"
echo ""

echo "✅ Alternative: Direct GitHub URL (if repositories are connected):"
echo "https://github.com/nexiloop/ai/compare/main...mohameodo:agentai:contribute-template-features"
echo ""

echo "🎯 What this pull request includes:"
echo "- Complete UI/UX refactor and modernization"
echo "- Database schema fixes and migration scripts"
echo "- GitHub template setup with all necessary files"
echo "- Authentication improvements (Google/GitHub OAuth)"
echo "- Project organization and build improvements"
echo "- Comprehensive documentation and issue templates"
echo ""

echo "📊 Files being contributed:"
git diff --name-only origin/main contribute-template-features | head -20
echo "... and many more!"
echo ""

echo "🚀 Ready to contribute all these enhancements to nexiloop/ai!"
