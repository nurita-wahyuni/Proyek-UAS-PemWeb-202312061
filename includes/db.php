<?php
/**
 * db.php – Koneksi PDO ke MySQL
 * -------------------------------------
 * Sesuaikan nilai host, db, user, pass.
 */
// Optimized Database Configuration
class DatabaseConnection {
    private static $instance = null;
    private $pdo;
    private $host = 'localhost';
    private $dbname = 'rental_kendaraan';
    private $username = 'root';
    private $password = '';
    
    private function __construct() {
        $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset=utf8mb4";
        try {
            $this->pdo = new PDO(
                $dsn, 
                $this->username, 
                $this->password, 
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::ATTR_PERSISTENT => true, // Connection pooling
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
                    PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true,
                    PDO::ATTR_TIMEOUT => 5, // 5 second timeout
                ]
            );
            
            // Optimize MySQL settings
            $this->pdo->exec("SET time_zone = '+07:00'");
            $this->pdo->exec("SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO'");
            
        } catch(PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            die("Database connection failed. Please try again later.");
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->pdo;
    }
    
    // Prevent cloning and unserialization
    private function __clone() {}
    public function __wakeup() {}
}

// Global PDO instance for backward compatibility
$pdo = DatabaseConnection::getInstance()->getConnection();

// Query cache for frequently used queries
class QueryCache {
    private static $cache = [];
    private static $maxCacheSize = 50;
    
    public static function get($key) {
        return isset(self::$cache[$key]) ? self::$cache[$key] : null;
    }
    
    public static function set($key, $value) {
        if (count(self::$cache) >= self::$maxCacheSize) {
            array_shift(self::$cache); // Remove oldest entry
        }
        self::$cache[$key] = $value;
    }
    
    public static function clear() {
        self::$cache = [];
    }
}
