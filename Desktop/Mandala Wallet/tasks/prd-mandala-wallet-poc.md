# Product Requirements Document: Mandala Wallet PoC

## Introduction/Overview

Mandala Wallet is a digital wallet system designed to revolutionize customer experience in entertainment venues through gamification, personalized rewards, and seamless payments. This Proof of Concept (PoC) will validate the core functionality in a controlled environment with two venues in Cancún, Mexico, supporting up to 100 users over a 90-day period.

The system operates with a four-tier user hierarchy (Admin → Venue Manager → RP → Client) and integrates web-based registration with downloadable mobile wallets, QR code payments, geolocation-based rewards, and real-time analytics.

## Goals

1. **Validate Core Payment Flow**: Demonstrate secure wallet recharge and QR-based payments with internal balance management
2. **Prove Multi-Role Operation**: Successfully operate 4-tier user hierarchy with appropriate permissions and workflows
3. **Demonstrate Location-Based Engagement**: Show geofencing and gamification features increase user engagement
4. **Establish Integration Foundation**: Prove seamless integration with Xetux POS for transaction processing
5. **Generate Usage Metrics**: Collect data on user adoption, transaction volume, and engagement patterns within 90 days

## User Stories

### Admin User Stories
- As an Admin, I want to configure global venue catalogs so that I can manage all locations from one interface
- As an Admin, I want to view aggregated dashboards across all venues so that I can monitor overall system performance
- As an Admin, I want to manage venue managers so that I can control access and permissions

### Venue Manager User Stories
- As a Venue Manager, I want to view real-time transactions for my venue so that I can monitor business performance
- As a Venue Manager, I want to create local offers and manage physical reward inventory so that I can customize promotions
- As a Venue Manager, I want to authorize large manual recharges so that I can handle cash-to-balance conversions

### RP (Representative) User Stories
- As an RP, I want to receive monthly balance allocation so that I can offer guest experiences
- As an RP, I want to generate QR codes for invited clients so that I can provide complimentary services
- As an RP, I want to track my conversion metrics so that I can optimize my performance

### Client User Stories
- As a Client, I want to register via web app and download my wallet so that I can start using the service
- As a Client, I want to recharge my wallet with multiple payment methods so that I can add funds conveniently
- As a Client, I want to pay via QR code scanning so that I can make quick, contactless payments
- As a Client, I want to receive location-based rewards so that I can get personalized benefits
- As a Client, I want to track my points and tier status so that I can see my progress and benefits

## Functional Requirements

### 1. Authentication & User Management
1.1. System must support web-based registration with email/Apple/Google authentication
1.2. System must implement role-based access control with custom claims (Admin, Venue Manager, RP, Client)
1.3. System must allow users to hold multiple roles simultaneously
1.4. System must integrate with Firebase Auth for social login capabilities

### 2. Wallet & Balance Management
2.1. System must enforce minimum wallet balance of 100 MXN and maximum of 10,000 MXN
2.2. System must support three types of balance: Cash (paid), Credit (monthly RP allocation), Rewards (earned)
2.3. System must implement different expiration rules: Cash (never expires), Credit (monthly), Rewards (1 year)
2.4. System must maintain detailed transaction ledger for all balance movements
2.5. System must support downloadable wallet integration with Apple Wallet and Google Pay

### 3. Payment Processing
3.1. System must support multiple recharge methods: Stripe, OxxoPay, Apple Pay, SPEI
3.2. System must process QR code payments (both static per register and dynamic per ticket)
3.3. System must implement retry mechanism for failed payments
3.4. System must support partial payments and refunds
3.5. System must integrate with Xetux POS API for transaction validation

### 4. Geolocation & Gamification
4.1. System must implement 500m radius geofencing around venues
4.2. System must send push notifications when users enter geofenced areas
4.3. System must support points system with tier progression (Bronze/Silver/Gold/Black)
4.4. System must implement "QR Passport" feature with venue stamps
4.5. System must handle location services disabled scenarios gracefully

### 5. RP Balance Management
5.1. System must automatically allocate monthly balance to RPs at month start
5.2. System must automatically expire unused RP credit at month end
5.3. System must allow RPs to generate QR codes for guest consumption
5.4. System must track RP conversion metrics and performance

