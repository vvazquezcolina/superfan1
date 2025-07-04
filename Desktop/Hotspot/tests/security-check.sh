#!/bin/bash

# Security Check Script for Hotspot Portal
# Quick validation of security measures

echo "🔒 Hotspot Portal Security Check"
echo "================================"

BASE_URL=${1:-"https://localhost"}
FAILED_TESTS=0
TOTAL_TESTS=0

# Function to run test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "Testing $test_name... "
    
    if eval "$test_command" | grep -q "$expected_result"; then
        echo "✅ PASS"
    else
        echo "❌ FAIL"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Test HTTPS redirect
run_test "HTTPS Redirect" "curl -s -I http://localhost" "301\|302"

# Test Security Headers
run_test "HSTS Header" "curl -s -I $BASE_URL" "Strict-Transport-Security"
run_test "XSS Protection" "curl -s -I $BASE_URL" "X-XSS-Protection"
run_test "Content Type Options" "curl -s -I $BASE_URL" "X-Content-Type-Options"
run_test "Frame Options" "curl -s -I $BASE_URL" "X-Frame-Options"

# Test API Endpoints
run_test "CSRF Token Endpoint" "curl -s $BASE_URL/api/csrf-token" "csrf_token"
run_test "Registration Rate Limit" "curl -s -X POST $BASE_URL/api/register" "error\|failed"

# Test File Access Protection
run_test "Config File Protection" "curl -s -I $BASE_URL/.env" "403\|404"
run_test "Database Config Protection" "curl -s -I $BASE_URL/api/config/database.php" "403\|404"

echo ""
echo "📊 Results: $((TOTAL_TESTS - FAILED_TESTS))/$TOTAL_TESTS tests passed"

if [ $FAILED_TESTS -eq 0 ]; then
    echo "🎉 All security tests passed!"
    exit 0
else
    echo "⚠️  $FAILED_TESTS tests failed - review security configuration"
    exit 1
fi
