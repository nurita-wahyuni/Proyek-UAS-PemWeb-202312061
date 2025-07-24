<?php
if (session_status() === PHP_SESSION_NONE) session_start();

require_once __DIR__.'/includes/db.php';
require_once __DIR__.'/includes/auth.php';
require_once __DIR__.'/includes/functions.php';

require_login();

// Pastikan hanya user biasa yang bisa akses
if (is_admin()) {
    redirect('admin/dashboard.php');
}

$user_id = $_SESSION['user']['id'];

// Optimized: Use single query for all user statistics and recent rentals
$userStatsQuery = $pdo->prepare("
    SELECT 
        (SELECT COUNT(*) FROM rentals WHERE user_id = ?) as total_rentals,
        (SELECT COUNT(*) FROM rentals WHERE user_id = ? AND status IN ('Dipesan', 'Ongoing')) as active_rentals
");
$userStatsQuery->execute([$user_id, $user_id]);
$userStats = $userStatsQuery->fetch();

$total_rentals = $userStats['total_rentals'];
$active_rentals = $userStats['active_rentals'];

// Optimized: Get user rentals with better indexing
$stmt = $pdo->prepare("
    SELECT r.id, r.rent_date, r.return_date, r.status, r.created_at,
           v.brand, v.model, v.image, v.price_per_day
    FROM rentals r
    JOIN vehicles v ON v.id = r.vehicle_id
    WHERE r.user_id = ?
    ORDER BY r.created_at DESC
    LIMIT 5
");
$stmt->execute([$user_id]);
$user_rentals = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Optimized: Simplified popular vehicles query without heavy COUNT operations
$popular_vehicles = $pdo->query("
    SELECT v.id, v.brand, v.model, v.image, v.price_per_day, v.status, t.type_name
    FROM vehicles v
    LEFT JOIN vehicle_types t ON t.id = v.type_id
    WHERE v.status = 'Tersedia'
    ORDER BY v.created_at DESC
    LIMIT 4
")->fetchAll(PDO::FETCH_ASSOC);

include_once __DIR__.'/includes/header.php';
?>

<div class="container-fluid py-4">
    <!-- Welcome Section -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card bg-gradient-primary text-white border-0 shadow">
                <div class="card-body p-4">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <h2 class="fw-bold mb-2">Selamat Datang, <?= h($_SESSION['user']['name']); ?>! 👋</h2>
                            <p class="mb-0 opacity-75">Kelola penyewaan kendaraan Anda dengan mudah dan nikmati perjalanan terbaik.</p>
                        </div>
                        <div class="col-md-4 text-md-end">
                            <a href="vehicles.php" class="btn btn-light btn-lg fw-semibold">
                                <i class="bi bi-car-front me-2"></i>Sewa Kendaraan
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Stats Cards -->
    <div class="row g-4 mb-4">
        <div class="col-md-6">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-body d-flex align-items-center">
                    <div class="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                        <i class="bi bi-receipt text-primary fs-4"></i>
                    </div>
                    <div>
                        <h3 class="fw-bold mb-1"><?= $total_rentals; ?></h3>
                        <p class="text-muted mb-0">Total Penyewaan</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-body d-flex align-items-center">
                    <div class="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                        <i class="bi bi-clock text-success fs-4"></i>
                    </div>
                    <div>
                        <h3 class="fw-bold mb-1"><?= $active_rentals; ?></h3>
                        <p class="text-muted mb-0">Penyewaan Aktif</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row g-4">
        <!-- Rental History -->
        <div class="col-lg-7">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-white border-0 pb-0">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="fw-bold mb-0">Riwayat Penyewaan Terbaru</h5>
                        <a href="#" class="btn btn-sm btn-outline-primary">Lihat Semua</a>
                    </div>
                </div>
                <div class="card-body">
                    <?php if (empty($user_rentals)): ?>
                        <div class="text-center py-4">
                            <i class="bi bi-inbox text-muted" style="font-size: 3rem;"></i>
                            <p class="text-muted mt-2">Belum ada riwayat penyewaan</p>
                            <a href="vehicles.php" class="btn btn-primary">Mulai Sewa Sekarang</a>
                        </div>
                    <?php else: ?>
                        <div class="list-group list-group-flush">
                            <?php foreach ($user_rentals as $rental): ?>
                                <div class="list-group-item border-0 px-0">
                                    <div class="row align-items-center">
                                        <div class="col-auto">
                                            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='45' viewBox='0 0 60 45'%3E%3Crect width='60' height='45' fill='%23e9ecef'/%3E%3Cpath d='M20 15 L25 20 L35 10 M15 30 L45 30 M15 35 L30 35' stroke='%236c757d' stroke-width='2' fill='none'/%3E%3C/svg%3E" 
                                                 class="rounded" width="60" height="45" style="object-fit: cover;"
                                                 alt="Vehicle image">
                                        </div>
                                        <div class="col">
                                            <h6 class="mb-1"><?= h($rental['brand'] . ' ' . $rental['model']); ?></h6>
                                            <small class="text-muted">
                                                <?= date('d M Y', strtotime($rental['rent_date'])); ?> - 
                                                <?= date('d M Y', strtotime($rental['return_date'])); ?>
                                            </small>
                                        </div>
                                        <div class="col-auto">
                                            <span class="badge bg-<?= $rental['status'] === 'Selesai' ? 'success' : ($rental['status'] === 'Ongoing' ? 'warning' : 'primary'); ?>">
                                                <?= h($rental['status']); ?>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Popular Vehicles -->
        <div class="col-lg-5">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-white border-0 pb-0">
                    <h5 class="fw-bold mb-0">Kendaraan Populer</h5>
                </div>
                <div class="card-body">
                    <div class="row g-3">
                        <?php foreach (array_slice($popular_vehicles, 0, 4) as $vehicle): ?>
                            <div class="col-6">
                                <div class="card border-0 bg-light h-100">
                                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120' viewBox='0 0 200 120'%3E%3Crect width='200' height='120' fill='%23f8f9fa'/%3E%3Cpath d='M50 40 L80 60 L120 30 M40 80 L160 80 M40 90 L100 90' stroke='%236c757d' stroke-width='3' fill='none'/%3E%3Ccircle cx='70' cy='85' r='8' fill='none' stroke='%236c757d' stroke-width='2'/%3E%3Ccircle cx='130' cy='85' r='8' fill='none' stroke='%236c757d' stroke-width='2'/%3E%3C/svg%3E" 
                                         class="card-img-top" style="height: 80px; object-fit: cover;" alt="<?= h($vehicle['brand'] . ' ' . $vehicle['model']); ?>">
                                    <?php if (!empty($vehicle['image']) && filter_var($vehicle['image'], FILTER_VALIDATE_URL)): ?>
                                    <img src="<?= h($vehicle['image']); ?>" 
                                         class="card-img-top position-absolute top-0 start-0" 
                                         style="height: 80px; object-fit: cover; opacity: 0;" 
                                         alt="<?= h($vehicle['brand'] . ' ' . $vehicle['model']); ?>"
                                         onload="this.style.opacity='1'; this.previousElementSibling.style.opacity='0';"
                                         onerror="this.style.display='none';">
                                    <?php endif; ?>
                                    <div class="card-body p-2">
                                        <h6 class="card-title mb-1 small"><?= h($vehicle['brand'] . ' ' . $vehicle['model']); ?></h6>
                                        <p class="text-primary fw-bold small mb-1">
                                            <?= rupiah($vehicle['price_per_day']); ?>/hari
                                        </p>
                                        <a href="booking.php?vid=<?= $vehicle['id']; ?>" class="btn btn-primary btn-sm w-100">
                                            Sewa
                                        </a>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <div class="text-center mt-3">
                        <a href="vehicles.php" class="btn btn-outline-primary btn-sm">Lihat Semua Kendaraan</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.bg-gradient-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Optimize loading placeholders */
.lazy-load {
    transition: opacity 0.3s;
}

.lazy-load[data-src] {
    opacity: 0.5;
}

.lazy-load.loaded {
    opacity: 1;
}
</style>

<script>
// Ultra-lightweight lazy loading
document.addEventListener('DOMContentLoaded', function() {
    // Lazy load images
    const lazyImages = document.querySelectorAll('.lazy-load[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
    
    // Remove auto-refresh to improve performance
    // Dashboard will refresh only when user manually refreshes the page
    console.log('User dashboard loaded successfully');
});
</script>

<?php include_once __DIR__.'/includes/footer.php'; ?>
