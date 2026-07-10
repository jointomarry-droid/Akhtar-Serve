# Enterprise-Level Prompt: Amazon & eBay Service Provider Web Application

## Project Overview

Build a **production-ready, enterprise-grade web application** that serves as a comprehensive service provider platform for Amazon and eBay sellers. The application should enable sellers to manage their multi-channel e-commerce operations, automate workflows, optimize listings, manage inventory, process orders, and gain actionable insights through advanced analytics.

---

## Core Mission Statement

Develop a **scalable, secure, and high-performance web application** that empowers Amazon and eBay sellers with professional-grade tools for marketplace management, business automation, and data-driven decision-making.

---

## Technology Stack Requirements

### Frontend
- **Framework**: Next.js 14+ (App Router) with React 18+
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui component library
- **State Management**: Zustand or React Query (TanStack Query)
- **Real-time**: WebSocket integration for live inventory/order updates

### Backend
- **Runtime**: Node.js 20+ LTS
- **Framework**: Next.js API Routes or NestJS
- **API**: RESTful + GraphQL (optional for complex queries)
- **Authentication**: NextAuth.js / Auth.js with OAuth 2.0

### Database & Storage
- **Primary Database**: PostgreSQL 16+ (via Prisma ORM)
- **Cache Layer**: Redis 7+ (session management, rate limiting, queue jobs)
- **File Storage**: AWS S3 / Cloudflare R2 (media, reports, exports)

### Infrastructure
- **Hosting**: Vercel / AWS / Railway
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry (error tracking), APM tools
- **Containerization**: Docker + Docker Compose (local dev)

---

## Functional Requirements

### 1. User Authentication & Authorization

```
FEATURE: Multi-Role Authentication System
- Email/password registration with email verification
- OAuth 2.0 login (Google, Apple, Microsoft)
- Multi-factor authentication (MFA/TOTP)
- Role-based access control (RBAC):
  • Owner/Admin: Full access to all features
  • Manager: Access to operations, analytics, team management
  • Operator: Access to orders, inventory, listings
  • Viewer: Read-only access to dashboards and reports
- JWT token-based session management
- Account lockout after failed attempts
- Password reset via secure email flow
```

### 2. Marketplace Integration Hub

```
FEATURE: Amazon SP-API Integration
- Authorization flow (LWA - Login with Amazon)
- Real-time order synchronization
- Inventory management (FBA/FBM)
- Product listing creation and optimization
- Pricing automation rules
- Order fulfillment tracking
- Return/refund management
- Advertising API integration (Sponsored Products)
- Brand Analytics data pull
- Fee calculation and profit analysis

FEATURE: eBay Integration API
- OAuth 2.0 authentication flow
- Active listings management
- Order management (create, ship, refund)
- Inventory sync (multi-location support)
- Listing optimization tools
- Promoted listings management
- Seller hub metrics integration
- eBay file exchange for bulk operations
- Catalog product matching
```

### 3. Product & Listing Management

```
FEATURE: Unified Product Catalog
- Multi-marketplace product database
- Product variants (size, color, material)
- SKU management with barcode support
- Product media management (images, videos)
- Bulk import/export (CSV, XML, API)
- Product templates for quick listing creation
- ASIN/UPC/EAN/GTIN management
- Product history and audit trail

FEATURE: Listing Optimization Engine
- AI-powered title optimization
- Bullet point/Bullet description suggestions
- SEO keyword research and recommendations
- Listing quality score calculator
- A/B testing framework for listings
- Competitor listing analysis
- Keyword rank tracking
- Content compliance checker (marketplace policy)
```

### 4. Inventory Management

```
FEATURE: Centralized Inventory Control
- Multi-warehouse/multi-location support
- Real-time stock level synchronization
- Low stock alerts and auto-reorder triggers
- Inventory transfer between warehouses
- Batch inventory updates
- Inventory valuation (FIFO, LIFO, Weighted Average)
- Cycle counting and physical inventory reconciliation
- Dead stock identification
- Inventory forecasting based on historical data
- FBA inventory health monitoring
- Multi-channel inventory allocation rules
```

### 5. Order Management System

```
FEATURE: Unified Order Dashboard
- Multi-marketplace order aggregation
- Order status tracking (real-time)
- Bulk order processing
- Order priority management
- Custom order tagging/labeling
- Order notes and internal comments
- Automated order routing rules
- Split order handling
- Backorder management
- Order export for accounting

FEATURE: Fulfillment Management
- FBA shipment creation and tracking
- FBM self-fulfillment workflow
- Third-party logistics (3PL) integration
- Shipping label generation (USPS, UPS, FedEx, DHL)
- Tracking number auto-update to marketplaces
- Delivery confirmation and proof
- Returns processing workflow
- Damaged/lost item management
```

### 6. Pricing Intelligence

```
FEATURE: Dynamic Pricing Engine
- Rule-based pricing automation
- Competitor price monitoring
- MAP (Minimum Advertised Price) enforcement
- Price elasticity analysis
- Promotional pricing campaigns
- Bundle pricing strategies
- Currency conversion for international selling
- Price history tracking and alerts
- Profit margin calculator (COGS + fees + shipping)
- Break-even analysis tools
```

