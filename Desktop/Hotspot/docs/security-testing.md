# Security Testing Guide

## Overview

This document provides comprehensive security testing procedures for the Hotspot Portal system. Regular security testing ensures the system maintains its security posture and protects against emerging threats.

## Automated Security Tests

### 1. SSL/HTTPS Testing

**Test SSL Configuration:**
```bash
# Test SSL Labs rating
curl -s "https://api.ssllabs.com/api/v3/analyze?host=yourdomain.com&publish=off&startNew=on"

# Test HTTPS redirect
curl -I http://yourdomain.com

# Verify HSTS header
curl -I https://yourdomain.com | grep -i strict-transport-security

# Check certificate details
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

### 2. Security Headers Testing

**Required Headers Checklist:**
```bash
# Test all security headers
curl -I https://yourdomain.com | grep -E "(X-Content-Type-Options|X-Frame-Options|X-XSS-Protection|Strict-Transport-Security|Content-Security-Policy|Referrer-Policy)"
```

**Expected Results:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Content-Security-Policy: [policy string]`
- `Referrer-Policy: strict-origin-when-cross-origin`

### 3. Input Validation Testing

**XSS Prevention Tests:**
```bash
# Test XSS in registration form
curl -X POST https://yourdomain.com/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "<script>alert(\"xss\")</script>",
    "last_name": "Test",
    "email": "test@example.com",
    "terms_agreement": true
  }'
```

**SQL Injection Tests:**
```bash
# Test SQL injection in email field
curl -X POST https://yourdomain.com/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com'; DROP TABLE users; --",
    "terms_agreement": true
  }'
```

### 4. CSRF Protection Testing

**Test CSRF Token Requirement:**
```bash
# Request without CSRF token (should fail)
curl -X POST https://yourdomain.com/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "terms_agreement": true
  }'

# Get CSRF token first
CSRF_TOKEN=$(curl -s https://yourdomain.com/api/csrf-token | jq -r '.data.csrf_token')

# Request with valid CSRF token
curl -X POST https://yourdomain.com/api/register \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d '{
    "first_name": "Test",
    "last_name": "User", 
    "email": "test@example.com",
    "terms_agreement": true,
    "csrf_token": "'$CSRF_TOKEN'"
  }'
```

### 5. Rate Limiting Testing

**Test Registration Rate Limits:**
```bash
# Script to test rate limiting
for i in {1..10}; do
  echo "Request $i:"
  curl -w "HTTP Status: %{http_code}\n" -s -o /dev/null \
    -X POST https://yourdomain.com/api/register \
    -H "Content-Type: application/json" \
    -d '{
      "first_name": "Test'$i'",
      "last_name": "User",
      "email": "test'$i'@example.com",
      "terms_agreement": true
    }'
done
```

### 6. File Access Security Testing

**Test Protected Files:**
```bash
# Test access to sensitive files (should return 403/404)
curl -I https://yourdomain.com/.env
curl -I https://yourdomain.com/api/config/database.php
curl -I https://yourdomain.com/.htaccess
curl -I https://yourdomain.com/.git/config
curl -I https://yourdomain.com/config.php
```

**Test Directory Traversal:**
```bash
# Test path traversal attempts (should be blocked)
curl -I https://yourdomain.com/api/../../../etc/passwd
curl -I "https://yourdomain.com/api/..%2F..%2F..%2Fetc%2Fpasswd"
curl -I "https://yourdomain.com/api/....//....//....//etc/passwd"
```

## Manual Security Testing

### 1. Authentication Testing

**Session Security:**
1. Verify session cookies have `Secure` flag
2. Verify session cookies have `HttpOnly` flag
3. Verify session cookies have `SameSite=Strict`
4. Test session timeout functionality
5. Verify secure session regeneration

**CSRF Token Management:**
1. Verify tokens are unique per session
2. Test token expiration (1 hour)
3. Verify token validation on all state-changing requests
4. Test token refresh mechanism

### 2. Input Validation Testing

**Field Validation:**
1. Test empty required fields
2. Test maximum length limits
3. Test special characters in names
4. Test invalid email formats
5. Test malformed JSON payloads

**Malicious Input Tests:**
1. Script injection attempts
2. HTML injection attempts
3. Command injection attempts
4. Path traversal attempts
5. Unicode bypass attempts

### 3. API Security Testing

**HTTP Method Testing:**
- Verify only allowed methods are accepted
- Test OPTIONS method handling
- Verify proper error responses for invalid methods

**Content Type Testing:**
- Test various content types
- Verify JSON-only acceptance where appropriate
- Test malformed content type headers

### 4. Error Handling Testing

**Information Disclosure:**
1. Verify no database errors in responses
2. Check for stack traces in error responses
3. Verify generic error messages for security events
4. Test custom error pages

**Error Response Testing:**
1. Test 400 Bad Request scenarios
2. Test 401 Unauthorized scenarios
3. Test 403 Forbidden scenarios
4. Test 404 Not Found scenarios
5. Test 429 Too Many Requests scenarios
6. Test 500 Internal Server Error scenarios

## Vulnerability Assessment Tools

### 1. Automated Scanning Tools

**OWASP ZAP (Zed Attack Proxy):**
```bash
# Install OWASP ZAP
docker pull owasp/zap2docker-stable

# Run automated scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://yourdomain.com \
  -r zap-report.html
```

**Nikto Web Scanner:**
```bash
# Install Nikto
sudo apt-get install nikto

# Run Nikto scan
nikto -h https://yourdomain.com -output nikto-report.txt
```

**Nmap for Port Scanning:**
```bash
# Scan for open ports
nmap -sS -O yourdomain.com

# Scan for SSL/TLS vulnerabilities
nmap --script ssl-enum-ciphers -p 443 yourdomain.com
```

