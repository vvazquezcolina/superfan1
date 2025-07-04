<?php

/**
 * Security Class
 * Comprehensive input sanitization, validation, and security utilities
 */

class Security {
    
    // Constants for validation
    const EMAIL_MAX_LENGTH = 254;
    const NAME_MAX_LENGTH = 100;
    const PASSWORD_MIN_LENGTH = 8;
    const PASSWORD_MAX_LENGTH = 128;
    const TOKEN_LENGTH = 64;
    
    // XSS patterns to detect and block
    private static $xssPatterns = [
        '/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/mi',
        '/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/mi',
        '/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/mi',
        '/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/mi',
        '/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/mi',
        '/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/mi',
        '/javascript:/i',
        '/vbscript:/i',
        '/data:/i',
        '/on\w+\s*=/i'
    ];
    
    // Suspicious patterns that might indicate attack attempts
    private static $suspiciousPatterns = [
        '/union\s+select/i',
        '/drop\s+table/i',
        '/insert\s+into/i',
        '/delete\s+from/i',
        '/update\s+set/i',
        '/script\s*:/i',
        '/eval\s*\(/i',
        '/expression\s*\(/i',
        '/url\s*\(/i',
        '/import\s*\(/i'
    ];
    
    /**
     * Sanitize and validate user input
     */
    public static function sanitizeInput($input, $type = 'string', $options = []) {
        if ($input === null || $input === '') {
            return $input;
        }
        
        // Convert to string if not already
        $input = (string)$input;
        
        // Remove null bytes
        $input = str_replace("\0", '', $input);
        
        // Detect suspicious patterns
        if (self::hasSuspiciousContent($input)) {
            ErrorHandler::logMessage("Suspicious input detected: " . substr($input, 0, 100), 'WARNING');
            throw new InvalidArgumentException('Invalid input detected');
        }
        
        switch ($type) {
            case 'email':
                return self::sanitizeEmail($input);
                
            case 'name':
                return self::sanitizeName($input, $options);
                
            case 'text':
                return self::sanitizeText($input, $options);
                
            case 'html':
                return self::sanitizeHtml($input, $options);
                
            case 'url':
                return self::sanitizeUrl($input);
                
            case 'filename':
                return self::sanitizeFilename($input);
                
            case 'ip':
                return self::sanitizeIp($input);
                
            case 'integer':
                return self::sanitizeInteger($input, $options);
                
            case 'float':
                return self::sanitizeFloat($input, $options);
                
            case 'boolean':
                return self::sanitizeBoolean($input);
                
            case 'date':
                return self::sanitizeDate($input);
                
            case 'json':
                return self::sanitizeJson($input);
                
            default:
                return self::sanitizeString($input, $options);
        }
    }
    
    /**
     * Validate input data
     */
    public static function validateInput($input, $type, $options = []) {
        $result = [
            'valid' => true,
            'error' => null,
            'sanitized' => $input
        ];
        
        try {
            // First sanitize the input
            $sanitized = self::sanitizeInput($input, $type, $options);
            $result['sanitized'] = $sanitized;
            
            // Then validate based on type
            switch ($type) {
                case 'email':
                    if (!self::isValidEmail($sanitized)) {
                        $result['valid'] = false;
                        $result['error'] = 'Invalid email format';
                    }
                    break;
                    
                case 'name':
                    if (!self::isValidName($sanitized, $options)) {
                        $result['valid'] = false;
                        $result['error'] = 'Invalid name format';
                    }
                    break;
                    
                case 'password':
                    $validation = self::validatePassword($input); // Don't sanitize passwords
                    $result['valid'] = $validation['valid'];
                    $result['error'] = $validation['error'];
                    $result['sanitized'] = $input; // Keep original
                    break;
                    
                case 'url':
                    if (!self::isValidUrl($sanitized)) {
                        $result['valid'] = false;
                        $result['error'] = 'Invalid URL format';
                    }
                    break;
                    
                case 'ip':
                    if (!self::isValidIp($sanitized)) {
                        $result['valid'] = false;
                        $result['error'] = 'Invalid IP address';
                    }
                    break;
                    
                case 'integer':
                    if (!self::isValidInteger($sanitized, $options)) {
                        $result['valid'] = false;
                        $result['error'] = 'Invalid integer value';
                    }
                    break;
                    
                case 'float':
                    if (!self::isValidFloat($sanitized, $options)) {
                        $result['valid'] = false;
                        $result['error'] = 'Invalid decimal value';
                    }
                    break;
                    
                case 'date':
                    if (!self::isValidDate($sanitized)) {
                        $result['valid'] = false;
                        $result['error'] = 'Invalid date format';
                    }
                    break;
                    
                case 'json':
                    if (!self::isValidJson($sanitized)) {
                        $result['valid'] = false;
                        $result['error'] = 'Invalid JSON format';
                    }
                    break;
            }
            
        } catch (Exception $e) {
            $result['valid'] = false;
            $result['error'] = 'Invalid input: ' . $e->getMessage();
        }
        
        return $result;
    }
    
