# Security Configuration Guide

## Overview

This document outlines the comprehensive security measures implemented in the Hotspot Portal system, including SSL/HTTPS enforcement, security headers, and best practices for production deployment.

## SSL/HTTPS Configuration

### 1. Certificate Requirements

**Required SSL Certificate Types:**
- **Domain Validated (DV)** - Minimum requirement
- **Organization Validated (OV)** - Recommended for business use
- **Extended Validation (EV)** - Optional for enhanced trust

**Certificate Specifications:**
- RSA 2048-bit or ECC P-256 minimum
- SHA-256 signature algorithm
- Valid wildcard support for subdomains
- Let's Encrypt certificates are supported

### 2. HTTPS Enforcement

The system enforces HTTPS through multiple layers:

**Apache .htaccess Level:**
```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

**Application Level:**
- All security headers include `Strict-Transport-Security`
- Secure cookie flags are enforced
- Mixed content is prevented

**Verification Steps:**
1. Test HTTP to HTTPS redirect: `curl -I http://yourdomain.com`
2. Verify HSTS header: `curl -I https://yourdomain.com`
3. Check certificate: `openssl s_client -connect yourdomain.com:443`

## Security Headers Implementation

### 1. HTTP Strict Transport Security (HSTS)
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```
- **Purpose**: Forces HTTPS for 1 year
- **includeSubDomains**: Applies to all subdomains
- **preload**: Eligible for browser preload lists

### 2. Content Security Policy (CSP)
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; 
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; 
connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'self';
```

**Policy Breakdown:**
- `default-src 'self'`: Only allow resources from same origin
- `script-src 'self' 'unsafe-inline'`: Allow inline scripts (required for functionality)
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`: CSS from self and Google Fonts
- `form-action 'self'`: Forms can only submit to same origin
- `frame-ancestors 'none'`: Prevent clickjacking

### 3. Additional Security Headers
- **X-Content-Type-Options**: `nosniff` - Prevents MIME sniffing
- **X-Frame-Options**: `DENY` - Prevents clickjacking
- **X-XSS-Protection**: `1; mode=block` - XSS filtering
- **Referrer-Policy**: `strict-origin-when-cross-origin` - Controls referrer information

## Rate Limiting Configuration

### 1. Application-Level Limits

**Registration Endpoint:**
- 5 attempts per 5 minutes per IP
- File: `api/endpoints/register.php`

**Email Verification:**
- 10 attempts per 5 minutes per IP
- File: `api/endpoints/verify.php`

**Email Resend:**
- 5 max attempts per user
- 5-minute cooldown between attempts
- 3 requests per hour per IP
- File: `api/endpoints/resend.php`

**CSRF Token Generation:**
- 60 requests per hour per IP
- File: `api/endpoints/csrf-token.php`

**Admin Endpoints:**
- Users API: 100 requests per minute
- Statistics API: 60 requests per minute
- Export API: 5 exports per hour

### 2. Server-Level Limits

**Apache Configuration (.htaccess):**
```apache
<IfModule mod_limitipconn.c>
    MaxConnPerIP 10
</IfModule>
```

**Recommended Additional Measures:**
- Fail2ban for repeated failed attempts
- ModSecurity Web Application Firewall
- CloudFlare or similar CDN with DDoS protection

## Input Validation and Sanitization

### 1. Security Class Features

**Input Types Supported:**
- Email addresses with DNS validation
- Names with character filtering
- URLs with protocol validation
- IP addresses
- Integers, floats, booleans
- Dates and JSON data
- File names with path traversal protection

**Security Patterns Detected:**
- XSS attempts (script tags, event handlers)
- SQL injection patterns
- Command injection attempts
- Path traversal attacks

### 2. CSRF Protection

**Token Generation:**
- 32-character secure random tokens
- Session-based storage
- 1-hour expiration
- Timing attack protection with `hash_equals()`

**Validation Points:**
- All form submissions
- API state-changing requests
- Dual validation (headers + form data)

## File Security

### 1. Access Restrictions

**Protected File Types:**
```apache
<FilesMatch "\.(env|log|bak|backup|config|conf|ini|sql|sh|bat)$">
    Order Allow,Deny
    Deny from all