### 7. Analytics & Reporting

```
FEATURE: Business Intelligence Dashboard
- Sales analytics (daily, weekly, monthly, yearly)
- Revenue and profit margin tracking
- Conversion rate analysis
- Traffic and session analytics
- Customer acquisition cost (CAC)
- Customer lifetime value (CLV)
- Inventory turnover ratio
- Best/worst performing products
- Market share estimation
- Geographic sales distribution
- Time-series trend analysis

FEATURE: Custom Report Builder
- Drag-and-drop report designer
- Scheduled report generation and email delivery
- Export formats (PDF, Excel, CSV)
- Custom KPI dashboards
- Comparative analysis (period-over-period)
- Custom date range analysis
- Marketplace comparison reports
- Product performance reports
- Financial summaries for accounting
```

### 8. Communication & Notifications

```
FEATURE: Multi-Channel Notification System
- In-app notification center
- Email notifications (transactional)
- SMS alerts for critical events
- Push notifications (web/mobile)
- Webhook integrations
- Slack/Teams/Discord bot integration
- Notification preferences per user
- Escalation rules for unresolved issues
- Digest summaries (daily/weekly)
```

### 9. Team Collaboration

```
FEATURE: Team Management
- User invitation system
- Team role assignment
- Activity audit logs
- Task assignment and tracking
- Internal messaging/chat
- Document sharing and version control
- Workflow approval chains
- Performance metrics per team member
- Access logs and security audit
```

### 10. Marketplace-Specific Tools

```
FEATURE: Amazon-Specific Tools
- A+ Content manager
- Brand Store builder
- Subscribe & Save management
- Virtual bundles creation
- Amazon Live integration
- Vine program management
- Brand Analytics dashboard
- Amazon Attribution tracking
- Product opportunities explorer

FEATURE: eBay-Specific Tools
- Store customization tools
- Markdown/sale events manager
- Volume pricing configuration
- Terapeak product research integration
- eBay authenticity guarantee tracking
- Global Shipping Program management
- Seller performance dashboard
- eBay managed payments analytics
```

---

## Non-Functional Requirements

### Performance
```
- Page load time: < 2 seconds (LCP)
- API response time: < 200ms (95th percentile)
- Real-time data sync: < 5 seconds latency
- Concurrent users: Support 10,000+ simultaneous users
- Database query optimization: < 50ms for common queries
- CDN caching for static assets
- Code splitting and lazy loading
- Image optimization (WebP, AVIF)
```

### Security
```
- OWASP Top 10 compliance
- End-to-end encryption (TLS 1.3)
- Data encryption at rest (AES-256)
- API rate limiting and throttling
- SQL injection prevention (parameterized queries)
- XSS protection (Content Security Policy)
- CSRF protection
- Input validation and sanitization
- API key rotation and management
- Secure credential storage (environment variables, vault)
- SOC 2 Type II compliance readiness
- GDPR compliance (data privacy, right to deletion)
- CCPA compliance
- HIPAA considerations (if health-related products)
- Regular security audits and penetration testing
```

### Scalability
```
- Horizontal scaling capability
- Database read replicas
- Connection pooling (PgBouncer)
- Queue-based job processing (Bull/BullMQ)
- Microservices-ready architecture
- Auto-scaling policies
- Load balancing
- Graceful degradation
- Circuit breaker pattern for external APIs
```

### Reliability
```
- 99.9% uptime SLA target
- Automated database backups (daily + point-in-time)
- Disaster recovery plan
- Health check endpoints
- Graceful error handling
- Retry mechanisms for failed operations
- Dead letter queues for failed jobs
- Monitoring and alerting (PagerDuty/OpsGenie integration)
- SLA monitoring dashboards
```

### Maintainability
```
- Comprehensive code documentation
- API documentation (OpenAPI/Swagger)
- Component storybook
- Automated testing:
  • Unit tests (80%+ coverage)
  • Integration tests
  • E2E tests (Playwright/Cypress)
  • Performance tests (k6/Artillery)
- Linting and code formatting (ESLint, Prettier)
- Git workflow (trunk-based development or GitFlow)
- Conventional commits
- Semantic versioning
```

---

## Database Schema (High-Level)

### Core Tables
```sql
-- Users & Authentication
users, user_sessions, user_roles, user_permissions
organizations, organization_members

-- Marketplace Integration
marketplace_integrations, marketplace_tokens
marketplace_sync_logs, marketplace_webhooks

-- Products
products, product_variants, product_media
product_listings (marketplace-specific)
product_categories, product_tags

-- Inventory
inventory_items, inventory_locations
inventory_transactions, inventory_adjustments
inventory_alerts, inventory_reorder_rules

-- Orders
orders, order_items, order_status_history
order_fulfillments, order_returns
order_payments, order_refunds

-- Pricing
pricing_rules, pricing_history
competitor_prices, promotional_campaigns

-- Analytics
analytics_events, analytics_reports
daily_metrics, custom_dashboards

-- Communication
notifications, notification_preferences
messages, announcements

-- Audit & Logs
audit_logs, activity_logs
system_logs, error_logs
```

