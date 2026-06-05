# API Documentation

Complete REST API reference for Balsm.IO healthcare platform.

## Quick Start

### Base URL
```
https://api.balsm.io/v1
```

### Authentication
All API requests require authentication via API key or OAuth 2.0 token.

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Success message", 
  "timestamp": "2026-03-19T03:24:01Z"
}
```

## Core Endpoints

- **Patients**: `/patients` - Patient management
- **Clinical Records**: `/clinical-records` - Medical records
- **Appointments**: `/appointments` - Scheduling
- **Prescriptions**: `/prescriptions` - Medication management

## Security & Compliance

- HIPAA compliant
- HL7 FHIR compatible  
- SOC 2 Type II certified

*For support, contact api-support@balsm.io*