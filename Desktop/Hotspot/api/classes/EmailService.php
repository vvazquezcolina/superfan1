<?php

/**
 * Email Service Class
 * Handles email sending functionality for verification and notifications
 */

class EmailService {
    private $config;
    private $smtpSocket;
    private $connected = false;
    
    public function __construct($config = null) {
        // Load email configuration
        if ($config === null) {
            require_once __DIR__ . '/../config/email.php';
            $this->config = getEmailConfig();
        } else {
            $this->config = $config;
        }
    }
    
    /**
     * Send verification email
     */
    public function sendVerificationEmail($email, $firstName, $verificationToken) {
        try {
            $verificationUrl = $this->buildVerificationUrl($verificationToken);
            
            $subject = 'Verify Your Email - WiFi Access';
            $htmlBody = $this->getVerificationEmailTemplate($firstName, $verificationUrl);
            $textBody = $this->getVerificationEmailText($firstName, $verificationUrl);
            
            return $this->sendEmail($email, $firstName, $subject, $htmlBody, $textBody);
            
        } catch (Exception $e) {
            ErrorHandler::logMessage("Failed to send verification email to $email: " . $e->getMessage(), 'ERROR');
            return false;
        }
    }
    
    /**
     * Send welcome email after verification
     */
    public function sendWelcomeEmail($email, $firstName) {
        try {
            $subject = 'Welcome to Our WiFi Network!';
            $htmlBody = $this->getWelcomeEmailTemplate($firstName);
            $textBody = $this->getWelcomeEmailText($firstName);
            
            return $this->sendEmail($email, $firstName, $subject, $htmlBody, $textBody);
            
        } catch (Exception $e) {
            ErrorHandler::logMessage("Failed to send welcome email to $email: " . $e->getMessage(), 'ERROR');
            return false;
        }
    }
    
    /**
     * Send email using SMTP
     */
    private function sendEmail($toEmail, $toName, $subject, $htmlBody, $textBody = null) {
        try {
            // For development/testing, use PHP mail() function
            // In production, this would use proper SMTP
            if ($this->config['use_php_mail'] ?? false) {
                return $this->sendViaPhpMail($toEmail, $toName, $subject, $htmlBody, $textBody);
            }
            
            // Connect to SMTP server
            if (!$this->connectToSMTP()) {
                throw new Exception('Failed to connect to SMTP server');
            }
            
            // Authenticate
            if (!$this->authenticateSMTP()) {
                throw new Exception('SMTP authentication failed');
            }
            
            // Send email via SMTP
            $result = $this->sendViaSMTP($toEmail, $toName, $subject, $htmlBody, $textBody);
            
            // Disconnect
            $this->disconnectSMTP();
            
            if ($result) {
                ErrorHandler::logMessage("Email sent successfully to $toEmail", 'INFO');
                return true;
            } else {
                throw new Exception('SMTP send failed');
            }
            
        } catch (Exception $e) {
            $this->disconnectSMTP();
            ErrorHandler::logMessage("Email sending failed: " . $e->getMessage(), 'ERROR');
            return false;
        }
    }
    
    /**
     * Send email via PHP mail() function (fallback/testing)
     */
    private function sendViaPhpMail($toEmail, $toName, $subject, $htmlBody, $textBody = null) {
        try {
            $fromEmail = $this->config['from_email'];
            $fromName = $this->config['from_name'];
            
            $headers = "From: \"$fromName\" <$fromEmail>\r\n";
            $headers .= "Reply-To: $fromEmail\r\n";
            $headers .= "MIME-Version: 1.0\r\n";
            $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
            $headers .= "X-Mailer: Hotspot Portal v1.0\r\n";
            
            $result = mail($toEmail, $subject, $htmlBody, $headers);
            
            if ($result) {
                ErrorHandler::logMessage("Email sent via PHP mail() to $toEmail", 'INFO');
                return true;
            } else {
                throw new Exception('PHP mail() function failed');
            }
            
        } catch (Exception $e) {
            ErrorHandler::logMessage("PHP mail() error: " . $e->getMessage(), 'ERROR');
            return false;
        }
    }
    
