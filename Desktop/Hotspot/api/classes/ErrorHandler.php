<?php

/**
 * Error Handler Class
 * Handles errors and exceptions throughout the API
 */
class ErrorHandler {
    
    /**
     * Register error and exception handlers
     */
    public static function register() {
        // Set error reporting based on environment
        if (self::isProduction()) {
            error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_STRICT);
            ini_set('display_errors', 0);
            ini_set('log_errors', 1);
        } else {
            error_reporting(E_ALL);
            ini_set('display_errors', 1);
            ini_set('log_errors', 1);
        }
        
        // Register handlers
        set_error_handler([self::class, 'handleError']);
        set_exception_handler([self::class, 'handleException']);
        register_shutdown_function([self::class, 'handleShutdown']);
    }
    
    /**
     * Handle PHP errors
     */
    public static function handleError($errno, $errstr, $errfile, $errline) {
        // Don't handle suppressed errors
        if (!(error_reporting() & $errno)) {
            return false;
        }
        
        $error_type = self::getErrorType($errno);
        $message = "PHP {$error_type}: {$errstr} in {$errfile}:{$errline}";
        
        // Log the error
        error_log($message);
        
        // For fatal errors, send API response
        if (in_array($errno, [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR])) {
            self::sendErrorResponse($message, 500);
        }
        
        return true;
    }
    
    /**
     * Handle uncaught exceptions
     */
    public static function handleException($exception) {
        $message = "Uncaught Exception: " . $exception->getMessage();
        $details = $exception->getFile() . ':' . $exception->getLine();
        
        // Log the exception
        error_log($message . ' in ' . $details);
        error_log($exception->getTraceAsString());
        
        // Send API response
        if (self::isProduction()) {
            self::sendErrorResponse('Internal server error', 500);
        } else {
            self::sendErrorResponse($message . ' in ' . $details, 500);
        }
    }
    
    /**
     * Handle fatal errors on shutdown
     */
    public static function handleShutdown() {
        $error = error_get_last();
        
        if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
            $message = "Fatal Error: {$error['message']} in {$error['file']}:{$error['line']}";
            error_log($message);
            
            // Clean any output buffer
            if (ob_get_level()) {
                ob_clean();
            }
            
            self::sendErrorResponse('Internal server error', 500);
        }
    }
    
    /**
     * Get error type name
     */
    private static function getErrorType($errno) {
        $error_types = [
            E_ERROR => 'Error',
            E_WARNING => 'Warning',
            E_PARSE => 'Parse Error',
            E_NOTICE => 'Notice',
            E_CORE_ERROR => 'Core Error',
            E_CORE_WARNING => 'Core Warning',
            E_COMPILE_ERROR => 'Compile Error',
            E_COMPILE_WARNING => 'Compile Warning',
            E_USER_ERROR => 'User Error',
            E_USER_WARNING => 'User Warning',
            E_USER_NOTICE => 'User Notice',
            E_STRICT => 'Strict',
            E_RECOVERABLE_ERROR => 'Recoverable Error',
            E_DEPRECATED => 'Deprecated',
            E_USER_DEPRECATED => 'User Deprecated'
        ];
        
        return $error_types[$errno] ?? 'Unknown Error';
    }
    
    /**
     * Send error response
     */
    private static function sendErrorResponse($message, $code) {
        // Clean any output buffer
        if (ob_get_level()) {
            ob_clean();
        }
        
        // Set response headers
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        http_response_code($code);
        
        // Send JSON response
        echo json_encode([
            'success' => false,
            'message' => self::isProduction() ? 'Internal server error' : $message,
            'timestamp' => date('Y-m-d H:i:s')
        ], JSON_PRETTY_PRINT);
        
        exit();
    }
    
    /**
     * Check if running in production
     */
    private static function isProduction() {
        return (getenv('ENVIRONMENT') === 'production') || (!empty($_SERVER['SERVER_NAME']) && $_SERVER['SERVER_NAME'] !== 'localhost');
    }
    
    /**
     * Log custom message
     */
    public static function logMessage($message, $level = 'INFO') {
        $timestamp = date('Y-m-d H:i:s');
        $ip = Router::getClientIp();
        $log_entry = "[{$timestamp}] [{$level}] [IP: {$ip}] {$message}";
        error_log($log_entry);
    }
    
    /**
     * Log database error
     */
    public static function logDatabaseError($error, $query = null) {
        $message = "Database Error: {$error}";
        if ($query) {
            $message .= " | Query: {$query}";
        }
        self::logMessage($message, 'ERROR');
    }
    
    /**
     * Log API request
     */
    public static function logApiRequest($endpoint, $method, $data = null) {
        $user_agent = Router::getUserAgent();
        $message = "API Request: {$method} {$endpoint} | User Agent: {$user_agent}";
        if ($data) {
            $message .= " | Data: " . json_encode($data);
        }
        self::logMessage($message, 'INFO');
    }
    
    /**
     * Log security event
     */
    public static function logSecurityEvent($event, $details = null) {
        $message = "Security Event: {$event}";
        if ($details) {
            $message .= " | Details: {$details}";
        }
        self::logMessage($message, 'SECURITY');
    }
}

?> 