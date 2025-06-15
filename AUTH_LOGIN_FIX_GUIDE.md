# Authentication Troubleshooting Guide

## Issues Fixed in This Update

### 1. ✅ Enhanced Error Handling
- Added detailed console logging for debugging
- Better error messages shown to users
- Improved validation of OAuth responses

### 2. ✅ Debug Page Added
- Created `/auth/debug` page to help diagnose issues
- Shows environment configuration status
- Allows testing OAuth flows directly

### 3. ✅ Better OAuth Flow
- Added validation for OAuth URLs
- Enhanced redirect URL handling
- More detailed logging throughout the process

## Common Login Issues & Solutions

### Issue 1: "Authentication is not configured properly"
**Cause**: Missing environment variables or Supabase configuration

**Solution**:
1. Check your `.env.local` file has:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
2. Restart your development server after adding env vars

### Issue 2: OAuth Redirect Errors
**Cause**: Mismatch between configured redirect URLs and actual URLs

**Solution**:
1. Go to your Supabase Dashboard
2. Navigate to Authentication > Settings
3. Under "Site URL" set: `https://ai.nexiloop.com` (production) or `http://localhost:3000` (development)
4. Under "Redirect URLs" add:
   - `https://ai.nexiloop.com/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)

### Issue 3: OAuth Provider Not Configured
**Cause**: Google OAuth app not set up in Supabase

**Solution**:
1. Go to Supabase Dashboard > Authentication > Providers
2. Enable Google provider:
   - Add your Google OAuth Client ID
   - Add your Google OAuth Client Secret

### Issue 4: "No OAuth URL returned"
**Cause**: Supabase OAuth configuration issue

**Solution**:
1. Check browser console for detailed error messages
2. Verify your OAuth providers are properly configured
3. Ensure your app domains are whitelisted in OAuth provider settings

## Testing Your Setup

### 1. Use the Debug Page
Visit `/auth/debug` to check your configuration status and test OAuth flows.

### 2. Check Browser Console
Open browser developer tools and watch the console when clicking login buttons. Look for:
- "Starting [Provider] sign-in..."
- "Redirect URL: ..."
- Any error messages

### 3. Verify Environment Variables
In your browser console, you can check if variables are loaded:
```javascript
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
```

## OAuth Provider Setup

### Google OAuth Setup  
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials with:
   - Authorized domains: `ai.nexiloop.com`, `supabase.co`
   - Authorized redirect URIs: `https://xzcgbnsoindhudaubqfs.supabase.co/auth/v1/callback`

## Next Steps After This Fix

1. **Test the enhanced login flow** - Try logging in with Google and check console logs
2. **Visit `/auth/debug`** - Use the debug page to verify your setup  
4. **Verify redirect URLs** - Make sure they match between your app and Google OAuth provider

The login should now work much better with Google OAuth only and improved error handling!