    /**
     * Sanitize email input
     */
    private static function sanitizeEmail($email) {
        $email = trim($email);
        $email = strtolower($email);
        $email = filter_var($email, FILTER_SANITIZE_EMAIL);
        
        if (strlen($email) > self::EMAIL_MAX_LENGTH) {
            throw new InvalidArgumentException('Email too long');
        }
        
        return $email;
    }
    
    /**
     * Sanitize name input
     */
    private static function sanitizeName($name, $options = []) {
        $name = trim($name);
        
        // Remove HTML tags
        $name = strip_tags($name);
        
        // Remove extra whitespace
        $name = preg_replace('/\s+/', ' ', $name);
        
        // Remove non-letter characters except spaces, hyphens, and apostrophes
        $name = preg_replace('/[^a-zA-Z\s\-\']/u', '', $name);
        
        if (strlen($name) > self::NAME_MAX_LENGTH) {
            throw new InvalidArgumentException('Name too long');
        }
        
        return $name;
    }
    
    /**
     * Sanitize general text input
     */
    private static function sanitizeText($text, $options = []) {
        $text = trim($text);
        
        $maxLength = $options['max_length'] ?? 1000;
        $allowHtml = $options['allow_html'] ?? false;
        
        if (!$allowHtml) {
            $text = strip_tags($text);
        }
        
        // Remove or encode potentially dangerous characters
        $text = htmlspecialchars($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        
        if (strlen($text) > $maxLength) {
            throw new InvalidArgumentException('Text too long');
        }
        
        return $text;
    }
    
    /**
     * Sanitize HTML input (for trusted content only)
     */
    private static function sanitizeHtml($html, $options = []) {
        $allowedTags = $options['allowed_tags'] ?? '<p><br><strong><em><ul><ol><li>';
        
        // Strip unwanted tags
        $html = strip_tags($html, $allowedTags);
        
        // Remove dangerous attributes
        $html = preg_replace('/\s*on\w+\s*=\s*["\'][^"\']*["\']/i', '', $html);
        $html = preg_replace('/\s*style\s*=\s*["\'][^"\']*["\']/i', '', $html);
        
        return $html;
    }
    
    /**
     * Sanitize URL input
     */
    private static function sanitizeUrl($url) {
        $url = trim($url);
        $url = filter_var($url, FILTER_SANITIZE_URL);
        
        return $url;
    }
    
    /**
     * Sanitize filename
     */
    private static function sanitizeFilename($filename) {
        $filename = trim($filename);
        
        // Remove path traversal attempts
        $filename = basename($filename);
        
        // Remove dangerous characters
        $filename = preg_replace('/[^a-zA-Z0-9\-_\.]/', '', $filename);
        
        // Prevent hidden files
        if (substr($filename, 0, 1) === '.') {
            $filename = substr($filename, 1);
        }
        
        return $filename;
    }
    
    /**
     * Sanitize IP address
     */
    private static function sanitizeIp($ip) {
        $ip = trim($ip);
        
        // Handle X-Forwarded-For header format
        if (strpos($ip, ',') !== false) {
            $ip = trim(explode(',', $ip)[0]);
        }
        
        return $ip;
    }
    
    /**
     * Sanitize integer input
     */
    private static function sanitizeInteger($input, $options = []) {
        $value = filter_var($input, FILTER_SANITIZE_NUMBER_INT);
        $value = (int)$value;
        
        $min = $options['min'] ?? PHP_INT_MIN;
        $max = $options['max'] ?? PHP_INT_MAX;
        
        if ($value < $min || $value > $max) {
            throw new InvalidArgumentException('Integer out of range');
        }
        
        return $value;
    }
    
    /**
     * Sanitize float input
     */
    private static function sanitizeFloat($input, $options = []) {
        $value = filter_var($input, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
        $value = (float)$value;
        
        $min = $options['min'] ?? -PHP_FLOAT_MAX;
        $max = $options['max'] ?? PHP_FLOAT_MAX;
        
        if ($value < $min || $value > $max) {
            throw new InvalidArgumentException('Float out of range');
        }
        
        return $value;
    }
    
    /**
     * Sanitize boolean input
     */
    private static function sanitizeBoolean($input) {
        return filter_var($input, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) !== null;
    }
    
    /**
     * Sanitize date input
     */
    private static function sanitizeDate($date) {
        $date = trim($date);
        
        // Try to parse and reformat to ensure consistency
        $timestamp = strtotime($date);
        if ($timestamp === false) {
            throw new InvalidArgumentException('Invalid date format');
        }
        
        return date('Y-m-d', $timestamp);
    }
    
    /**
     * Sanitize JSON input
     */
    private static function sanitizeJson($json) {
        $json = trim($json);
        
        // Validate JSON structure
        $decoded = json_decode($json, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new InvalidArgumentException('Invalid JSON format');
        }
        
        return $json;
    }
    
    /**
     * Sanitize string input
     */
    private static function sanitizeString($input, $options = []) {
        $input = trim($input);
        $maxLength = $options['max_length'] ?? 255;
        
        if (strlen($input) > $maxLength) {
            throw new InvalidArgumentException('String too long');
        }
        
        return $input;
    }
    
    /**
     * Validate email format
     */
    public static function isValidEmail($email) {
        if (empty($email) || strlen($email) > self::EMAIL_MAX_LENGTH) {
            return false;
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return false;
        }
        
        // Additional checks
        $parts = explode('@', $email);
        if (count($parts) !== 2) {
            return false;
        }
        
        // Check for valid domain
        $domain = $parts[1];
        if (!checkdnsrr($domain, 'MX') && !checkdnsrr($domain, 'A')) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Validate name format
     */
    public static function isValidName($name, $options = []) {
        if (empty($name)) {
            return false;
        }
        
        $minLength = $options['min_length'] ?? 1;
        $maxLength = $options['max_length'] ?? self::NAME_MAX_LENGTH;
        
        if (strlen($name) < $minLength || strlen($name) > $maxLength) {
            return false;
        }
        
        // Check for valid characters (letters, spaces, hyphens, apostrophes)
        if (!preg_match('/^[a-zA-Z\s\-\']+$/u', $name)) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Validate password strength
     */
    public static function validatePassword($password) {
        $result = [
            'valid' => true,
            'error' => null,
            'strength' => 0
        ];
        
        if (strlen($password) < self::PASSWORD_MIN_LENGTH) {
            $result['valid'] = false;
            $result['error'] = 'Password must be at least ' . self::PASSWORD_MIN_LENGTH . ' characters long';
            return $result;
        }
        
        if (strlen($password) > self::PASSWORD_MAX_LENGTH) {
            $result['valid'] = false;
            $result['error'] = 'Password must not exceed ' . self::PASSWORD_MAX_LENGTH . ' characters';
            return $result;
        }
        
        // Calculate strength score
        $score = 0;
        
        // Length bonus
        $score += min(25, strlen($password) * 2);
        
        // Character variety bonus
        if (preg_match('/[a-z]/', $password)) $score += 5;
        if (preg_match('/[A-Z]/', $password)) $score += 5;
        if (preg_match('/[0-9]/', $password)) $score += 5;
        if (preg_match('/[^a-zA-Z0-9]/', $password)) $score += 10;
        
        // Repetition penalty
        if (preg_match('/(.)\1{2,}/', $password)) $score -= 10;
        
        // Common patterns penalty
        if (preg_match('/123|abc|qwe|asd/i', $password)) $score -= 10;
        
        $result['strength'] = max(0, min(100, $score));
        
        return $result;
    }
    
    /**
     * Validate URL format
     */
    public static function isValidUrl($url) {
        if (empty($url)) {
            return false;
        }
        
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            return false;
        }
        
        // Only allow HTTP and HTTPS protocols
        $parsed = parse_url($url);
        if (!in_array($parsed['scheme'] ?? '', ['http', 'https'])) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Validate IP address
     */
    public static function isValidIp($ip) {
        if (empty($ip)) {
            return false;
        }
        
        return filter_var($ip, FILTER_VALIDATE_IP) !== false;
    }
    
    /**
     * Validate integer
     */
    public static function isValidInteger($value, $options = []) {
        if (!is_numeric($value)) {
            return false;
        }
        
        $intValue = (int)$value;
        if ((string)$intValue !== (string)$value) {
            return false;
        }
        
        $min = $options['min'] ?? PHP_INT_MIN;
        $max = $options['max'] ?? PHP_INT_MAX;
        
        return $intValue >= $min && $intValue <= $max;
    }
    
    /**
     * Validate float
     */
    public static function isValidFloat($value, $options = []) {
        if (!is_numeric($value)) {
            return false;
        }
        
        $floatValue = (float)$value;
        
        $min = $options['min'] ?? -PHP_FLOAT_MAX;
        $max = $options['max'] ?? PHP_FLOAT_MAX;
        
        return $floatValue >= $min && $floatValue <= $max;
    }
    
    /**
     * Validate date format
     */
    public static function isValidDate($date) {
        if (empty($date)) {
            return false;
        }
        
        $timestamp = strtotime($date);
        return $timestamp !== false;
    }
    
    /**
     * Validate JSON format
     */
    public static function isValidJson($json) {
        if (empty($json)) {
            return false;
        }
        
        json_decode($json);
        return json_last_error() === JSON_ERROR_NONE;
    }
    
    /**
     * Check for suspicious content
     */
    public static function hasSuspiciousContent($input) {
        foreach (self::$xssPatterns as $pattern) {
            if (preg_match($pattern, $input)) {
                return true;
            }
        }
        
        foreach (self::$suspiciousPatterns as $pattern) {
            if (preg_match($pattern, $input)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Generate secure token
     */
    public static function generateSecureToken($length = self::TOKEN_LENGTH) {
        return bin2hex(random_bytes($length / 2));
    }
    
    /**
     * Generate CSRF token
     */
    public static function generateCsrfToken() {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }
        
        $token = self::generateSecureToken(32);
        $_SESSION['csrf_token'] = $token;
        $_SESSION['csrf_token_time'] = time();
        
        return $token;
    }
    
    /**
     * Validate CSRF token
     */
    public static function validateCsrfToken($token) {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }
        
        if (!isset($_SESSION['csrf_token']) || !isset($_SESSION['csrf_token_time'])) {
            return false;
        }
        
        // Check token age (expire after 1 hour)
        if (time() - $_SESSION['csrf_token_time'] > 3600) {
            unset($_SESSION['csrf_token']);
            unset($_SESSION['csrf_token_time']);
            return false;
        }
        
        return hash_equals($_SESSION['csrf_token'], $token);
    }
    
    /**
     * Hash password securely
     */
    public static function hashPassword($password) {
        return password_hash($password, PASSWORD_ARGON2ID, [
            'memory_cost' => 65536, // 64 MB
            'time_cost' => 4,       // 4 iterations
            'threads' => 3,         // 3 threads
        ]);
    }
    
    /**
     * Verify password
     */
    public static function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }
    
    /**
     * Rate limiting check
     */
    public static function checkRateLimit($key, $maxAttempts, $timeWindow) {
        $rateLimitFile = __DIR__ . '/../temp/rate_limit_' . md5($key) . '.txt';
        
        if (!file_exists($rateLimitFile)) {
            file_put_contents($rateLimitFile, json_encode([time()]));
            return ['allowed' => true, 'remaining' => $maxAttempts - 1];
        }
        
        $attempts = json_decode(file_get_contents($rateLimitFile), true);
        $currentTime = time();
        
        // Remove old attempts outside the time window
        $attempts = array_filter($attempts, function($timestamp) use ($currentTime, $timeWindow) {
            return ($currentTime - $timestamp) < $timeWindow;
        });
        
        if (count($attempts) >= $maxAttempts) {
            return ['allowed' => false, 'remaining' => 0];
        }
        
        // Add current attempt
        $attempts[] = $currentTime;
        file_put_contents($rateLimitFile, json_encode($attempts));
        
        return ['allowed' => true, 'remaining' => $maxAttempts - count($attempts)];
    }
    
    /**
     * Clean old rate limit files
     */
    public static function cleanupRateLimitFiles($maxAge = 3600) {
        $tempDir = __DIR__ . '/../temp/';
        if (!is_dir($tempDir)) {
            return;
        }
        
        $files = glob($tempDir . 'rate_limit_*.txt');
        $cutoffTime = time() - $maxAge;
        
        foreach ($files as $file) {
            if (filemtime($file) < $cutoffTime) {
                unlink($file);
            }
        }
    }
    
    /**
     * Escape output for HTML
     */
    public static function escapeHtml($string) {
        return htmlspecialchars($string, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }
    
    /**
     * Escape output for JavaScript
     */
    public static function escapeJs($string) {
        return json_encode($string, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);
    }
    
    /**
     * Escape output for URL
     */
    public static function escapeUrl($string) {
        return urlencode($string);
    }
    
    /**
     * Get secure headers for HTTP responses
     */
    public static function getSecurityHeaders() {
        return [
            'X-Content-Type-Options' => 'nosniff',
            'X-Frame-Options' => 'DENY',
            'X-XSS-Protection' => '1; mode=block',
            'Referrer-Policy' => 'strict-origin-when-cross-origin',
            'Content-Security-Policy' => "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'",
            'Strict-Transport-Security' => 'max-age=31536000; includeSubDomains',
            'Permissions-Policy' => 'geolocation=(), microphone=(), camera=()'
        ];
    }
    
    /**
     * Apply security headers to response
     */
    public static function applySecurityHeaders() {
        foreach (self::getSecurityHeaders() as $header => $value) {
            header("$header: $value");
        }
    }
    
    /**
     * Check if HTTPS is enforced
     */
    public static function isHttpsEnforced() {
        return isset($_SERVER['HTTPS']) && 
               $_SERVER['HTTPS'] !== 'off' && 
               $_SERVER['SERVER_PORT'] == 443;
    }
    
    /**
     * Enforce HTTPS redirect
     */
    public static function enforceHttps() {
        if (!self::isHttpsEnforced()) {
            $httpsUrl = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
            header("Location: $httpsUrl", true, 301);
            exit();
        }
    }
    
    /**
     * Set secure cookie parameters
     */
    public static function setSecureCookieParams() {
        ini_set('session.cookie_secure', '1');
        ini_set('session.cookie_httponly', '1');
        ini_set('session.cookie_samesite', 'Strict');
        ini_set('session.use_strict_mode', '1');
        ini_set('session.use_only_cookies', '1');
    }
    
    /**
     * Validate SSL/TLS configuration
     */
    public static function validateSslConfig() {
        $result = [
            'https_enforced' => self::isHttpsEnforced(),
            'secure_cookies' => ini_get('session.cookie_secure') === '1',
            'httponly_cookies' => ini_get('session.cookie_httponly') === '1',
            'hsts_header' => false,
            'csp_header' => false
        ];
        
        // Check for security headers in current response
        $headers = headers_list();
        foreach ($headers as $header) {
            if (stripos($header, 'Strict-Transport-Security') !== false) {
                $result['hsts_header'] = true;
            }
            if (stripos($header, 'Content-Security-Policy') !== false) {
                $result['csp_header'] = true;
            }
        }
        
        $result['ssl_score'] = array_sum($result);
        $result['recommendation'] = $result['ssl_score'] >= 4 ? 'Good' : 'Needs Improvement';
        
        return $result;
    }
}

?> 