</FilesMatch>
```

**Protected Directories:**
- `.git/` - Version control
- `node_modules/` - Dependencies
- Configuration files
- Temporary files

### 2. Upload Security (if implemented)

**Recommended Measures:**
- File type validation
- Size limits
- Virus scanning
- Separate upload directory
- Non-executable permissions

## Database Security

### 1. Connection Security

**Required Configuration:**
- SSL/TLS encryption for database connections
- Prepared statements (implemented)
- Separate database user with minimal privileges
- Regular security updates

### 2. Data Protection

**Implemented Features:**
- Input sanitization before database operations
- Prepared statements prevent SQL injection
- Sensitive data hashing (passwords)
- Rate limiting prevents brute force

## Session Security

### 1. PHP Session Configuration

**Recommended php.ini settings:**
```ini
session.cookie_secure = 1
session.cookie_httponly = 1
session.cookie_samesite = Strict
session.use_strict_mode = 1
session.use_only_cookies = 1
```

### 2. CSRF Token Management

**Security Features:**
- Session-based token storage
- Automatic token refresh
- Expiration handling
- Secure random generation

## Monitoring and Logging

### 1. Security Events Logged

**Automatically Logged:**
- Failed login attempts
- Suspicious input patterns
- Rate limit violations
- CSRF token failures
- API request anomalies

### 2. Log Analysis

**Recommended Monitoring:**
- Failed authentication patterns
- Unusual IP activity
- Error rate spikes
- Resource consumption

## Production Deployment Checklist

### 1. SSL/HTTPS Setup
- [ ] Valid SSL certificate installed
- [ ] HTTP to HTTPS redirect working
- [ ] HSTS header active
- [ ] Mixed content issues resolved
- [ ] Certificate auto-renewal configured

### 2. Security Headers
- [ ] All security headers active
- [ ] CSP policy tested and functional
- [ ] XSS protection enabled
- [ ] Clickjacking protection active

### 3. Rate Limiting
- [ ] Application-level limits active
- [ ] Server-level limits configured
- [ ] Monitoring for abuse patterns
- [ ] Rate limit cleanup job scheduled

### 4. File Security
- [ ] Sensitive files protected
- [ ] Directory listings disabled
- [ ] File permissions set correctly
- [ ] Backup files secured

### 5. Database Security
- [ ] Database user privileges minimized
- [ ] Connection encryption enabled
- [ ] Regular security updates applied
- [ ] Backup encryption configured

## Emergency Response

### 1. Security Incident Procedures

**Immediate Actions:**
1. Identify and isolate affected systems
2. Preserve logs and evidence
3. Block malicious IP addresses
4. Notify relevant stakeholders

**Assessment Steps:**
1. Determine scope of compromise
2. Assess data exposure
3. Review access logs
4. Check for persistence mechanisms

### 2. Recovery Procedures

**System Recovery:**
1. Patch vulnerabilities
2. Update security configurations
3. Reset compromised credentials
4. Restore from clean backups if needed

**Preventive Measures:**
1. Review and update security policies
2. Enhance monitoring
3. Conduct security assessment
4. Update incident response plan

## Security Testing

### 1. Regular Testing Schedule

**Monthly:**
- Vulnerability scans
- SSL certificate checks
- Security header validation
- Rate limiting tests

**Quarterly:**
- Penetration testing
- Code security review
- Configuration audit
- Incident response drill

### 2. Testing Tools

**Recommended Tools:**
- SSL Labs SSL Test
- OWASP ZAP for web application testing
- Nmap for network scanning
- SQLMap for SQL injection testing

## Compliance Considerations

### 1. Data Protection

**GDPR Compliance:**
- User consent mechanisms
- Data retention policies
- Right to deletion
- Data export functionality

**Privacy Features:**
- Minimal data collection
- Purpose limitation
- Data anonymization options
- Secure data transmission

### 2. Security Standards

**Alignment with:**
- OWASP Top 10
- NIST Cybersecurity Framework
- ISO 27001 guidelines
- PCI DSS (if applicable)

## Updates and Maintenance

### 1. Security Update Schedule

**Weekly:**
- Security patch review
- Log analysis
- Performance monitoring

**Monthly:**
- Dependency updates
- Security configuration review
- Certificate expiration check

### 2. Version Control

**Security-Related Changes:**
- All security configurations in version control
- Change approval process
- Rollback procedures
- Security impact assessment

---

**Last Updated:** `date('Y-m-d')`  
**Version:** 1.0  
**Classification:** Internal Use 