    /**
     * Connect to SMTP server
     */
    private function connectToSMTP() {
        try {
            $host = $this->config['smtp_host'];
            $port = $this->config['smtp_port'];
            $timeout = $this->config['smtp_timeout'] ?? 30;
            
            // Create socket connection
            $this->smtpSocket = fsockopen($host, $port, $errno, $errstr, $timeout);
            
            if (!$this->smtpSocket) {
                throw new Exception("Failed to connect to $host:$port - $errno: $errstr");
            }
            
            // Read server greeting
            $response = $this->readSMTPResponse();
            if (!$this->isValidSMTPResponse($response, '220')) {
                throw new Exception("Invalid server greeting: $response");
            }
            
            $this->connected = true;
            return true;
            
        } catch (Exception $e) {
            ErrorHandler::logMessage("SMTP connection error: " . $e->getMessage(), 'ERROR');
            return false;
        }
    }
    
    /**
     * Authenticate with SMTP server
     */
    private function authenticateSMTP() {
        try {
            $username = $this->config['smtp_username'];
            $password = $this->config['smtp_password'];
            
            // Send EHLO command
            $this->sendSMTPCommand("EHLO " . ($_SERVER['HTTP_HOST'] ?? 'localhost'));
            $response = $this->readSMTPResponse();
            if (!$this->isValidSMTPResponse($response, '250')) {
                throw new Exception("EHLO failed: $response");
            }
            
            // Send AUTH LOGIN command
            $this->sendSMTPCommand("AUTH LOGIN");
            $response = $this->readSMTPResponse();
            if (!$this->isValidSMTPResponse($response, '334')) {
                throw new Exception("AUTH LOGIN failed: $response");
            }
            
            // Send username
            $this->sendSMTPCommand(base64_encode($username));
            $response = $this->readSMTPResponse();
            if (!$this->isValidSMTPResponse($response, '334')) {
                throw new Exception("Username authentication failed: $response");
            }
            
            // Send password
            $this->sendSMTPCommand(base64_encode($password));
            $response = $this->readSMTPResponse();
            if (!$this->isValidSMTPResponse($response, '235')) {
                throw new Exception("Password authentication failed: $response");
            }
            
            return true;
            
        } catch (Exception $e) {
            ErrorHandler::logMessage("SMTP authentication error: " . $e->getMessage(), 'ERROR');
            return false;
        }
    }
    
    /**
     * Send email via SMTP
     */
    private function sendViaSMTP($toEmail, $toName, $subject, $htmlBody, $textBody) {
        try {
            $fromEmail = $this->config['from_email'];
            
            // MAIL FROM command
            $this->sendSMTPCommand("MAIL FROM:<$fromEmail>");
            $response = $this->readSMTPResponse();
            if (!$this->isValidSMTPResponse($response, '250')) {
                throw new Exception("MAIL FROM failed: $response");
            }
            
            // RCPT TO command
            $this->sendSMTPCommand("RCPT TO:<$toEmail>");
            $response = $this->readSMTPResponse();
            if (!$this->isValidSMTPResponse($response, '250')) {
                throw new Exception("RCPT TO failed: $response");
            }
            
            // DATA command
            $this->sendSMTPCommand("DATA");
            $response = $this->readSMTPResponse();
            if (!$this->isValidSMTPResponse($response, '354')) {
                throw new Exception("DATA command failed: $response");
            }
            
            // Send email data
            $emailData = $this->buildEmailMessage($fromEmail, $toEmail, $toName, $subject, $htmlBody, $textBody);
            $this->sendSMTPCommand($emailData . "\r\n.");
            $response = $this->readSMTPResponse();
            if (!$this->isValidSMTPResponse($response, '250')) {
                throw new Exception("Email data send failed: $response");
            }
            
            return true;
            
        } catch (Exception $e) {
            ErrorHandler::logMessage("SMTP send error: " . $e->getMessage(), 'ERROR');
            return false;
        }
    }
    
