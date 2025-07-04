<?php

/**
 * API Router Class
 * Handles routing for different API endpoints
 */
class Router {
    private $routes = [];
    private $basePath = '';
    
    public function __construct($basePath = '') {
        $this->basePath = rtrim($basePath, '/');
    }
    
    /**
     * Add a GET route
     */
    public function get($path, $handler) {
        $this->addRoute('GET', $path, $handler);
    }
    
    /**
     * Add a POST route
     */
    public function post($path, $handler) {
        $this->addRoute('POST', $path, $handler);
    }
    
    /**
     * Add a PUT route
     */
    public function put($path, $handler) {
        $this->addRoute('PUT', $path, $handler);
    }
    
    /**
     * Add a DELETE route
     */
    public function delete($path, $handler) {
        $this->addRoute('DELETE', $path, $handler);
    }
    
    /**
     * Add a route for any method
     */
    public function any($path, $handler) {
        $this->addRoute('*', $path, $handler);
    }
    
    /**
     * Add a route
     */
    private function addRoute($method, $path, $handler) {
        $path = $this->basePath . '/' . ltrim($path, '/');
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler,
            'pattern' => $this->createPattern($path)
        ];
    }
    
    /**
     * Create regex pattern from route path
     */
    private function createPattern($path) {
        // Convert route parameters like {id} to regex patterns
        $pattern = preg_replace('/\{([^}]+)\}/', '([^/]+)', $path);
        $pattern = str_replace('/', '\/', $pattern);
        return '/^' . $pattern . '$/';
    }
    
    /**
     * Dispatch the request
     */
    public function dispatch() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        // Remove query string and normalize path
        $path = rtrim($path, '/');
        if (empty($path)) {
            $path = '/';
        }
        
        // Find matching route
        foreach ($this->routes as $route) {
            if ($route['method'] !== '*' && $route['method'] !== $method) {
                continue;
            }
            
            if (preg_match($route['pattern'], $path, $matches)) {
                // Remove the full match from parameters
                array_shift($matches);
                
                // Call the handler
                return $this->callHandler($route['handler'], $matches);
            }
        }
        
        // No route found
        ApiResponse::notFound('API endpoint not found');
    }
    
    /**
     * Call the route handler
     */
    private function callHandler($handler, $params = []) {
        try {
            if (is_string($handler)) {
                // Handler is a file path
                if (file_exists($handler)) {
                    include $handler;
                } else {
                    throw new Exception("Handler file not found: {$handler}");
                }
            } elseif (is_callable($handler)) {
                // Handler is a function
                call_user_func_array($handler, $params);
            } elseif (is_array($handler) && count($handler) === 2) {
                // Handler is [class, method]
                list($class, $method) = $handler;
                if (class_exists($class) && method_exists($class, $method)) {
                    $instance = new $class();
                    call_user_func_array([$instance, $method], $params);
                } else {
                    throw new Exception("Handler class or method not found: {$class}::{$method}");
                }
            } else {
                throw new Exception("Invalid handler type");
            }
        } catch (Exception $e) {
            error_log("Route handler error: " . $e->getMessage());
            ApiResponse::serverError('Internal server error');
        }
    }
    
    /**
     * Get request data based on content type
     */
    public static function getRequestData() {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        
        if (strpos($contentType, 'application/json') !== false) {
            // JSON data
            $json = file_get_contents('php://input');
            return json_decode($json, true);
        } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Form data
            return $_POST;
        } else {
            // GET parameters
            return $_GET;
        }
    }
    
    /**
     * Get uploaded files
     */
    public static function getUploadedFiles() {
        return $_FILES;
    }
    
    /**
     * Get request headers
     */
    public static function getHeaders() {
        return getallheaders() ?: [];
    }
    
    /**
     * Get client IP address
     */
    public static function getClientIp() {
        $ip_keys = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
        
        foreach ($ip_keys as $key) {
            if (isset($_SERVER[$key]) && !empty($_SERVER[$key])) {
                $ip = $_SERVER[$key];
                // Handle comma-separated IPs
                if (strpos($ip, ',') !== false) {
                    $ip = trim(explode(',', $ip)[0]);
                }
                return $ip;
            }
        }
        
        return 'unknown';
    }
    
    /**
     * Get user agent
     */
    public static function getUserAgent() {
        return $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    }
}

?> 