### 6. Admin & Management Tools
6.1. System must provide web console for Admin and Venue Manager roles
6.2. System must display real-time transaction monitoring and analytics
6.3. System must support venue catalog management (venues, plans, loyalty levels)
6.4. System must implement approval workflows for large transactions (pending status)
6.5. System must provide embedded Metabase dashboards for advanced analytics

### 7. Mobile & Web Applications
7.1. System must provide PWA for Client and RP roles with offline capabilities
7.2. System must support push notifications via Firebase Cloud Messaging
7.3. System must implement responsive design for all interfaces
7.4. System must provide visible support button in both web app and wallet
7.5. System must support PWA installation on mobile devices

### 8. Integration & Data Management
8.1. System must integrate with Xetux POS for QR code validation and cash recovery
8.2. System must provide real-time reporting capabilities
8.3. System must maintain data consistency across all microservices
8.4. System must implement webhook handling for payment confirmations

## Non-Goals (Out of Scope)

- AI-powered personalization features (deferred to future phases)
- Advanced fraud detection mechanisms
- Multi-currency support
- Integration with existing customer databases
- Venue type or location restrictions
- Complex approval workflows for transactions
- A/B testing capabilities
- Advanced analytics beyond basic metrics

## Design Considerations

### User Interface
- Clean, intuitive design following modern mobile wallet patterns
- Consistent branding across web console and mobile PWA
- Accessibility compliance for Mexican market requirements
- Spanish language support as primary interface language

### User Experience
- Seamless registration to first transaction flow
- Quick QR code scanning and payment confirmation
- Clear balance visibility with breakdown by type (Cash/Credit/Rewards)
- Simple tier progression visualization
- Intuitive venue stamp collection interface

### Technical Architecture
- Microservices architecture for scalability
- PWA for mobile cross-platform compatibility
- Real-time data synchronization between components
- Secure payment processing with PCI compliance considerations

## Technical Considerations

### Architecture
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

### Infrastructure
- **Frontend**: Vercel deployment for web applications
- **Backend**: Fly.io for microservices hosting
- **Database**: Supabase for primary data storage
- **Authentication**: Firebase Auth with custom claims
- **Payments**: Stripe for payment processing
- **Geolocation**: Radar.io for geofencing capabilities
- **Push Notifications**: Firebase Cloud Messaging

### Security & Compliance
- Mexican financial regulation compliance
- Secure API communication with authentication tokens
- Encrypted storage of sensitive financial data
- Audit trail for all financial transactions
- Rate limiting and basic fraud prevention

### Performance Requirements
- Support for 100 concurrent users maximum
- Sub-3 second payment processing
- Real-time notification delivery
- 99.9% uptime for payment processing
- Offline capability for basic wallet functions

## Success Metrics

### Primary KPIs (To be validated with stakeholders)
- User adoption rate over 90-day period
- Transaction volume and frequency
- Average wallet balance maintained
- Geofencing engagement rate
- RP conversion tracking
- Payment success rate
- User retention after first transaction

### Technical Metrics
- System uptime and reliability
- Payment processing speed
- API response times
- Mobile app installation rates
- Push notification engagement rates

## Open Questions

### Business Logic
1. **Approval Workflows**: What specific criteria trigger manual approval for large transactions?
2. **RP Performance Metrics**: How should RP monthly allocation be calculated (fixed vs. performance-based)?
3. **Fraud Detection**: What basic fraud prevention measures should be implemented?

### Technical Implementation
4. **AI Integration**: Timeline and requirements for future AI-powered personalization features
5. **Scalability**: Plans for expanding beyond 100 users and 2 venues
6. **Data Analytics**: Specific reporting requirements beyond real-time transaction monitoring

### Integration
7. **Xetux Data Exchange**: Additional data points beyond QR code validation that should be shared
8. **Third-party Services**: Any additional integrations required for venue operations

### Compliance & Security
9. **Mexican Financial Regulations**: Specific compliance requirements for digital wallet operations
10. **Data Privacy**: GDPR/Mexican privacy law compliance requirements for user data handling

---

**Document Version**: 1.0  
**Created**: [Date]  
**Last Updated**: [Date]  
**Review Status**: Pending stakeholder approval 