    /**
     * Build complete email message
     */
    private function buildEmailMessage($fromEmail, $toEmail, $toName, $subject, $htmlBody, $textBody) {
        $fromName = $this->config['from_name'];
        $boundary = md5(time());
        
        $message = "From: \"$fromName\" <$fromEmail>\r\n";
        $message .= "To: \"$toName\" <$toEmail>\r\n";
        $message .= "Subject: $subject\r\n";
        $message .= "MIME-Version: 1.0\r\n";
        $message .= "Content-Type: multipart/alternative; boundary=\"$boundary\"\r\n";
        $message .= "X-Mailer: Hotspot Portal v1.0\r\n";
        $message .= "Date: " . date('r') . "\r\n\r\n";
        
        // Text version
        if ($textBody) {
            $message .= "--$boundary\r\n";
            $message .= "Content-Type: text/plain; charset=UTF-8\r\n";
            $message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
            $message .= $textBody . "\r\n\r\n";
        }
        
        // HTML version
        $message .= "--$boundary\r\n";
        $message .= "Content-Type: text/html; charset=UTF-8\r\n";
        $message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        $message .= $htmlBody . "\r\n\r\n";
        $message .= "--$boundary--\r\n";
        
        return $message;
    }
    
    /**
     * Disconnect from SMTP server
     */
    private function disconnectSMTP() {
        if ($this->connected && $this->smtpSocket) {
            try {
                $this->sendSMTPCommand("QUIT");
                $this->readSMTPResponse();
            } catch (Exception $e) {
                // Ignore quit errors
            }
            
            fclose($this->smtpSocket);
            $this->connected = false;
        }
    }
    
    /**
     * Send SMTP command
     */
    private function sendSMTPCommand($command) {
        if (!$this->smtpSocket) {
            throw new Exception('No SMTP connection');
        }
        
        fwrite($this->smtpSocket, $command . "\r\n");
    }
    
    /**
     * Read SMTP response
     */
    private function readSMTPResponse() {
        if (!$this->smtpSocket) {
            throw new Exception('No SMTP connection');
        }
        
        $response = '';
        while ($line = fgets($this->smtpSocket, 1024)) {
            $response .= $line;
            // Check if this is the last line (no dash after code)
            if (preg_match('/^\d{3} /', $line)) {
                break;
            }
        }
        
        return trim($response);
    }
    
    /**
     * Check if SMTP response is valid
     */
    private function isValidSMTPResponse($response, $expectedCode) {
        return strpos($response, $expectedCode) === 0;
    }
    
    /**
     * Build verification URL
     */
    private function buildVerificationUrl($token) {
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        return "$protocol://$host/verify.html?token=$token";
    }
    
    /**
     * Get verification email HTML template
     */
    private function getVerificationEmailTemplate($firstName, $verificationUrl) {
        $companyName = $this->config['company_name'] ?? 'Your Company';
        $supportEmail = $this->config['support_email'] ?? 'support@your-domain.com';
        
        return "<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Verify Your Email</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000; color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #4f83cc; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
    </style>
</head>
<body>
    <div class='header'>
        <h1>$companyName</h1>
        <p>WiFi Portal Email Verification</p>
    </div>
    <div class='content'>
        <h2>Hello $firstName!</h2>
        <p>Thank you for registering for WiFi access. To complete your registration and gain internet access, please verify your email address by clicking the button below:</p>
        
        <div style='text-align: center;'>
            <a href='$verificationUrl' class='button'>Verify Email Address</a>
        </div>
        
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style='word-break: break-all; background: #eee; padding: 10px; border-radius: 3px;'>$verificationUrl</p>
        
        <p><strong>Important:</strong></p>
        <ul>
            <li>This verification link will expire in 1 hour</li>
            <li>After verification, you'll have access to the WiFi network for 24 hours</li>
            <li>Please keep this email for your records</li>
        </ul>
        
        <p>If you didn't request WiFi access, please ignore this email.</p>
    </div>
    <div class='footer'>
        <p>Need help? Contact us at <a href='mailto:$supportEmail'>$supportEmail</a></p>
        <p>&copy; " . date('Y') . " $companyName. All rights reserved.</p>
    </div>
</body>
</html>";
    }
    
