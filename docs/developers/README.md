# Developer Documentation

## Overview

This section contains technical documentation for developers working on or integrating with Balsm.IO.

## Architecture

- [System Architecture](./architecture/overview.md) - High-level system design
- [Microservices](./architecture/microservices.md) - Service breakdown
- [Data Models](./architecture/data-models.md) - Database schemas
- [Infrastructure](./architecture/infrastructure.md) - Cloud and deployment

## Getting Started

### Prerequisites
- .NET 8.0 SDK
- Flutter 3.x
- PostgreSQL 15+
- Redis 7.x

### Repositories

- [Balsm-API-DotNet](https://github.com/Balsm-IO/Balsm-API-DotNet) - Backend API (.NET)
- [balsm_app_flutter](https://github.com/Balsm-IO/balsm_app_flutter) - Mobile app (Flutter)
- [website](https://github.com/Balsm-IO/website) - Marketing website
- [Balsm-Roadmap](https://github.com/Balsm-IO/Balsm-Roadmap) - Product roadmap

### Setup Guides

- [Backend Setup](./setup/backend.md) - Running the .NET API locally
- [Mobile App Setup](./setup/mobile.md) - Flutter development environment
- [Database Setup](./setup/database.md) - PostgreSQL configuration
- [Docker Development](./setup/docker.md) - Containerized development

## Development Guidelines

- [Code Standards](./guidelines/code-standards.md) - Coding conventions
- [Git Workflow](./guidelines/git-workflow.md) - Branch strategy and commits
- [Testing](./guidelines/testing.md) - Unit, integration, and e2e tests
- [Security](./guidelines/security.md) - Security best practices
- [HIPAA Compliance](./guidelines/hipaa.md) - Healthcare data requirements

## API Integration

- [API Reference](../api/README.md) - Full API documentation
- [SDK Libraries](./integration/sdks.md) - Client libraries
- [Webhooks](./integration/webhooks.md) - Event-driven integrations
- [Sample Code](./integration/samples.md) - Example implementations

## Deployment

- [CI/CD Pipeline](./deployment/cicd.md) - Automated deployment
- [Environment Configuration](./deployment/environments.md) - Dev, staging, production
- [Monitoring](./deployment/monitoring.md) - Logs and metrics
- [Database Migrations](./deployment/migrations.md) - Schema updates

## Contributing

- [Contribution Guide](./CONTRIBUTING.md) - How to contribute
- [Code Review Process](./contributing/code-review.md) - Review guidelines
- [Release Process](./contributing/releases.md) - Versioning and releases

## Tools and Technologies

### Backend Stack
- .NET 8 / ASP.NET Core
- Entity Framework Core
- PostgreSQL
- Redis
- RabbitMQ

### Mobile Stack
- Flutter / Dart
- Riverpod (State Management)
- Dio (HTTP Client)

### DevOps
- Docker / Kubernetes
- GitHub Actions
- Azure Cloud

## Support

- [Development Discord](https://discord.gg/balsm-dev)
- [GitHub Discussions](https://github.com/orgs/Balsm-IO/discussions)
- Email: dev@balsm.io
