# Security Guide for SmartInvest

This document outlines the security measures implemented in SmartInvest and best practices for deployment.

## 🔒 Current Security Status

| Security Aspect | Status | Notes |
|----------------|--------|-------|
| **Input Sanitization** | ✅ Implemented | All user inputs are sanitized before use |
| **XSS Protection** | ✅ Implemented | React auto-escapes JSX + custom sanitization |
| **Type Safety** | ✅ Implemented | All `any` types removed |
| **Error Boundaries** | ✅ Implemented | React Error Boundary prevents app crashes |
| **API Key Protection** | ⚠️ Client-side | API key in bundle (see recommendations below) |
| **Rate Limiting** | ✅ Implemented | 24 RPM, 240 RPD limits enforced |
| **SQL Injection** | ➖ N/A | No database used (localStorage only) |

---

## 🛡️ Implemented Security Features

### 1. Input Sanitization

All user inputs are sanitized using utility functions in `src/utils/sanitize.ts`:

- **Chat Messages**: `sanitizeChatMessage()` - Removes HTML, sanitizes URLs, limits length
- **User Names**: `sanitizeName()` - Allows only letters, spaces, hyphens
- **AI Prompts**: `sanitizePrompt()` - Removes HTML tags, truncates to max length

**Where it's used:**
- `src/pages/Chat.tsx` - Chat messages and user name input
- All inputs to AI services are sanitized

### 2. XSS (Cross-Site Scripting) Protection

**Two layers of protection:**

1. **React Automatic Escaping**: All JSX content is automatically escaped
   ```tsx
   <p>{message.content}</p>  {/* Safe - React escapes this */}
   ```

2. **Custom Sanitization**: Inputs are sanitized before being stored or sent to API
   ```tsx
   const sanitized = sanitizeChatMessage(userInput);
   ```

### 3. Rate Limiting

Implemented in `src/services/rateLimiter.ts`:

- **24 requests per minute** (under Google's 25 RPM limit)
- **240 requests per day** (under Google's 250 RPD limit)
- Automatic queue management
- Daily quota tracking

### 4. Error Boundaries

Implemented in `src/components/ErrorBoundary.tsx`:

- Catches React component errors
- Prevents entire app from crashing
- Provides user-friendly fallback UI
- Logs errors in development mode

### 5. Memory Management

- Chat history limited to 100 messages (`UI_CONFIG.MAX_MESSAGES`)
- Prevents memory leaks from unlimited message storage
- Automatic old cache cleanup (7 days)

---

## ⚠️ API Key Security

### Current Implementation

The API key is stored in the `.env` file and accessed via `import.meta.env.VITE_GEMINI_API_KEY`.

**Important:**
- ✅ `.env` is in `.gitignore` (not committed to git)
- ✅ `.env.example` provides a template for other developers
- ⚠️ The key is bundled in client-side JavaScript

### Why This Is A Concern

Since this is a client-side application:
- The API key will be visible in the browser's DevTools (Network tab)
- Anyone who uses your app can find the API key
- Malicious users could use your key and exhaust your quota

### Recommended Mitigations

Since you cannot revoke the key, here's how to protect it:

#### Option 1: Restrict Your API Key (Recommended)

Go to [Google Cloud Console](https://console.cloud.google.com/):

1. **Navigate to**: APIs & Services → Credentials
2. **Edit your API key** and add restrictions:
   - **Application restrictions**: Add your domain (if deployed)
   - **API restrictions**: Only enable "Generative Language API"
3. **Set quotas**:
   - Maximum requests per day: 1000 (or lower)
   - Maximum requests per minute: 15

#### Option 2: Use a Backend Proxy (Best Security)

Create a simple backend to hide the API key:

```typescript
// Example: server/api/chat.ts (Node.js/Express)
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY  // Server-side only!
});

app.post('/api/chat', async (req, res) => {
  // Add rate limiting per session
  // Add authentication
  const response = await ai.models.generateContentStream({
    model: 'gemini-3-pro-preview',
    contents: req.body.contents,
  });
  // ... stream response back to client
});
```

Then update your client code:
```typescript
// Instead of calling Google directly
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ contents }),
});
```

#### Option 3: Use Cloudflare Workers / Vercel Edge Functions

Deploy a serverless function that:
- Holds your API key securely
- Only accepts requests from your domain
- Implements per-user rate limiting
- Forwards requests to Google AI API

---

## 🚀 Deployment Security Checklist

Before deploying to production:

- [ ] Add API key restrictions in Google Cloud Console
- [ ] Set up monitoring for API quota usage
- [ ] Enable HTTPS (required for secure API calls)
- [ ] Add CSP (Content Security Policy) headers
- [ ] Review and test error handling
- [ ] Test rate limiting under load
- [ ] Set up alerts for quota exhaustion
- [ ] Document API key rotation process

---

## 🔐 Best Practices for Development

### 1. Never Commit `.env` Files

```bash
# Already in .gitignore
.env
.env.local
.env.production.local
```

### 2. Use `.env.example` for Documentation

```bash
# .env.example - Safe to commit
VITE_GEMINI_API_KEY=your_api_key_here
```

### 3. Rotate API Keys Regularly

Even if you can't revoke the current key:
- Set a calendar reminder to check usage
- Monitor for suspicious activity
- Plan to migrate to a backend proxy in the future

### 4. Monitor API Usage

Check your [Google AI Studio dashboard](https://ai.google.dev/) regularly:
- Track daily/monthly usage
- Look for unusual spikes
- Set up budget alerts

---

## 📊 Security Headers for Deployment

Add these headers to your web server configuration:

### Nginx Example:
```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
```

### Vercel/Netlify (`vercel.json` or `netlify.toml`):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 📝 Additional Security Notes

### localStorage Security

- Data in localStorage is accessible to any JavaScript code
- If XSS vulnerability occurs, all localStorage data can be stolen
- **Current mitigation**: Input sanitization prevents XSS
- **Future improvement**: Consider encryption for sensitive data

### Third-Party Dependencies

Regularly update dependencies:
```bash
npm audit
npm audit fix
```

### Content Security Policy (CSP)

Consider adding CSP to restrict resource loading:
- Only load scripts from trusted sources
- Block inline scripts (except React hydration)
- Restrict iframe usage (YouTube embeds are currently used)

---

## 🆘 Security Incident Response

If you suspect your API key has been compromised:

1. **Immediate**: Check usage in Google Cloud Console
2. **If possible**: Revoke the compromised key
3. **If can't revoke**: Add stricter restrictions
4. **Monitor**: Watch for unusual usage patterns
5. **Plan**: Migrate to backend proxy architecture

---

## 📚 Resources

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [Google AI API Quotas](https://ai.google.dev/docs/quotas)
- [React Security Best Practices](https://react.dev/learn/keeping-components-pure)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**Last Updated**: 2025-02-21
**Version**: 1.0.0