---

## API Design Standards

### RESTful Endpoints Structure
```
/api/v1/auth/*          - Authentication endpoints
/api/v1/users/*         - User management
/api/v1/organizations/* - Organization management
/api/v1/products/*      - Product CRUD
/api/v1/listings/*      - Marketplace listings
/api/v1/inventory/*     - Inventory management
/api/v1/orders/*        - Order management
/api/v1/pricing/*       - Pricing rules
/api/v1/analytics/*     - Analytics data
/api/v1/reports/*       - Report generation
/api/v1/integrations/*  - Marketplace connections
/api/v1/webhooks/*      - Webhook management
/api/v1/settings/*      - System settings
```

### Response Format
```json
{
  "status": "success|error",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "hasNext": true
  },
  "errors": [],
  "requestId": "uuid"
}
```

---

## UI/UX Requirements

### Design System
```
- Design tokens (colors, typography, spacing)
- Consistent component library (shadcn/ui)
- Responsive design (mobile-first approach)
- Dark/light mode support
- Accessibility (WCAG 2.1 AA compliance)
- Internationalization (i18n) support
- Keyboard navigation
- Screen reader compatibility
```

### Key Pages
```
1. Dashboard - Business overview with KPIs
2. Products - Product catalog management
3. Listings - Marketplace listing management
4. Inventory - Stock management
5. Orders - Order processing and fulfillment
6. Analytics - Reports and insights
7. Pricing - Pricing rules and intelligence
8. Integrations - Marketplace connection management
9. Team - Team management and roles
10. Settings - System configuration
11. Billing - Subscription and payment management
12. Support - Help center and ticket system
```

---

## Deployment & DevOps

### Environment Setup
```
- Development (local + cloud)
- Staging (pre-production)
- Production (live environment)
- QA/Testing environment
```

### CI/CD Pipeline
```
1. Code commit triggers GitHub Actions
2. Linting and type checking
3. Unit and integration tests
4. Build optimization
5. Security scanning (Snyk/Dependabot)
6. Deploy to staging
7. E2E tests on staging
8. Manual approval gate
9. Deploy to production (blue/green or canary)
10. Post-deployment verification
11. Monitoring and rollback capability
```

---

## Compliance & Legal

```
- Terms of Service
- Privacy Policy (GDPR/CCPA compliant)
- Cookie consent management
- Data retention policies
- Marketplace API usage compliance
- Amazon Developer Agreement compliance
- eBay API License Agreement compliance
- Refund and cancellation policies
- Accessibility statement
- Security disclosure policy
```

---

## Success Metrics

```
- User adoption rate: 1000+ sellers in first 6 months
- Daily active users: 500+ within first quarter
- Order processing accuracy: 99.9%
- System uptime: 99.9%
- Average page load time: < 2 seconds
- Customer satisfaction score: 4.5+/5.0
- Support ticket resolution time: < 24 hours
- Data sync latency: < 30 seconds
```

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-4)
- Project setup and architecture
- Authentication system
- Basic UI framework and design system
- Database schema and migrations
- CI/CD pipeline setup

### Phase 2: Core Features (Weeks 5-10)
- Marketplace integration (Amazon SP-API)
- eBay integration API
- Product management
- Basic inventory tracking
- Order management basics

### Phase 3: Advanced Features (Weeks 11-16)
- Advanced inventory management
- Pricing engine
- Analytics dashboard
- Reporting system
- Team collaboration features

### Phase 4: Optimization (Weeks 17-20)
- Performance optimization
- Advanced analytics (AI/ML features)
- Mobile responsiveness refinement
- Accessibility audit
- Security hardening

### Phase 5: Launch (Weeks 21-24)
- Beta testing
- Bug fixes and polish
- Documentation completion
- Production deployment
- Post-launch monitoring

---

## Deliverables Checklist

```
[ ] Complete source code repository
[ ] Database migrations and seed data
[ ] API documentation (OpenAPI spec)
[ ] User documentation/help center
[ ] Admin documentation
[ ] Deployment scripts and configs
[ ] Environment variable templates
[ ] Test suites (unit, integration, E2E)
[ ] Performance test results
[ ] Security audit report
[ ] Accessibility audit report
[ ] Monitoring and alerting setup
[ ] Backup and recovery procedures
[ ] Runbook for operations team
```

---

## Notes for Implementation

1. **Start with MVP**: Focus on core marketplace integration and basic management features first
2. **Modular Architecture**: Build as independent modules for easier maintenance and scaling
3. **API-First Design**: Design APIs before UI for parallel development
4. **Security by Design**: Implement security measures from day one
5. **Documentation**: Maintain living documentation throughout development
6. **Code Reviews**: All code must pass peer review before merge
7. **Testing**: Minimum 80% code coverage required
8. **Performance**: Establish performance budgets and monitor continuously

---

*This document serves as the authoritative source for building the Amazon & eBay Service Provider Web Application. All development decisions should align with the requirements and standards outlined herein.*