    /**
     * Get verification email text version
     */
    private function getVerificationEmailText($firstName, $verificationUrl) {
        $companyName = $this->config['company_name'] ?? 'Your Company';
        $supportEmail = $this->config['support_email'] ?? 'support@your-domain.com';
        
        return "$companyName - WiFi Portal Email Verification

Hello $firstName!

Thank you for registering for WiFi access. To complete your registration and gain internet access, please verify your email address by visiting this link:

$verificationUrl

Important:
- This verification link will expire in 1 hour
- After verification, you'll have access to the WiFi network for 24 hours
- Please keep this email for your records

If you didn't request WiFi access, please ignore this email.

Need help? Contact us at $supportEmail

© " . date('Y') . " $companyName. All rights reserved.";
    }
    
    /**
     * Get welcome email HTML template
     */
    private function getWelcomeEmailTemplate($firstName) {
        $companyName = $this->config['company_name'] ?? 'Your Company';
        
        return "<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Welcome to Our WiFi Network</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #51cf66; color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
    </style>
</head>
<body>
    <div class='header'>
        <h1>Welcome to $companyName WiFi!</h1>
    </div>
    <div class='content'>
        <h2>Hello $firstName!</h2>
        <p>Great news! Your email has been verified and you now have access to our WiFi network.</p>
        
        <p><strong>Your WiFi access includes:</strong></p>
        <ul>
            <li>24 hours of internet access</li>
            <li>High-speed browsing and streaming</li>
            <li>Access to most websites and services</li>
        </ul>
        
        <p><strong>Terms of Use:</strong></p>
        <ul>
            <li>Please use the internet responsibly and legally</li>
            <li>Heavy downloading may affect other users</li>
            <li>Adult content and illegal activities are prohibited</li>
        </ul>
        
        <p>Enjoy your internet access!</p>
    </div>
    <div class='footer'>
        <p>&copy; " . date('Y') . " $companyName. All rights reserved.</p>
    </div>
</body>
</html>";
    }
    
    /**
     * Get welcome email text version
     */
    private function getWelcomeEmailText($firstName) {
        $companyName = $this->config['company_name'] ?? 'Your Company';
        
        return "Welcome to $companyName WiFi!

Hello $firstName!

Great news! Your email has been verified and you now have access to our WiFi network.

Your WiFi access includes:
- 24 hours of internet access
- High-speed browsing and streaming  
- Access to most websites and services

Terms of Use:
- Please use the internet responsibly and legally
- Heavy downloading may affect other users
- Adult content and illegal activities are prohibited

Enjoy your internet access!

© " . date('Y') . " $companyName. All rights reserved.";
    }
    
    /**
     * Test email configuration
     */
    public function testConfiguration() {
        try {
            if ($this->config['use_php_mail'] ?? false) {
                return ['success' => true, 'message' => 'Using PHP mail() function'];
            }
            
            if (!$this->connectToSMTP()) {
                return ['success' => false, 'error' => 'Failed to connect to SMTP server'];
            }
            
            if (!$this->authenticateSMTP()) {
                return ['success' => false, 'error' => 'SMTP authentication failed'];
            }
            
            $this->disconnectSMTP();
            return ['success' => true, 'message' => 'Email configuration is valid'];
            
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}
?>
