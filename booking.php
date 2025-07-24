<?php
require_once __DIR__.'/includes/db.php';
require_once __DIR__.'/includes/auth.php';
require_once __DIR__.'/includes/functions.php';

require_user();

// Ambil ID kendaraan dari URL
$vid = $_GET['vid'] ?? 0;
$stmt = $pdo->prepare("SELECT * FROM vehicles WHERE id = ?");
$stmt->execute([$vid]);
$vehicle = $stmt->fetch();

if (!$vehicle) {
    echo "<p>Kendaraan tidak ditemukan.</p>";
    exit;
}

// Proses Form Booking
$success = $error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rentDate   = $_POST['rent_date'];
    $returnDate = $_POST['return_date'];
    $today      = date('Y-m-d');

    // Validasi tanggal
    if ($rentDate < $today) {
        $error = 'Tanggal sewa tidak boleh di masa lalu.';
    } elseif (strtotime($returnDate) <= strtotime($rentDate)) {
        $error = 'Tanggal kembali harus lebih besar dari tanggal sewa.';
    } else {
        // Cek jadwal bentrok
        $check = $pdo->prepare("
          SELECT COUNT(*) FROM rentals 
          WHERE vehicle_id = ? AND status = 'Dipesan'
            AND (
              (rent_date <= ? AND return_date >= ?) OR
              (rent_date <= ? AND return_date >= ?) OR
              (? <= rent_date AND ? >= return_date)
            )
        ");
        $check->execute([$vid, $rentDate, $rentDate, $returnDate, $returnDate, $rentDate, $returnDate]);
        $overlap = $check->fetchColumn();

        if ($overlap > 0) {
            $error = 'Kendaraan ini sudah dipesan pada tanggal tersebut.';
        } else {
            $days  = ceil((strtotime($returnDate) - strtotime($rentDate)) / 86400);
            $total = $days * $vehicle['price_per_day'];

            $pdo->prepare("
                INSERT INTO rentals (user_id, vehicle_id, rent_date, return_date, total_price, status)
                VALUES (?, ?, ?, ?, ?, 'Dipesan')
            ")->execute([
                $_SESSION['user']['id'],
                $vid,
                $rentDate,
                $returnDate,
                $total
            ]);

            $success = 'Pemesanan berhasil! Kami akan segera memproses pesanan Anda.';
        }
    }
}

include_once __DIR__.'/includes/header.php';
?>
<div class="container py-5" style="max-width: 600px;">
  <h2 class="fw-bold mb-4">Sewa <?= h($vehicle['brand'].' '.$vehicle['model']); ?></h2>

  <?php if ($success): ?>
    <div class="alert alert-success"><?= h($success); ?></div>
    <a href="index.php" class="btn btn-gradient">Kembali ke Beranda</a>
    <meta http-equiv="refresh" content="5;url=index.php">
  <?php else: ?>

    <?php if ($error): ?>
      <div class="alert alert-danger"><?= h($error); ?></div>
    <?php endif; ?>

    <div class="card card-body shadow-sm">
      <!-- Info kendaraan -->
      <ul class="list-unstyled mb-4 small">
        <li><strong>Merk:</strong> <?= h($vehicle['brand']); ?></li>
        <li><strong>Model:</strong> <?= h($vehicle['model']); ?></li>
        <li><strong>Harga per hari:</strong> Rp <?= number_format($vehicle['price_per_day'], 0, ',', '.'); ?></li>
        <li><strong>Kapasitas:</strong> <?= h($vehicle['seats']); ?> orang</li>
        <li><strong>Transmisi:</strong> <?= h($vehicle['transmission']); ?></li>
        <li><strong>Bahan Bakar:</strong> <?= h($vehicle['fuel']); ?></li>
      </ul>

      <!-- Form Booking -->
      <form method="POST">
        <div class="mb-3">
          <label class="form-label">Tanggal Mulai</label>
          <input type="date" name="rent_date" class="form-control" required id="rent-date">
        </div>

        <div class="mb-3">
          <label class="form-label">Tanggal Kembali</label>
          <input type="date" name="return_date" class="form-control" required id="return-date">
        </div>

        <p><strong>Estimasi Total:</strong> <span id="estimation">-</span></p>

        <button class="btn btn-gradient w-100">Konfirmasi Sewa</button>
      </form>
    </div>

  <?php endif; ?>
</div>

<script>
  const rentInput = document.getElementById('rent-date');
  const returnInput = document.getElementById('return-date');
  const output = document.getElementById('estimation');
  const pricePerDay = <?= $vehicle['price_per_day']; ?>;

  function updateEstimation() {
    const start = new Date(rentInput.value);
    const end = new Date(returnInput.value);
    if (rentInput.value && returnInput.value && end > start) {
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      const total = days * pricePerDay;
      output.innerText = 'Rp ' + total.toLocaleString('id-ID');
    } else {
      output.innerText = '-';
    }
  }

  rentInput.addEventListener('change', updateEstimation);
  returnInput.addEventListener('change', updateEstimation);
</script>

<?php include_once __DIR__.'/includes/footer.php'; ?>
