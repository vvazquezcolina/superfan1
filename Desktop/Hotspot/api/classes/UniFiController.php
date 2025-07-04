<?php

/**
 * UniFi Controller API Integration Class
 * Handles guest authorization and network access control
 */

class UniFiController {
    private $config;
    private $cookieJar;
    private $authenticated = false;
    private $lastRequestTime = 0;
    private $requestCount = 0;
    private $sessionData = null;
    
    public function __construct($config = null) {
        // Load UniFi configuration
        if ($config === null) {
            require_once __DIR__ . '/../config/unifi.php';
            $this->config = getUniFiConfig();
        } else {
            $this->config = $config;
        }
        
        // Initialize cookie jar for session management
        $this->cookieJar = tempnam(sys_get_temp_dir(), 'unifi_cookies_');
        
        // Include error handler for logging
        if (class_exists('ErrorHandler')) {
            $this->logEnabled = true;
        }
    }
    
    /**
     * Destructor - cleanup cookie jar
     */
    public function __destruct() {
        if (file_exists($this->cookieJar)) {
            unlink($this->cookieJar);
        }
    }
    
    /**
     * Authenticate with UniFi Controller
     */
    public function authenticate() {
        try {
            // Check if already authenticated
            if ($this->authenticated && $this->sessionData) {
                return true;
            }
            
            // Handle mock mode for testing
            if ($this->config['controller']['host'] === 'mock') {
                return $this->mockAuthenticate();
            }
            
            $loginUrl = $this->buildUrl($this->config['endpoints']['login']);
            
            $credentials = [
                'username' => $this->config['controller']['username'],
                'password' => $this->config['controller']['password'],
                'remember' => false
            ];
            
            $response = $this->makeRequest('POST', $loginUrl, $credentials);
            
            if ($response && isset($response['meta']['rc']) && $response['meta']['rc'] === 'ok') {
                $this->authenticated = true;
                $this->sessionData = $response;
                $this->log("UniFi Controller authentication successful", 'INFO');
                return true;
            } else {
                $this->log("UniFi Controller authentication failed: " . json_encode($response), 'ERROR');
                return false;
            }
            
        } catch (Exception $e) {
            $this->log("UniFi authentication error: " . $e->getMessage(), 'ERROR');
            return false;
        }
    }
    
    /**
     * Logout from UniFi Controller
     */
    public function logout() {
        try {
            if (!$this->authenticated) {
                return true;
            }
            
            // Handle mock mode
            if ($this->config['controller']['host'] === 'mock') {
                $this->authenticated = false;
                return true;
            }
            
            $logoutUrl = $this->buildUrl($this->config['endpoints']['logout']);
            $response = $this->makeRequest('POST', $logoutUrl);
            
            $this->authenticated = false;
            $this->sessionData = null;
            
            // Clear cookie jar
            if (file_exists($this->cookieJar)) {
                file_put_contents($this->cookieJar, '');
            }
            
            $this->log("UniFi Controller logout successful", 'INFO');
            return true;
            
        } catch (Exception $e) {
            $this->log("UniFi logout error: " . $e->getMessage(), 'ERROR');
            return false;
        }
    }
    
