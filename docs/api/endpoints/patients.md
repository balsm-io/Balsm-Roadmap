# Patient Management API

Manage patient records and information securely.

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patients` | List all patients |
| GET | `/patients/{id}` | Get patient by ID |
| POST | `/patients` | Create new patient |
| PUT | `/patients/{id}` | Update patient |
| DELETE | `/patients/{id}` | Soft delete patient |

## List Patients

```http
GET /api/v1/patients
```

### Query Parameters

- `page` (integer) - Page number (default: 1)
- `limit` (integer) - Items per page (default: 20, max: 100)
- `search` (string) - Search by name, MRN, or DOB
- `status` (string) - Filter by status: `active`, `inactive`

### Example Request

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "https://api.balsm.io/v1/patients?page=1&limit=10&status=active"
```

### Example Response

```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": "pat_1234567890",
        "mrn": "MRN-001234",
        "firstName": "John",
        "lastName": "Doe",
        "dateOfBirth": "1985-03-15",
        "gender": "male",
        "email": "john.doe@example.com",
        "phone": "+1-555-0123",
        "status": "active",
        "createdAt": "2026-01-15T10:00:00Z",
        "updatedAt": "2026-03-10T14:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "totalPages": 15
    }
  },
  "timestamp": "2026-03-19T03:25:20Z"
}
```

## Get Patient by ID

```http
GET /api/v1/patients/{id}
```

### Example Request

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.balsm.io/v1/patients/pat_1234567890
```

### Example Response

```json
{
  "success": true,
  "data": {
    "id": "pat_1234567890",
    "mrn": "MRN-001234",
    "firstName": "John",
    "lastName": "Doe",
    "middleName": "Michael",
    "dateOfBirth": "1985-03-15",
    "gender": "male",
    "email": "john.doe@example.com",
    "phone": "+1-555-0123",
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zipCode": "12345",
      "country": "US"
    },
    "emergencyContact": {
      "name": "Jane Doe",
      "relationship": "spouse",
      "phone": "+1-555-0124"
    },
    "insurance": {
      "primary": {
        "provider": "Blue Cross",
        "policyNumber": "BC123456789",
        "groupNumber": "GRP001"
      }
    },
    "status": "active",
    "createdAt": "2026-01-15T10:00:00Z",
    "updatedAt": "2026-03-10T14:30:00Z"
  },
  "timestamp": "2026-03-19T03:25:20Z"
}
```

## Create Patient

```http
POST /api/v1/patients
```

### Request Body

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "dateOfBirth": "1990-07-22",
  "gender": "female",
  "email": "jane.smith@example.com",
  "phone": "+1-555-0125",
  "address": {
    "street": "456 Oak Ave",
    "city": "Somewhere",
    "state": "NY",
    "zipCode": "54321"
  }
}
```

### Example Request

```bash
curl -X POST https://api.balsm.io/v1/patients \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "Jane",
       "lastName": "Smith",
       "dateOfBirth": "1990-07-22",
       "gender": "female",
       "email": "jane.smith@example.com"
     }'
```

## HIPAA Compliance Notes

- All patient data is encrypted at rest and in transit
- Access is logged for audit purposes  
- PHI access requires appropriate authorization
- Data retention follows healthcare regulations

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Invalid request data |
| 401 | Authentication required |
| 403 | Insufficient permissions |
| 404 | Patient not found |
| 409 | Duplicate MRN or email |
| 422 | Validation errors |

---

*For support, contact api-support@balsm.io*