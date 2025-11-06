# Supabase Database Documentation

## Overview

This section contains comprehensive documentation for all Supabase database tables used in the SkyGuyver voice AI platform.

## Database Tables

### Core Tables

- [**Client Subscriptions**](./tables/client-subscriptions) - Customer subscription management and billing
- [**User Sessions**](./tables/user-sessions) - User session tracking and analytics
- [**Subscription Plans**](./tables/subscription-plans) - Available subscription plans and pricing
- [**Call Validation Logs**](./tables/call-validation-logs) - Call validation and compliance tracking
- [**Assistants**](./tables/assistants) - AI assistant configurations and settings

### SQL Queries & Scripts

- [**SQL Queries**](./sql-queries/) - Collection of database queries and management scripts
- [**User Data Removal**](./sql-queries/user-data-removal) - Scripts for removing users and related data
- [**Database Maintenance**](./sql-queries/) - Cleanup and optimization queries

## Key Features

- **Subscription Management** - Complete billing and plan management
- **Usage Tracking** - Monitor minutes and costs per client
- **Session Analytics** - Track user interactions and call patterns
- **Compliance Logging** - Maintain audit trails for all calls

## Database Schema

The SkyGuyver platform uses Supabase as the primary database, providing:

- PostgreSQL-based relational database
- Real-time subscriptions
- Row-level security (RLS)
- Built-in authentication integration
- Automatic API generation

## Getting Started

1. Review the [Client Subscriptions](./tables/client-subscriptions) table for subscription management
2. Check [User Sessions](./tables/user-sessions) for session tracking implementation
3. Explore [Subscription Plans](./tables/subscription-plans) for pricing structure
4. Review [Call Validation Logs](./tables/call-validation-logs) for compliance requirements
