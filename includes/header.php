<?php
if (session_status() === PHP_SESSION_NONE) session_start();

// Optimized CSS version for production
$cssVersion = '1.0.0'; // Change this when CSS is updated instead of using time()
$isProduction = !($_SERVER['HTTP_HOST'] === 'localhost' || strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false);
?>
<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="Sistem Rental Kendaraan Modern - Sewa mobil dengan mudah dan terpercaya">
  <title>Rental Kendaraan</title>

  <!-- Preload critical resources -->
  <link rel="preload" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" as="style">
  <link rel="preload" href="/nur1/assets/css/style.css?v=<?= $cssVersion ?>" as="style">
  
  <!-- DNS prefetch for external resources -->
  <link rel="dns-prefetch" href="//cdn.jsdelivr.net">
  
  <!-- Critical CSS inline for faster rendering -->
  <style>
    /* Critical CSS - Above the fold content */
    body { font-family: 'Inter', -apple-system, sans-serif; }
    .hero { min-height: 100vh; display: flex; align-items: center; }
    .btn-gradient { 
      background: linear-gradient(135deg, #6a1b9a, #1976d2);
      color: white; border: none; padding: 12px 24px;
      border-radius: 25px; font-weight: 600;
    }
    .text-gradient {
      background: linear-gradient(135deg, #6a1b9a, #1976d2);
      -webkit-background-clip: text; color: transparent;
    }
  </style>

  <!-- Bootstrap & Icons - Async load -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">

  <!-- Custom CSS - Conditional loading -->
  <link href="/nur1/assets/css/style.css?v=<?= $cssVersion ?>" rel="stylesheet">
  <?php if (strpos($_SERVER['REQUEST_URI'], '/admin/') !== false): ?>
  <link href="/nur1/assets/css/admin-modern.css?v=<?= $cssVersion ?>" rel="stylesheet">
  <?php else: ?>
  <link href="/nur1/assets/css/user-modern.css?v=<?= $cssVersion ?>" rel="stylesheet">
  <?php endif; ?>

  
  <!-- Test CSS Loading -->
  <style>
    /* Force test CSS to override any issues */
    .btn-gradient {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
      border: none !important;
      border-radius: 12px !important;
      padding: 12px 24px !important;
      font-weight: 600 !important;
      transition: all 0.3s ease !important;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4) !important;
    }
    
    .btn-gradient:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6) !important;
    }
    
    .text-gradient {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      -webkit-background-clip: text !important;
      background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      font-weight: 700 !important;
    }
    
    .card {
      border-radius: 16px !important;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
      transition: all 0.3s ease !important;
      border: none !important;
    }
    
    .card:hover {
      transform: translateY(-4px) !important;
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1) !important;
    }
    
    .animate-on-scroll {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  </style>
</head>
<body>

  <?php include_once __DIR__.'/navbar.php'; ?>

  <main>