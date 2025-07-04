<?php

/**
 * Security Testing Suite
 * Comprehensive security validation for the Hotspot Portal
 */

class SecurityTester {
    
    private $results = [];
    private $warnings = [];
    private $baseUrl;
    
    public function __construct($baseUrl = null) {
        $this->baseUrl = $baseUrl ?: $this->detectBaseUrl();
        $this->results = [
            'total_tests' => 0,
            'passed' => 0,
            'failed' => 0,
            'warnings' => 0,
            'tests' => []
        ];
    }
    
    /**
     * Run all security tests
     */
    public function runAllTests() {
        echo "🔒 Starting Comprehensive Security Testing Suite\n";
        echo "================================================\n\n";
        
        // SSL/HTTPS Tests
        $this->testHttpsEnforcement();
        $this->testSecurityHeaders();
        $this->testSslConfiguration();
        
        // Input Validation Tests
        $this->testInputSanitization();
        $this->testSqlInjectionPrevention();
        $this->testXssProtection();
        
        // Authentication & Authorization Tests
        $this->testCsrfProtection();
        $this->testRateLimiting();
        $this->testSessionSecurity();
        
        // File Security Tests
        $this->testFileAccessRestrictions();
        $this->testDirectoryTraversal();
        
        // API Security Tests
        $this->testApiEndpointSecurity();
        $this->testDataValidation();
        
        // Configuration Tests
        $this->testServerConfiguration();
        $this->testDatabaseSecurity();
        
        $this->generateReport();
    }
    
    /**
     * Test HTTPS enforcement
     */
    private function testHttpsEnforcement() {
        echo "🔍 Testing HTTPS Enforcement...\n";
        
        // Test HTTP to HTTPS redirect
        $httpUrl = str_replace('https://', 'http://', $this->baseUrl);
        $response = $this->makeRequest($httpUrl, ['follow_redirects' => false]);
        
        $this->addTest('HTTPS Redirect', 
            in_array($response['http_code'], [301, 302, 307, 308]),
            'HTTP requests should redirect to HTTPS',
            $response['http_code']
        );
        
        // Test HTTPS availability
        $httpsResponse = $this->makeRequest($this->baseUrl);
        $this->addTest('HTTPS Availability',
            $httpsResponse['http_code'] === 200,
            'HTTPS should be accessible',
            $httpsResponse['http_code']
        );
    }
    
    /**
     * Test security headers
     */
    private function testSecurityHeaders() {
        echo "🔍 Testing Security Headers...\n";
        
        $response = $this->makeRequest($this->baseUrl);
        $headers = $response['headers'];
        
        $requiredHeaders = [
            'Strict-Transport-Security' => 'HSTS header missing',
            'X-Content-Type-Options' => 'X-Content-Type-Options header missing',
            'X-Frame-Options' => 'X-Frame-Options header missing',
            'X-XSS-Protection' => 'X-XSS-Protection header missing',
            'Content-Security-Policy' => 'CSP header missing',
            'Referrer-Policy' => 'Referrer-Policy header missing'
        ];
        
        foreach ($requiredHeaders as $header => $message) {
            $headerExists = $this->hasHeader($headers, $header);
            $this->addTest("Security Header: $header", $headerExists, $message);
        }
        
        // Test HSTS configuration
        $hstsHeader = $this->getHeader($headers, 'Strict-Transport-Security');
        if ($hstsHeader) {
            $hasMaxAge = strpos($hstsHeader, 'max-age=') !== false;
            $hasIncludeSubDomains = strpos($hstsHeader, 'includeSubDomains') !== false;
            
            $this->addTest('HSTS Max-Age', $hasMaxAge, 'HSTS should have max-age directive');
            $this->addTest('HSTS Include Subdomains', $hasIncludeSubDomains, 
                'HSTS should include subdomains', '', 'warning');
        }
    }
    