### 2. SSL/TLS Testing Tools

**SSLyze:**
```bash
# Install SSLyze
pip install sslyze

# Test SSL configuration
sslyze yourdomain.com:443 --regular
```

**testssl.sh:**
```bash
# Download testssl.sh
wget https://testssl.sh/testssl.sh

# Run comprehensive SSL test
bash testssl.sh https://yourdomain.com
```

### 3. Content Security Policy Testing

**CSP Evaluator:**
- Use Google's CSP Evaluator: https://csp-evaluator.withgoogle.com/
- Test CSP bypasses with various payloads

**Browser Developer Tools:**
- Monitor CSP violations in browser console
- Test CSP with inline scripts and styles

## Security Test Automation

### 1. Continuous Integration Tests

**GitHub Actions Security Workflow:**
```yaml
name: Security Tests
on: [push, pull_request]

jobs:
  security-tests:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Security Headers Test
      run: |
        curl -I https://staging.yourdomain.com | \
        grep -E "(X-Content-Type-Options|X-Frame-Options|Strict-Transport-Security)"
    
    - name: SSL Test
      run: |
        curl -I http://staging.yourdomain.com | grep "301\|302"
    
    - name: OWASP ZAP Scan
      uses: zaproxy/action-baseline@v0.6.1
      with:
        target: 'https://staging.yourdomain.com'
```

### 2. Regular Security Monitoring

**Daily Checks:**
- SSL certificate expiration monitoring
- Security header validation
- Basic functionality tests

**Weekly Checks:**
- Automated vulnerability scans
- Dependency security updates
- Log analysis for security events

**Monthly Checks:**
- Comprehensive penetration testing
- Security configuration review
- Incident response plan testing

## Penetration Testing

### 1. Scope Definition

**In-Scope Testing:**
- Web application security
- API endpoint security
- Input validation
- Authentication mechanisms
- Session management
- SSL/TLS configuration

**Out-of-Scope:**
- Social engineering
- Physical security
- Denial of service attacks
- Third-party services

### 2. Testing Methodology

**OWASP Testing Guide Phases:**
1. Information Gathering
2. Configuration Management Testing
3. Identity Management Testing
4. Authentication Testing
5. Authorization Testing
6. Session Management Testing
7. Input Validation Testing
8. Error Handling Testing
9. Cryptography Testing
10. Business Logic Testing

### 3. Common Vulnerability Checks

**OWASP Top 10 Testing:**
1. Injection vulnerabilities
2. Broken Authentication
3. Sensitive Data Exposure
4. XML External Entities (XXE)
5. Broken Access Control
6. Security Misconfiguration
7. Cross-Site Scripting (XSS)
8. Insecure Deserialization
9. Known Vulnerable Components
10. Insufficient Logging & Monitoring

## Security Test Reporting

### 1. Test Report Structure

**Executive Summary:**
- Overall security posture
- Critical findings summary
- Risk assessment
- Recommendations priority

**Technical Findings:**
- Vulnerability details
- Proof of concept
- Impact assessment
- Remediation steps

**Test Coverage:**
- Tests performed
- Test results summary
- Coverage gaps
- Future testing recommendations

### 2. Risk Classification

**Critical (CVSS 9.0-10.0):**
- Immediate action required
- System compromise possible
- Data breach potential

**High (CVSS 7.0-8.9):**
- Urgent attention needed
- Significant security impact
- Patch within 48 hours

**Medium (CVSS 4.0-6.9):**
- Moderate security risk
- Address within 1 week
- Monitor for exploitation

**Low (CVSS 0.1-3.9):**
- Minor security concern
- Address in next release cycle
- Document for future reference

### 3. Remediation Tracking

**Issue Management:**
- Unique vulnerability IDs
- Assignment to responsible parties
- Target resolution dates
- Progress tracking
- Verification requirements

**Re-testing Schedule:**
- Initial fix verification
- Regression testing
- Final confirmation testing
- Sign-off documentation

## Compliance and Standards

### 1. Security Standards Alignment

**OWASP Guidelines:**
- OWASP Top 10 compliance
- OWASP Testing Guide procedures
- OWASP Secure Coding Practices

**Industry Standards:**
- NIST Cybersecurity Framework
- ISO 27001 controls
- PCI DSS requirements (if applicable)

### 2. Regular Compliance Checks

**Monthly Reviews:**
- Security control effectiveness
- Policy compliance verification
- Training requirements assessment

**Quarterly Assessments:**
- Comprehensive security review
- Risk assessment updates
- Control testing validation

## Emergency Response Testing

### 1. Incident Response Drills

**Scenario Testing:**
- Simulated security incidents
- Response time measurement
- Communication effectiveness
- Recovery procedures validation

**Tabletop Exercises:**
- Cross-team coordination
- Decision-making processes
- Resource allocation
- External communication

### 2. Business Continuity Testing

**Backup and Recovery:**
- Data backup verification
- System recovery testing
- Alternative access methods
- Service continuity plans

## Documentation and Training

### 1. Security Test Documentation

**Test Procedures:**
- Step-by-step testing guides
- Expected results documentation
- Tool configuration guides
- Troubleshooting procedures

**Results Documentation:**
- Test execution logs
- Finding documentation
- Remediation tracking
- Lessons learned reports

### 2. Team Training

**Security Testing Skills:**
- Tool usage training
- Vulnerability identification
- Report writing skills
- Industry best practices

**Ongoing Education:**
- Security conference attendance
- Certification maintenance
- Threat landscape updates
- New testing techniques

---

**Last Updated:** `date('Y-m-d')`  
**Version:** 1.0  
**Next Review:** Monthly  
**Classification:** Internal Use 