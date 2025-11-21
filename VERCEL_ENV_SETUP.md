# Vercel Environment Variables Setup

## Required Environment Variables

Update the following environment variables in your Vercel project settings for `old/behnace_redirect`:

### 1. ALLOWED_DOMAINS
**Current**: `behance.net,www.behance.net,youtube.com,youtu.be,www.youtube.com,weburon.netlify.app,drive.google.com,docs.google.com,sheets.google.com,slides.google.com`

**Update to**: Add `www.globexe.site,globexe.site` to the list

**Full value**:
```
behance.net,www.behance.net,youtube.com,youtu.be,www.youtube.com,weburon.netlify.app,drive.google.com,docs.google.com,sheets.google.com,slides.google.com,www.globexe.site,globexe.site
```

This allows `api/r.js` to redirect to the custom domain portfolio page.

### 2. TRACKER_URLS (Keep existing)
**Value**: `https://script.google.com/macros/s/AKfycbyrMIUf0qEelqpusgoR4zWSgzdwO1zB65aZyoMHBlaK5wn_wtgOnWd509uE900loMQA/exec`

This is the Google Apps Script URL that handles click tracking and notifications.

## How to Update

1. Go to Vercel project dashboard
2. Select the `old/behnace_redirect` project
3. Go to Settings → Environment Variables
4. Find `ALLOWED_DOMAINS` and update the value
5. Redeploy the project if needed

## Flow Verification

After updating:
1. Email link: `https://www.globexe.site/api/r?rid=XXX&dest=https://www.globexe.site/portfolio`
2. `api/r.js` validates `dest` against `ALLOWED_DOMAINS` ✅
3. `api/r.js` calls Google Apps Script with `action=track&rid=XXX&dest=...&via=vercel`
4. Google Apps Script sends click notification ✅
5. `api/r.js` returns 302 redirect to `https://www.globexe.site/portfolio?rid=XXX`
6. Portfolio page loads with `rid` parameter preserved in URL