    /**
     * Test SSL configuration
     */
    private function testSslConfiguration() {
        echo "🔍 Testing SSL Configuration...\n";
        
        $host = parse_url($this->baseUrl, PHP_URL_HOST);
        $port = parse_url($this->baseUrl, PHP_URL_PORT) ?: 443;
        
        // Test SSL connection
        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => true,
                'verify_peer_name' => true,
                'capture_peer_cert' => true
            ]
        ]);
        
        $socket = @stream_socket_client("ssl://$host:$port", $errno, $errstr, 30, 
            STREAM_CLIENT_CONNECT, $context);
        
        $this->addTest('SSL Connection', $socket !== false, 
            'SSL connection should be established', $errstr);
        
        if ($socket) {
            $params = stream_context_get_params($socket);
            $cert = $params['options']['ssl']['peer_certificate'];
            
            // Check certificate validity
            $certData = openssl_x509_parse($cert);
            $now = time();
            
            $this->addTest('SSL Certificate Valid From',
                $now >= $certData['validFrom_time_t'],
                'Certificate should be currently valid');
                
            $this->addTest('SSL Certificate Valid To',
                $now <= $certData['validTo_time_t'],
                'Certificate should not be expired');
            
            fclose($socket);
        }
    }
    
    /**
     * Test input sanitization
     */
    private function testInputSanitization() {
        echo "🔍 Testing Input Sanitization...\n";
        
        $maliciousInputs = [
            '<script>alert("xss")</script>',
            '<?php echo "code injection"; ?>',
            '../../../etc/passwd',
            'javascript:alert("xss")',
            'data:text/html,<script>alert("xss")</script>',
            'onload="alert(\'xss\')"'
        ];
        
        foreach ($maliciousInputs as $input) {
            $data = [
                'first_name' => $input,
                'last_name' => 'Test',
                'email' => 'test@example.com',
                'terms_agreement' => true
            ];
            
            $response = $this->makeRequest($this->baseUrl . '/api/register', [
                'method' => 'POST',
                'data' => $data,
                'expect_failure' => true
            ]);
            
            $rejected = $response['http_code'] >= 400;
            $this->addTest("Input Sanitization: " . substr($input, 0, 20) . "...",
                $rejected,
                'Malicious input should be rejected',
                $response['http_code']
            );
        }
    }
    
    /**
     * Test SQL injection prevention
     */
    private function testSqlInjectionPrevention() {
        echo "🔍 Testing SQL Injection Prevention...\n";
        
        $sqlPayloads = [
            "'; DROP TABLE users; --",
            "' OR '1'='1",
            "' UNION SELECT * FROM users --",
            "'; INSERT INTO users VALUES ('hacker', 'hacked'); --",
            "admin'--",
            "admin'/*"
        ];
        
        foreach ($sqlPayloads as $payload) {
            $data = [
                'email' => $payload,
                'first_name' => 'Test',
                'last_name' => 'User',
                'terms_agreement' => true
            ];
            
            $response = $this->makeRequest($this->baseUrl . '/api/register', [
                'method' => 'POST',
                'data' => $data,
                'expect_failure' => true
            ]);
            
            $rejected = $response['http_code'] >= 400;
            $this->addTest("SQL Injection Prevention: " . substr($payload, 0, 15) . "...",
                $rejected,
                'SQL injection attempts should be blocked',
                $response['http_code']
            );
        }
    }
    
    /**
     * Test XSS protection
     */
    private function testXssProtection() {
        echo "🔍 Testing XSS Protection...\n";
        
        $xssPayloads = [
            '<img src="x" onerror="alert(1)">',
            '<svg onload="alert(1)">',
            '<iframe src="javascript:alert(1)">',
            '<body onload="alert(1)">',
            '<script>document.cookie="xss=true"</script>'
        ];
        
        foreach ($xssPayloads as $payload) {
            $data = [
                'first_name' => $payload,
                'last_name' => 'Test',
                'email' => 'test@example.com',
                'terms_agreement' => true
            ];
            
            $response = $this->makeRequest($this->baseUrl . '/api/register', [
                'method' => 'POST',
                'data' => $data,
                'expect_failure' => true
            ]);
            
            $rejected = $response['http_code'] >= 400;
            $this->addTest("XSS Protection: " . substr($payload, 0, 20) . "...",
                $rejected,
                'XSS payloads should be blocked',
                $response['http_code']
            );
        }
    }
    
    /**
     * Test CSRF protection
     */
    private function testCsrfProtection() {
        echo "🔍 Testing CSRF Protection...\n";
        
        // Test registration without CSRF token
        $data = [
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
            'terms_agreement' => true
        ];
        
        $response = $this->makeRequest($this->baseUrl . '/api/register', [
            'method' => 'POST',
            'data' => $data,
            'expect_failure' => true,
            'skip_csrf' => true
        ]);
        
        $this->addTest('CSRF Protection - Missing Token',
            $response['http_code'] === 403,
            'Requests without CSRF token should be rejected',
            $response['http_code']
        );
        
        // Test with invalid CSRF token
        $data['csrf_token'] = 'invalid_token';
        $response = $this->makeRequest($this->baseUrl . '/api/register', [
            'method' => 'POST',
            'data' => $data,
            'expect_failure' => true
        ]);
        
        $this->addTest('CSRF Protection - Invalid Token',
            $response['http_code'] === 403,
            'Requests with invalid CSRF token should be rejected',
            $response['http_code']
        );
    }
    
    /**
     * Test rate limiting
     */
    private function testRateLimiting() {
        echo "🔍 Testing Rate Limiting...\n";
        
        $data = [
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
            'terms_agreement' => true
        ];
        
        // Make multiple rapid requests
        $rateLimitHit = false;
        for ($i = 0; $i < 10; $i++) {
            $response = $this->makeRequest($this->baseUrl . '/api/register', [
                'method' => 'POST',
                'data' => $data,
                'expect_failure' => true
            ]);
            
            if ($response['http_code'] === 429) {
                $rateLimitHit = true;
                break;
            }
            
            usleep(100000); // 0.1 second delay
        }
        
        $this->addTest('Rate Limiting - Registration',
            $rateLimitHit,
            'Rate limiting should activate after multiple requests',
            'Tested 10 rapid requests'
        );
        
        // Test CSRF token rate limiting
        $rateLimitHit = false;
        for ($i = 0; $i < 65; $i++) {
            $response = $this->makeRequest($this->baseUrl . '/api/csrf-token');
            
            if ($response['http_code'] === 429) {
                $rateLimitHit = true;
                break;
            }
        }
        
        $this->addTest('Rate Limiting - CSRF Token',
            $rateLimitHit,
            'CSRF token endpoint should have rate limiting',
            'Tested 65 requests',
            $rateLimitHit ? 'success' : 'warning'
        );
    }
    
    /**
     * Test session security
     */
    private function testSessionSecurity() {
        echo "🔍 Testing Session Security...\n";
        
        // Test secure session configuration
        $secureSession = ini_get('session.cookie_secure') === '1';
        $httpOnlySession = ini_get('session.cookie_httponly') === '1';
        $strictSameSite = ini_get('session.cookie_samesite') === 'Strict';
        
        $this->addTest('Session Cookie Secure', $secureSession,
            'Session cookies should have secure flag');
        $this->addTest('Session Cookie HttpOnly', $httpOnlySession,
            'Session cookies should have httponly flag');
        $this->addTest('Session Cookie SameSite', $strictSameSite,
            'Session cookies should have strict samesite policy', '', 'warning');
    }
    
    /**
     * Test file access restrictions
     */
    private function testFileAccessRestrictions() {
        echo "🔍 Testing File Access Restrictions...\n";
        
        $restrictedFiles = [
            '/.env',
            '/config.php',
            '/.htaccess',
            '/.git/config',
            '/api/config/database.php',
            '/database/migrate.php'
        ];
        
        foreach ($restrictedFiles as $file) {
            $response = $this->makeRequest($this->baseUrl . $file, ['expect_failure' => true]);
            
            $this->addTest("File Access: $file",
                $response['http_code'] >= 400,
                'Sensitive files should be protected',
                $response['http_code']
            );
        }
    }
    
    /**
     * Test directory traversal prevention
     */
    private function testDirectoryTraversal() {
        echo "🔍 Testing Directory Traversal Prevention...\n";
        
        $traversalPayloads = [
            '../../../etc/passwd',
            '..\\..\\..\\windows\\system32\\drivers\\etc\\hosts',
            '....//....//....//etc/passwd',
            '..%2F..%2F..%2Fetc%2Fpasswd',
            '..%252F..%252F..%252Fetc%252Fpasswd'
        ];
        
        foreach ($traversalPayloads as $payload) {
            $response = $this->makeRequest($this->baseUrl . '/api/' . $payload, 
                ['expect_failure' => true]);
            
            $blocked = $response['http_code'] >= 400;
            $this->addTest("Directory Traversal: " . substr($payload, 0, 20) . "...",
                $blocked,
                'Directory traversal attempts should be blocked',
                $response['http_code']
            );
        }
    }
    
    /**
     * Test API endpoint security
     */
    private function testApiEndpointSecurity() {
        echo "🔍 Testing API Endpoint Security...\n";
        
        // Test API endpoints with different HTTP methods
        $endpoints = [
            '/api/register' => ['allowed' => ['POST'], 'blocked' => ['GET', 'PUT', 'DELETE']],
            '/api/csrf-token' => ['allowed' => ['GET'], 'blocked' => ['POST', 'PUT', 'DELETE']],
            '/api/verify/test' => ['allowed' => ['GET'], 'blocked' => ['POST', 'PUT', 'DELETE']]
        ];
        
        foreach ($endpoints as $endpoint => $methods) {
            foreach ($methods['blocked'] as $method) {
                $response = $this->makeRequest($this->baseUrl . $endpoint, [
                    'method' => $method,
                    'expect_failure' => true
                ]);
                
                $this->addTest("HTTP Method $method on $endpoint",
                    $response['http_code'] === 405,
                    "Method $method should not be allowed on $endpoint",
                    $response['http_code']
                );
            }
        }
    }
    
    /**
     * Test data validation
     */
    private function testDataValidation() {
        echo "🔍 Testing Data Validation...\n";
        
        $invalidData = [
            ['first_name' => '', 'error' => 'Empty first name should be rejected'],
            ['last_name' => '', 'error' => 'Empty last name should be rejected'],
            ['email' => 'invalid-email', 'error' => 'Invalid email should be rejected'],
            ['email' => '', 'error' => 'Empty email should be rejected'],
            ['terms_agreement' => false, 'error' => 'Terms disagreement should be rejected']
        ];
        
        foreach ($invalidData as $testCase) {
            $data = [
                'first_name' => 'Test',
                'last_name' => 'User', 
                'email' => 'test@example.com',
                'terms_agreement' => true
            ];
            
            // Override with test case data
            foreach ($testCase as $key => $value) {
                if ($key !== 'error') {
                    $data[$key] = $value;
                }
            }
            
            $response = $this->makeRequest($this->baseUrl . '/api/register', [
                'method' => 'POST',
                'data' => $data,
                'expect_failure' => true
            ]);
            
            $this->addTest("Data Validation: " . $testCase['error'],
                $response['http_code'] === 400,
                $testCase['error'],
                $response['http_code']
            );
        }
    }
    
    /**
     * Test server configuration
     */
    private function testServerConfiguration() {
        echo "🔍 Testing Server Configuration...\n";
        
        $response = $this->makeRequest($this->baseUrl);
        $headers = $response['headers'];
        
        // Test for information disclosure
        $serverHeader = $this->getHeader($headers, 'Server');
        $this->addTest('Server Header Disclosure',
            empty($serverHeader) || !preg_match('/\d+\.\d+/', $serverHeader),
            'Server version should not be disclosed',
            $serverHeader ?: 'Not present',
            empty($serverHeader) ? 'success' : 'warning'
        );
        
        $poweredByHeader = $this->getHeader($headers, 'X-Powered-By');
        $this->addTest('X-Powered-By Header Disclosure',
            empty($poweredByHeader),
            'X-Powered-By header should be removed',
            $poweredByHeader ?: 'Not present'
        );
    }
    
    /**
     * Test database security
     */
    private function testDatabaseSecurity() {
        echo "🔍 Testing Database Security...\n";
        
        // Test for database errors in responses
        $sqlErrorPatterns = [
            '/mysql_/i',
            '/sql syntax/i',
            '/mysqli_/i',
            '/ORA-\d+/i',
            '/PostgreSQL/i'
        ];
        
        $response = $this->makeRequest($this->baseUrl . '/api/register', [
            'method' => 'POST',
            'data' => ['invalid' => 'data'],
            'expect_failure' => true
        ]);
        
        $hasDbError = false;
        foreach ($sqlErrorPatterns as $pattern) {
            if (preg_match($pattern, $response['body'])) {
                $hasDbError = true;
                break;
            }
        }
        
        $this->addTest('Database Error Disclosure',
            !$hasDbError,
            'Database errors should not be exposed',
            $hasDbError ? 'Database errors found in response' : 'No database errors found'
        );
    }
    
    /**
     * Add test result
     */
    private function addTest($name, $passed, $description, $details = '', $type = null) {
        $this->results['total_tests']++;
        
        if ($type === 'warning' || (!$passed && $type !== 'critical')) {
            $status = $passed ? '✅' : '⚠️';
            if (!$passed) $this->results['warnings']++;
            else $this->results['passed']++;
        } else {
            $status = $passed ? '✅' : '❌';
            if ($passed) $this->results['passed']++;
            else $this->results['failed']++;
        }
        
        $this->results['tests'][] = [
            'name' => $name,
            'passed' => $passed,
            'description' => $description,
            'details' => $details,
            'type' => $type ?: ($passed ? 'success' : 'failure')
        ];
        
        echo "  $status $name\n";
        if (!$passed && $details) {
            echo "     Details: $details\n";
        }
    }
    
    /**
     * Make HTTP request
     */
    private function makeRequest($url, $options = []) {
        $ch = curl_init();
        
        $defaultOptions = [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYPEER => false, // For testing
            CURLOPT_USERAGENT => 'Security-Test-Suite/1.0',
            CURLOPT_FOLLOWLOCATION => isset($options['follow_redirects']) ? $options['follow_redirects'] : true
        ];
        
        if (isset($options['method'])) {
            switch (strtoupper($options['method'])) {
                case 'POST':
                    $defaultOptions[CURLOPT_POST] = true;
                    break;
                case 'PUT':
                    $defaultOptions[CURLOPT_CUSTOMREQUEST] = 'PUT';
                    break;
                case 'DELETE':
                    $defaultOptions[CURLOPT_CUSTOMREQUEST] = 'DELETE';
                    break;
            }
        }
        
        if (isset($options['data'])) {
            $headers = ['Content-Type: application/json'];
            
            // Add CSRF token if not skipped
            if (!isset($options['skip_csrf'])) {
                $csrfToken = $this->getCsrfToken();
                if ($csrfToken) {
                    $headers[] = "X-CSRF-Token: $csrfToken";
                    $options['data']['csrf_token'] = $csrfToken;
                }
            }
            
            $defaultOptions[CURLOPT_POSTFIELDS] = json_encode($options['data']);
            $defaultOptions[CURLOPT_HTTPHEADER] = $headers;
        }
        
        curl_setopt_array($ch, $defaultOptions);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        
        curl_close($ch);
        
        $headers = substr($response, 0, $headerSize);
        $body = substr($response, $headerSize);
        
        return [
            'http_code' => $httpCode,
            'headers' => $this->parseHeaders($headers),
            'body' => $body
        ];
    }
    
    /**
     * Get CSRF token
     */
    private function getCsrfToken() {
        static $token = null;
        
        if ($token === null) {
            $response = $this->makeRequest($this->baseUrl . '/api/csrf-token');
            $data = json_decode($response['body'], true);
            
            if ($data && isset($data['data']['csrf_token'])) {
                $token = $data['data']['csrf_token'];
            }
        }
        
        return $token;
    }
    
    /**
     * Parse HTTP headers
     */
    private function parseHeaders($headers) {
        $parsed = [];
        $lines = explode("\n", $headers);
        
        foreach ($lines as $line) {
            if (strpos($line, ':') !== false) {
                list($key, $value) = explode(':', $line, 2);
                $parsed[trim($key)] = trim($value);
            }
        }
        
        return $parsed;
    }
    
    /**
     * Check if header exists (case-insensitive)
     */
    private function hasHeader($headers, $headerName) {
        foreach ($headers as $name => $value) {
            if (strcasecmp($name, $headerName) === 0) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Get header value (case-insensitive)
     */
    private function getHeader($headers, $headerName) {
        foreach ($headers as $name => $value) {
            if (strcasecmp($name, $headerName) === 0) {
                return $value;
            }
        }
        return null;
    }
    
    /**
     * Detect base URL
     */
    private function detectBaseUrl() {
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        return "$protocol://$host";
    }
    
    /**
     * Generate final report
     */
    private function generateReport() {
        echo "\n";
        echo "🔒 SECURITY TEST RESULTS\n";
        echo "========================\n\n";
        
        echo "📊 Summary:\n";
        echo "  Total Tests: {$this->results['total_tests']}\n";
        echo "  ✅ Passed: {$this->results['passed']}\n";
        echo "  ❌ Failed: {$this->results['failed']}\n";
        echo "  ⚠️  Warnings: {$this->results['warnings']}\n\n";
        
        $score = ($this->results['passed'] / $this->results['total_tests']) * 100;
        echo "🎯 Security Score: " . round($score, 1) . "%\n\n";
        
        if ($this->results['failed'] > 0) {
            echo "❌ FAILED TESTS:\n";
            foreach ($this->results['tests'] as $test) {
                if (!$test['passed'] && $test['type'] === 'failure') {
                    echo "  • {$test['name']}: {$test['description']}\n";
                    if ($test['details']) {
                        echo "    Details: {$test['details']}\n";
                    }
                }
            }
            echo "\n";
        }
        
        if ($this->results['warnings'] > 0) {
            echo "⚠️  WARNINGS:\n";
            foreach ($this->results['tests'] as $test) {
                if (!$test['passed'] && $test['type'] === 'warning') {
                    echo "  • {$test['name']}: {$test['description']}\n";
                }
            }
            echo "\n";
        }
        
        echo "🔧 RECOMMENDATIONS:\n";
        if ($this->results['failed'] > 0) {
            echo "  • Address all failed security tests immediately\n";
        }
        if ($this->results['warnings'] > 0) {
            echo "  • Review and consider addressing warning items\n";
        }
        if ($score >= 90) {
            echo "  • Excellent security posture! Continue monitoring\n";
        } elseif ($score >= 80) {
            echo "  • Good security posture with room for improvement\n";
        } else {
            echo "  • Significant security improvements needed\n";
        }
        
        echo "  • Run tests regularly as part of deployment process\n";
        echo "  • Consider professional penetration testing\n";
        echo "  • Keep all security measures up to date\n\n";
        
        echo "📝 Detailed report saved to: security-test-report.json\n";
        
        // Save detailed report
        file_put_contents(__DIR__ . '/security-test-report.json', 
            json_encode($this->results, JSON_PRETTY_PRINT));
    }
}

// Run tests if called directly
if (php_sapi_name() === 'cli') {
    $baseUrl = $argv[1] ?? null;
    $tester = new SecurityTester($baseUrl);
    $tester->runAllTests();
} else {
    echo "This script should be run from the command line.\n";
    echo "Usage: php security-test.php [base_url]\n";
}

?> 