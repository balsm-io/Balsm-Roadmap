# Authentication

Secure API access for Balsm.IO healthcare platform.

## Overview

All API requests must be authenticated using either:
- **API Keys** - For server-to-server integrations
- **OAuth 2.0** - For user-facing applications

## API Key Authentication

### Getting Your API Key

1. Login to your Balsm.IO dashboard
2. Navigate to **Settings > API Keys**
3. Click **Generate New Key**
4. Copy and securely store your key

### Using API Keys

Include your API key in the request header:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.balsm.io/v1/patients
```

```javascript
// JavaScript example
const response = await fetch('https://api.balsm.io/v1/patients', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});
```

```csharp
// C# example
var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = 
    new AuthenticationHeaderValue("Bearer", "YOUR_API_KEY");

var response = await client.GetAsync("https://api.balsm.io/v1/patients");
```

## OAuth 2.0 Authentication

### Authorization Code Flow

1. **Redirect to Authorization URL**:
   ```
   https://auth.balsm.io/oauth/authorize?
     client_id=YOUR_CLIENT_ID&
     response_type=code&
     redirect_uri=YOUR_REDIRECT_URI&
     scope=read:patients%20write:patients
   ```

2. **Exchange Code for Token**:
   ```bash
   curl -X POST https://auth.balsm.io/oauth/token \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "client_id=YOUR_CLIENT_ID" \
     -d "client_secret=YOUR_CLIENT_SECRET" \
     -d "code=AUTHORIZATION_CODE" \
     -d "grant_type=authorization_code"
   ```

3. **Use Access Token**:
   ```bash
   curl -H "Authorization: Bearer ACCESS_TOKEN" \
        https://api.balsm.io/v1/patients
   ```

## Scopes

| Scope | Description |
|-------|-------------|
| `read:patients` | Read patient information |
| `write:patients` | Create/update patients |
| `read:appointments` | View appointments |
| `write:appointments` | Manage appointments |
| `read:prescriptions` | View prescriptions |
| `write:prescriptions` | Create prescriptions |

## Security Best Practices

- **Never expose API keys** in client-side code
- **Use HTTPS only** for all requests
- **Rotate keys regularly** (every 90 days recommended)
- **Use minimal scopes** required for your application
- **Monitor API usage** for unusual patterns

## Rate Limits

- **API Keys**: 10,000 requests per hour
- **OAuth**: 5,000 requests per hour per user
- **Burst**: Up to 100 requests per minute

## Error Responses

```json
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "The provided token is invalid or expired"
  },
  "timestamp": "2026-03-19T03:25:08Z"
}
```

---

*Need help? Contact api-support@balsm.io*