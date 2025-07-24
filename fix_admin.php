<?php
require_once __DIR__.'/includes/db.php';

$new_password = 'admin123';
// PERINGATAN: Menyimpan password plain text sangat tidak aman!

$pdo->prepare("UPDATE users SET password = ? WHERE username = 'admin'")
    ->execute([$new_password]);

echo "✅ Password admin berhasil diperbarui.";
