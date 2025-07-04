# Mandala Wallet PoC

A digital wallet system with geolocation, gamification, and multi-role support for entertainment venues in Cancún, Mexico.

## 🎯 Project Overview

Mandala Wallet is a Proof of Concept (PoC) digital wallet system designed to validate core functionality across two venues in Cancún with up to 100 users over a 90-day period. The system features a four-tier user hierarchy, triple balance system, QR code payments, geolocation-based rewards, and real-time analytics.

## 🏗️ Architecture

### System Components

```
[PWA Cliente/RP] — GraphQL —→ [API Gateway]
                                 │
                                 ├─ Wallet Service (NestJS, PostgreSQL)
                                 ├─ Loyalty Service (Python ML - Future)
                                 ├─ Geofence Service (Radar Webhooks)
                                 ├─ Xetux Proxy
                                 └─ Notification Service (FCM)
[Admin & Manager Web Console] —──┘
```

### Technology Stack

- **Frontend**: Next.js (web console) + PWA (mobile)
- **Backend**: NestJS microservices + GraphQL API Gateway
- **Database**: Supabase (PostgreSQL) with comprehensive audit trails
- **Authentication**: Firebase Auth with role-based access control
- **Payments**: Stripe + OxxoPay + Apple Pay + SPEI
- **Geolocation**: Radar.io for 500m geofencing
- **Notifications**: Firebase Cloud Messaging
- **Infrastructure**: Vercel (frontend) + Fly.io (backend)

## 💰 Core Features

### Multi-Role User System
- **Admin**: Global venue management and analytics
- **Venue Manager**: Local venue control and transaction monitoring
- **RP (Representative)**: Monthly balance allocation and guest management
- **Client**: Digital wallet with payment and rewards

### Triple Balance System
- **Cash**: Paid money (never expires)
- **Credit**: RP monthly allocation (expires monthly)
- **Rewards**: Earned points/cashback (expires yearly)

### Payment Methods
- Stripe credit/debit cards
- OxxoPay (Mexican convenience stores)
- Apple Pay (iOS users)
- SPEI (Mexican bank transfers)
- QR code scanning (static/dynamic)

### Geolocation & Gamification
- 500m radius geofencing around venues
- Push notifications on venue entry/exit
- Tier progression: Bronze → Silver → Gold → Black
- QR Passport with venue stamps
- Location-based promotions and rewards

## 📁 Project Structure

```
mandala-wallet/
├── apps/
│   ├── web-console/          # Next.js admin dashboard
│   ├── pwa-client/           # Progressive Web App
│   └── api-gateway/          # GraphQL API gateway
├── services/
│   ├── wallet-service/       # Balance & transaction management
│   ├── auth-service/         # Firebase Auth integration
│   ├── geofence-service/     # Location & notifications
│   ├── notification-service/ # Push notifications
│   └── xetux-proxy/          # POS integration
├── shared/
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Common utilities
│   └── config/              # Environment configuration
├── database/
│   └── schema/              # PostgreSQL schemas
├── config/                  # Configuration files
├── docker-compose.yml       # Local development
└── package.json            # Monorepo workspace
```

## 🔧 Development Setup

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15
- Redis 7

### Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository>
   cd mandala-wallet
   npm install
   ```

2. **Start Local Infrastructure**
   ```bash
   npm run docker:up
   ```

3. **Set up Database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **Start Development Services**
   ```bash
   npm run dev
   ```

### Environment Configuration

Copy `config/environment.example.ts` to `config/environment.ts` and configure:

- **Firebase**: Authentication and messaging
- **Stripe**: Payment processing
- **Radar.io**: Geofencing services
- **Xetux**: POS integration
- **Database**: PostgreSQL connection

## 🗃️ Database Schema

### Core Tables

- **users**: User accounts with multi-role support
- **user_profiles**: Extended profile information
- **wallets**: Triple balance system (cash/credit/rewards)
- **transactions**: Complete audit trail
- **venues**: Location and configuration data
- **geofences**: Venue proximity boundaries
- **rewards**: Gamification and loyalty system
- **qr_codes**: Payment and receipt QR codes

### Key Features

- **Balance Expiration**: Automatic credit/rewards expiry
- **Audit Trail**: Complete transaction history
- **Constraints**: Balance limits (100-10,000 MXN)
- **Performance**: Optimized indexes for real-time queries

## 📱 User Flows

### Client Registration & Usage
1. Web registration (email/Apple/Google)
2. Download wallet to Apple/Google Pay
3. Add payment method and recharge
4. Visit venue → receive geofence notification
5. Scan QR code to pay
6. Earn rewards and tier progression

### RP (Representative) Flow
1. Receive monthly credit allocation
2. Generate QR codes for guest invitations
3. Track conversion metrics
4. Monitor guest consumption

### Venue Manager Operations
1. View real-time venue transactions
2. Create local promotions
3. Manage physical reward inventory
4. Authorize large manual recharges

### Admin Dashboard
1. Configure global venue catalog
2. Monitor aggregated analytics
3. Manage user roles and permissions
4. Set loyalty rules and tier benefits

## 🛡️ Security & Compliance

### Mexican Financial Regulations
- Balance limits: 100-10,000 MXN
- Transaction audit trails
- User identity verification (KYC)
- Secure payment processing

### Data Protection
- Encrypted sensitive data storage
- Secure API communication
- Role-based access control
- Session management

## 📊 Business Rules

### Balance Management
- **Minimum Balance**: 100 MXN (except 0)
- **Maximum Balance**: 10,000 MXN
- **Credit Expiry**: End of month
- **Rewards Expiry**: 1 year from earning
- **Cash**: Never expires

### Geofencing
- **Radius**: 500 meters around venues
- **Accuracy**: 50-meter threshold
- **Notifications**: Welcome, promotions, reminders

### Gamification
- **Tiers**: Bronze (0), Silver (1K), Gold (5K), Black (10K) points
- **QR Passport**: Venue stamps with 1-year validity
- **Rewards**: Location-based, tier-based, time-restricted

## 🚀 Deployment

### Production Environment
- **Frontend**: Vercel deployment
- **Backend**: Fly.io microservices
- **Database**: Supabase managed PostgreSQL
- **CDN**: Global content delivery
- **Monitoring**: Error tracking and performance metrics

### Health Checks
- Service availability monitoring
- Database connection status
- External API integration status
- Real-time alerting

## 📈 Success Metrics

### Technical KPIs
- 99.9% uptime for payment processing
- <3 second payment completion time
- Support for 100 concurrent users
- Real-time transaction monitoring

### Business KPIs
- User adoption rate over 90 days
- Transaction volume and frequency
- Average wallet balance maintained
- Geofencing engagement rate
- RP conversion tracking

## 🔄 Development Status

### ✅ Completed
- [x] Monorepo structure and TypeScript configuration
- [x] Docker Compose local development environment
- [x] Complete database schema with migrations
- [x] Shared types and utilities packages
- [x] Environment configuration templates
- [x] Basic wallet service structure

### 🚧 In Progress
- [ ] Wallet service implementation
- [ ] Payment processing integration
- [ ] Geofencing and notifications
- [ ] Admin and client applications

### 📋 Pending
- [ ] Authentication service
- [ ] Frontend applications
- [ ] External service integrations
- [ ] Testing and deployment

## 🛠️ Contributing

### Development Workflow
1. Follow task list in `tasks/tasks-prd-mandala-wallet-poc.md`
2. Complete one sub-task at a time
3. Run tests before committing
4. Update documentation as needed

### Code Standards
- TypeScript strict mode
- ESLint + Prettier formatting
- Comprehensive error handling
- API documentation with Swagger

## 📞 Support

### Development Team
- **Project Lead**: System Architect
- **Backend**: NestJS/Node.js Developer
- **Frontend**: React/Next.js Developer
- **DevOps**: Infrastructure Engineer

### External Services
- **Firebase**: Authentication and messaging
- **Stripe**: Payment processing
- **Radar.io**: Geolocation services
- **Xetux**: POS system integration

---

**Last Updated**: December 2024  
**Version**: 1.0.0-poc  
**Environment**: Development 