# API Documentation

## Overview

The Balsm.IO API provides a comprehensive interface for healthcare data management, clinical workflows, and patient care coordination.

## Base URL

```
Production: https://api.balsm.io/v1
Staging: https://staging-api.balsm.io/v1
```

## Authentication

All API requests require authentication using Bearer tokens. See [Authentication Guide](./authentication.md) for details.

## Quick Start

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.balsm.io/v1/health
```

## API Sections

- [Authentication](./authentication.md) - OAuth 2.0 and token management
- [Patients](./patients.md) - Patient management endpoints
- [Appointments](./appointments.md) - Scheduling and calendar management
- [Clinical Records](./clinical-records.md) - EHR data access
- [Prescriptions](./prescriptions.md) - Medication management
- [Labs](./labs.md) - Laboratory orders and results
- [Webhooks](./webhooks.md) - Event notifications

## Rate Limits

- Production: 1000 requests per hour per token
- Staging: 100 requests per hour per token

## Versioning

The API uses semantic versioning. Current version: `v1`

## Error Handling

All errors follow a consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

## Support

For API support, email api@balsm.io or visit our [developer portal](https://developers.balsm.io).