    /**
     * Authorize guest access
     */
    public function authorizeGuest($macAddress, $sessionTimeout = null, $upBandwidth = null, $downBandwidth = null) {
        try {
            if (!$this->authenticate()) {
                throw new Exception('Authentication failed');
            }
            
            // Handle mock mode
            if ($this->config['controller']['host'] === 'mock') {
                return $this->mockAuthorizeGuest($macAddress);
            }
            
            // Validate MAC address
            if (!$this->isValidMacAddress($macAddress)) {
                throw new Exception('Invalid MAC address format');
            }
            
            // Set default values
            $sessionTimeout = $sessionTimeout ?: $this->config['guest']['session_timeout'];
            $upBandwidth = $upBandwidth ?: $this->config['guest']['bandwidth_up'];
            $downBandwidth = $downBandwidth ?: $this->config['guest']['bandwidth_down'];
            
            $authorizeUrl = $this->buildUrl($this->config['endpoints']['authorize_guest']);
            
            $payload = [
                'cmd' => 'authorize-guest',
                'mac' => strtolower($macAddress),
                'minutes' => (int)$sessionTimeout
            ];
            
            // Add bandwidth limits if specified
            if ($upBandwidth > 0) {
                $payload['up'] = (int)$upBandwidth;
            }
            if ($downBandwidth > 0) {
                $payload['down'] = (int)$downBandwidth;
            }
            
            $response = $this->makeRequest('POST', $authorizeUrl, $payload);
            
            if ($response && isset($response['meta']['rc']) && $response['meta']['rc'] === 'ok') {
                $this->log("Guest authorized successfully: $macAddress", 'INFO');
                return [
                    'success' => true,
                    'mac_address' => $macAddress,
                    'session_timeout' => $sessionTimeout,
                    'authorized_at' => date('Y-m-d H:i:s'),
                    'expires_at' => date('Y-m-d H:i:s', strtotime("+$sessionTimeout minutes"))
                ];
            } else {
                throw new Exception('Authorization request failed: ' . json_encode($response));
            }
            
        } catch (Exception $e) {
            $this->log("Guest authorization error for $macAddress: " . $e->getMessage(), 'ERROR');
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'mac_address' => $macAddress
            ];
        }
    }
    
    /**
     * Unauthorize guest access
     */
    public function unauthorizeGuest($macAddress) {
        try {
            if (!$this->authenticate()) {
                throw new Exception('Authentication failed');
            }
            
            // Handle mock mode
            if ($this->config['controller']['host'] === 'mock') {
                return $this->mockUnauthorizeGuest($macAddress);
            }
            
            // Validate MAC address
            if (!$this->isValidMacAddress($macAddress)) {
                throw new Exception('Invalid MAC address format');
            }
            
            $unauthorizeUrl = $this->buildUrl($this->config['endpoints']['unauthorize_guest']);
            
            $payload = [
                'cmd' => 'unauthorize-guest',
                'mac' => strtolower($macAddress)
            ];
            
            $response = $this->makeRequest('POST', $unauthorizeUrl, $payload);
            
            if ($response && isset($response['meta']['rc']) && $response['meta']['rc'] === 'ok') {
                $this->log("Guest unauthorized successfully: $macAddress", 'INFO');
                return [
                    'success' => true,
                    'mac_address' => $macAddress,
                    'unauthorized_at' => date('Y-m-d H:i:s')
                ];
            } else {
                throw new Exception('Unauthorization request failed: ' . json_encode($response));
            }
            
        } catch (Exception $e) {
            $this->log("Guest unauthorization error for $macAddress: " . $e->getMessage(), 'ERROR');
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'mac_address' => $macAddress
            ];
        }
    }
    
    /**
     * Get client information by MAC address
     */
    public function getClientInfo($macAddress) {
        try {
            if (!$this->authenticate()) {
                throw new Exception('Authentication failed');
            }
            
            // Handle mock mode
            if ($this->config['controller']['host'] === 'mock') {
                return $this->mockGetClientInfo($macAddress);
            }
            
            $clientsUrl = $this->buildUrl($this->config['endpoints']['get_clients']);
            $response = $this->makeRequest('GET', $clientsUrl);
            
            if ($response && isset($response['data'])) {
                foreach ($response['data'] as $client) {
                    if (isset($client['mac']) && strtolower($client['mac']) === strtolower($macAddress)) {
                        return [
                            'success' => true,
                            'client' => $client
                        ];
                    }
                }
                
                return [
                    'success' => false,
                    'error' => 'Client not found',
                    'mac_address' => $macAddress
                ];
            } else {
                throw new Exception('Failed to retrieve client information');
            }
            
        } catch (Exception $e) {
            $this->log("Get client info error for $macAddress: " . $e->getMessage(), 'ERROR');
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'mac_address' => $macAddress
            ];
        }
    }
    
    /**
     * Test UniFi Controller connection
     */
    public function testConnection() {
        try {
            // Handle mock mode
            if ($this->config['controller']['host'] === 'mock') {
                return [
                    'success' => true,
                    'message' => 'Mock mode - connection test passed',
                    'controller_info' => [
                        'version' => '7.0.0-mock',
                        'site' => $this->config['controller']['site']
                    ]
                ];
            }
            
            if (!$this->authenticate()) {
                return [
                    'success' => false,
                    'error' => 'Authentication failed'
                ];
            }
            
            // Get site info to test connection
            $siteUrl = $this->buildUrl($this->config['endpoints']['get_site_info']);
            $response = $this->makeRequest('GET', $siteUrl);
            
            if ($response && isset($response['meta']['rc']) && $response['meta']['rc'] === 'ok') {
                return [
                    'success' => true,
                    'message' => 'UniFi Controller connection successful',
                    'controller_info' => $response['data'][0] ?? []
                ];
            } else {
                return [
                    'success' => false,
                    'error' => 'Failed to retrieve site information'
                ];
            }
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Make HTTP request to UniFi Controller
     */
    private function makeRequest($method, $url, $data = null) {
        // Rate limiting
        if (!$this->checkRateLimit()) {
            throw new Exception('Rate limit exceeded');
        }
        
        $ch = curl_init();
        
        // Basic cURL options
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => $this->config['controller']['timeout'],
            CURLOPT_COOKIEJAR => $this->cookieJar,
            CURLOPT_COOKIEFILE => $this->cookieJar,
            CURLOPT_SSL_VERIFYPEER => $this->config['controller']['ssl_verify'],
            CURLOPT_SSL_VERIFYHOST => $this->config['controller']['ssl_verify'] ? 2 : 0,
            CURLOPT_USERAGENT => 'Hotspot-Portal-UniFi-Client/1.0',
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Accept: application/json'
            ]
        ]);
        
        // Set method and data
        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            if ($data) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            }
        } elseif ($method === 'GET') {
            curl_setopt($ch, CURLOPT_HTTPGET, true);
        }
        
        // Log request if enabled
        if ($this->config['logging']['log_requests']) {
            $this->log("UniFi API Request: $method $url" . ($data ? ' - Data: ' . json_encode($data) : ''), 'DEBUG');
        }
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        // Handle cURL errors
        if ($error) {
            throw new Exception("cURL error: $error");
        }
        
        // Handle HTTP errors
        if ($httpCode >= 400) {
            throw new Exception("HTTP error: $httpCode - Response: $response");
        }
        
        // Parse JSON response
        $decodedResponse = json_decode($response, true);
        
        // Log response if enabled
        if ($this->config['logging']['log_responses']) {
            $this->log("UniFi API Response: " . json_encode($decodedResponse), 'DEBUG');
        }
        
        return $decodedResponse;
    }
    
    /**
     * Build full URL for API endpoint
     */
    private function buildUrl($endpoint) {
        $host = $this->config['controller']['host'];
        $port = $this->config['controller']['port'];
        $site = $this->config['controller']['site'];
        
        // Replace {site} placeholder
        $endpoint = str_replace('{site}', $site, $endpoint);
        
        return "https://$host:$port$endpoint";
    }
    
    /**
     * Validate MAC address format
     */
    private function isValidMacAddress($mac) {
        return preg_match('/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/', $mac);
    }
    
    /**
     * Check API rate limiting
     */
    private function checkRateLimit() {
        $now = time();
        
        // Reset counter every minute
        if ($now - $this->lastRequestTime >= 60) {
            $this->requestCount = 0;
            $this->lastRequestTime = $now;
        }
        
        // Check rate limit
        if ($this->requestCount >= $this->config['rate_limit']['requests_per_minute']) {
            return false;
        }
        
        $this->requestCount++;
        return true;
    }
    
    /**
     * Log message if logging is enabled
     */
    private function log($message, $level = 'INFO') {
        if ($this->config['logging']['enabled'] && class_exists('ErrorHandler')) {
            ErrorHandler::logMessage($message, $level);
        }
    }
    
    /**
     * Mock authentication for testing
     */
    private function mockAuthenticate() {
        $this->authenticated = true;
        $this->sessionData = [
            'meta' => ['rc' => 'ok'],
            'data' => [['name' => 'Mock Admin']]
        ];
        $this->log("Mock UniFi authentication successful", 'INFO');
        return true;
    }
    
    /**
     * Mock guest authorization for testing
     */
    private function mockAuthorizeGuest($macAddress) {
        $this->log("Mock guest authorization: $macAddress", 'INFO');
        return [
            'success' => true,
            'mac_address' => $macAddress,
            'session_timeout' => $this->config['guest']['session_timeout'],
            'authorized_at' => date('Y-m-d H:i:s'),
            'expires_at' => date('Y-m-d H:i:s', strtotime('+' . $this->config['guest']['session_timeout'] . ' minutes'))
        ];
    }
    
    /**
     * Mock guest unauthorization for testing
     */
    private function mockUnauthorizeGuest($macAddress) {
        $this->log("Mock guest unauthorization: $macAddress", 'INFO');
        return [
            'success' => true,
            'mac_address' => $macAddress,
            'unauthorized_at' => date('Y-m-d H:i:s')
        ];
    }
    
    /**
     * Mock get client info for testing
     */
    private function mockGetClientInfo($macAddress) {
        return [
            'success' => true,
            'client' => [
                'mac' => $macAddress,
                'ip' => '192.168.1.100',
                'hostname' => 'guest-device',
                'is_guest' => true,
                'authorized' => true,
                'last_seen' => time()
            ]
        ];
    }
    
    /**
     * Get configuration
     */
    public function getConfig() {
        return $this->config;
    }
    
    /**
     * Check if authenticated
     */
    public function isAuthenticated() {
        return $this->authenticated;
    }
}

?> 