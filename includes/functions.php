<?php
/**
 * functions.php – Optimized utility functions
 */

// Cache for expensive operations
class FunctionCache {
    private static $cache = [];
    
    public static function get($key) {
        return self::$cache[$key] ?? null;
    }
    
    public static function set($key, $value) {
        self::$cache[$key] = $value;
    }
}

/* Escape HTML - Optimized with caching for repeated values */
function h(?string $str): string
{
    if ($str === null || $str === '') return '';
    
    static $cache = [];
    $key = md5($str);
    
    if (!isset($cache[$key])) {
        $cache[$key] = htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
        
        // Limit cache size to prevent memory issues
        if (count($cache) > 100) {
            $cache = array_slice($cache, -50, 50, true);
        }
    }
    
    return $cache[$key];
}

/* Redirect - Optimized with proper headers */
function redirect(string $url): never
{
    // Prevent header injection
    $url = filter_var($url, FILTER_SANITIZE_URL);
    
    if (headers_sent()) {
        echo "<script>window.location.href='$url';</script>";
        echo "<noscript><meta http-equiv='refresh' content='0;url=$url'></noscript>";
    } else {
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        header('Location: ' . $url, true, 302);
    }
    exit;
}

/* Format rupiah - Optimized with static formatter */
function rupiah(int|float $n): string
{
    static $cache = [];
    $key = (string)$n;
    
    if (!isset($cache[$key])) {
        $cache[$key] = 'Rp ' . number_format($n, 0, ',', '.');
        
        // Limit cache size
        if (count($cache) > 50) {
            $cache = array_slice($cache, -25, 25, true);
        }
    }
    
    return $cache[$key];
}

/* Get base URL - Optimized with static caching */
function get_base_url(): string
{
    static $baseUrl = null;
    
    if ($baseUrl === null) {
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        $host = $_SERVER['HTTP_HOST'];
        $script = $_SERVER['SCRIPT_NAME'];
        $path = dirname($script);
        
        // Jika di admin folder atau subfolder admin, naik ke project root
        if (strpos($path, '/admin') !== false) {
            // Hapus /admin dan path setelahnya
            $path = preg_replace('#/admin.*$#', '', $path);
        }
        
        // Pastikan path tidak kosong dan diakhiri dengan slash
        if ($path === '' || $path === '.') {
            $path = '/nur1';
        }
        
        $baseUrl = $protocol . $host . $path . '/';
    }
    
    return $baseUrl;
}

/* Log activity - Optimized with batch logging */
function log_activity(int $user_id, string $activity): void
{
    static $logQueue = [];
    static $lastFlush = null;
    
    // Add to queue
    $logQueue[] = [
        'user_id' => $user_id,
        'activity' => $activity,
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    // Flush queue if it's full or enough time has passed
    $now = time();
    if (count($logQueue) >= 5 || ($lastFlush && ($now - $lastFlush) > 30)) {
        flush_log_queue();
        $logQueue = [];
        $lastFlush = $now;
    }
}

/* Flush log queue - Internal function for batch processing */
function flush_log_queue(): void
{
    static $logQueue = [];
    
    if (empty($logQueue)) {
        return;
    }
    
    try {
        global $pdo;
        
        if (!$pdo) return;
        
        $pdo->beginTransaction();
        $stmt = $pdo->prepare("INSERT INTO logs (user_id, activity, created_at) VALUES (?, ?, ?)");
        
        foreach ($logQueue as $log) {
            $stmt->execute([$log['user_id'], $log['activity'], $log['timestamp']]);
        }
        
        $pdo->commit();
    } catch (Exception $e) {
        if ($pdo && $pdo->inTransaction()) {
            $pdo->rollBack();
        }
        error_log("Batch log activity error: " . $e->getMessage());
    }
}

/* Cleanup function to flush remaining logs on script end */
register_shutdown_function(function() {
    flush_log_queue();
});

/* Generate CSRF token */
function generate_csrf_token(): string
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    
    return $_SESSION['csrf_token'];
}

/* Verify CSRF token */
function verify_csrf_token(string $token): bool
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

/* Sanitize input */
function sanitize_input(string $input): string
{
    return trim(strip_tags($input));
}

/* Format date Indonesian */
function format_date_id(string $date): string
{
    static $cache = [];
    
    if (!isset($cache[$date])) {
        $months = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
        ];
        
        $timestamp = strtotime($date);
        $day = date('j', $timestamp);
        $month = $months[(int)date('n', $timestamp)];
        $year = date('Y', $timestamp);
        
        $cache[$date] = "$day $month $year";
        
        // Limit cache size
        if (count($cache) > 50) {
            $cache = array_slice($cache, -25, 25, true);
        }
    }
    
    return $cache[$date];
}
