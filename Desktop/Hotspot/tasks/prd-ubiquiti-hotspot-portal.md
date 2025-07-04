# Product Requirements Document: Ubiquiti Hotspot Portal

## Introduction/Overview

This document outlines the requirements for developing a custom captive portal for Ubiquiti WiFi infrastructure that collects guest user data before granting network access. The portal will serve business guests/customers, requiring them to provide basic contact information (name, surname, email) and verify their email address before accessing the WiFi network.

The portal will feature a black background with white text and a header logo placeholder, integrating with UniFi API for seamless network access management while storing collected data on a Bluehost web server.

## Goals

1. **Data Collection**: Capture guest contact information (name, surname, email) for business marketing and analytics
2. **Network Security**: Ensure only verified users access the business WiFi network
3. **User Experience**: Provide a smooth, professional WiFi onboarding process
4. **Brand Consistency**: Display business branding through header logo placement
5. **Data Management**: Store and export collected user data for business intelligence

## User Stories

1. **As a business guest**, I want to easily connect to WiFi by providing my basic contact information so that I can access the internet quickly.

2. **As a business guest**, I want to verify my email address so that I can complete the WiFi access process securely.

3. **As a business owner**, I want to collect guest contact information so that I can build a customer database and send marketing communications.

4. **As a business owner**, I want to see my company logo on the portal so that guests recognize my brand during the WiFi connection process.

5. **As a network administrator**, I want to integrate this portal with my UniFi controller so that authenticated users automatically gain network access.

## Functional Requirements

1. **Portal Interface**
   - Black background with white text for readability
   - Header section with logo placeholder (business branding)
   - Responsive design for mobile and desktop devices
   - Clean, professional layout

2. **User Registration Form**
   - Name field (required, text input)
   - Surname field (required, text input)
   - Email field (required, email validation)
   - Submit button with loading state
   - Form validation with error messages

3. **Email Verification System**
   - Send verification email upon form submission
   - Verification link with unique token
   - Email verification confirmation page
   - Resend verification option

4. **UniFi API Integration**
   - Authorize user access upon email verification
   - Integration with UniFi Controller admin panel
   - Support for UniFi Cloud Key or Dream Machine
   - Session management for authenticated users

5. **Data Storage**
   - Store user data on Bluehost web server
   - Database schema for user information
   - Timestamp tracking for registration and verification
   - Data export functionality for analytics

6. **Security Features**
   - Input sanitization and validation
   - CSRF protection
   - Rate limiting for form submissions
   - Secure token generation for email verification

## Non-Goals (Out of Scope)

1. **Advanced Analytics Dashboard** - Basic data export will suffice initially
2. **Multi-language Support** - English only for initial version
3. **Social Media Login** - Email verification only
4. **SMS Verification** - Email verification sufficient
5. **Custom Email Templates** - Basic HTML email templates
6. **User Profile Management** - One-time registration only
7. **Payment Integration** - Free WiFi access only

## Design Considerations

1. **Visual Design**
   - Black background (#000000 or similar dark theme)
   - White text (#FFFFFF) for high contrast
   - Header logo area (placeholder initially)
   - Minimalist, professional appearance

2. **User Experience**
   - Single-page application flow
   - Clear progress indicators
   - Mobile-first responsive design
   - Loading states and feedback messages

3. **Branding**
   - Header logo placement for business identification
   - Consistent color scheme throughout
   - Professional typography

## Technical Considerations

1. **Backend Technology**
   - PHP/MySQL stack compatible with Bluehost
   - RESTful API endpoints for data handling
   - Email sending capability (PHP mail or SMTP)

2. **Frontend Technology**
   - HTML5, CSS3, JavaScript
   - Responsive CSS framework (Bootstrap or similar)
   - Form validation and AJAX submissions

3. **UniFi Integration**
   - UniFi Controller API access
   - Guest authorization endpoints
   - Session management and timeout handling

4. **Hosting Requirements**
   - Bluehost web server compatibility
   - Database storage for user data
   - SSL certificate for secure data transmission

## Success Metrics

1. **User Adoption**: 90% of WiFi users complete the registration process
2. **Data Quality**: 95% of collected email addresses are valid and verified
3. **System Reliability**: 99% uptime for the portal service
4. **User Experience**: Average registration completion time under 3 minutes
5. **Data Collection**: Successful capture and storage of all required user fields

## Open Questions

1. **Data Retention**: How long should user data be stored before deletion?
2. **Access Duration**: How long should WiFi access last after verification?
3. **Branding Guidelines**: Specific logo dimensions and placement requirements?
4. **Email Content**: Specific messaging for verification emails?
5. **Admin Interface**: Need for admin dashboard to view collected data?
6. **Terms of Service**: Legal requirements for data collection and WiFi usage?
7. **Multiple Locations**: Will this portal be used across multiple business locations? 