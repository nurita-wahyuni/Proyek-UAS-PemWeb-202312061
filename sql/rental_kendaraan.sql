-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 24 Jul 2025 pada 12.20
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rental_kendaraan`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `logs`
--

CREATE TABLE `logs` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `activity` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `logs`
--

INSERT INTO `logs` (`id`, `user_id`, `activity`, `created_at`) VALUES
(1, 1, 'Mengubah kendaraan: Toyota Fortuner', '2025-07-18 12:54:56'),
(2, 1, 'Mengubah kendaraan: Honda HR‑V', '2025-07-18 12:55:49'),
(3, 1, 'Mengubah kendaraan: Toyota Innova', '2025-07-18 13:05:10'),
(4, 1, 'Mengubah kendaraan: Toyota Fortuner', '2025-07-18 13:05:49'),
(5, 1, 'Mengubah kendaraan: Honda HR‑V', '2025-07-18 13:06:27'),
(6, 1, 'Mengubah kendaraan: Toyota Innova', '2025-07-18 13:08:05'),
(7, 1, 'Mengubah kendaraan: Yamaha NMAX', '2025-07-18 13:08:48'),
(8, 1, 'Mengubah kendaraan: Honda Vario 160', '2025-07-18 13:10:29'),
(9, 1, 'Mengubah kendaraan: Yadea G5', '2025-07-18 13:11:43'),
(10, 1, 'Mengubah kendaraan: Yadea G5', '2025-07-18 13:12:23'),
(11, 1, 'Mengubah kendaraan: Selis E‑Bike', '2025-07-18 13:13:00'),
(12, 1, 'Mengubah kendaraan: Toyota Fortuner', '2025-07-24 05:58:22'),
(13, 1, 'Status rental ID 5 diubah menjadi Ongoing', '2025-07-24 07:44:54'),
(14, 1, 'Status rental ID 5 diubah menjadi Selesai', '2025-07-24 07:51:05'),
(15, 1, 'Status rental ID 3 diubah menjadi Selesai', '2025-07-24 07:51:11');

-- --------------------------------------------------------

--
-- Struktur dari tabel `notifications`
--

CREATE TABLE `notifications` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `message` text DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `payments`
--

CREATE TABLE `payments` (
  `id` int(10) UNSIGNED NOT NULL,
  `rental_id` int(10) UNSIGNED NOT NULL,
  `payment_date` date NOT NULL,
  `amount_paid` int(10) UNSIGNED NOT NULL,
  `payment_method` enum('Cash','Transfer','E-Wallet') DEFAULT 'Transfer',
  `proof_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rentals`
--

CREATE TABLE `rentals` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `vehicle_id` int(10) UNSIGNED NOT NULL,
  `rent_date` date NOT NULL,
  `return_date` date NOT NULL,
  `total_price` int(10) UNSIGNED NOT NULL,
  `status` enum('Dipesan','Ongoing','Selesai','Dibatalkan') DEFAULT 'Dipesan',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `rentals`
--

INSERT INTO `rentals` (`id`, `user_id`, `vehicle_id`, `rent_date`, `return_date`, `total_price`, `status`, `created_at`) VALUES
(1, 2, 1, '2024-01-15', '2024-01-17', 1600000, 'Selesai', '2025-07-18 12:23:27'),
(2, 2, 2, '2024-01-20', '2024-01-22', 1200000, 'Selesai', '2025-07-18 12:23:27'),
(3, 3, 3, '2024-01-25', '2024-01-27', 1000000, 'Selesai', '2025-07-18 12:23:27'),
(4, 2, 2, '2025-07-31', '2025-08-07', 4200007, 'Dipesan', '2025-07-24 07:21:21'),
(5, 2, 1, '2025-07-25', '2025-08-09', 12000015, 'Selesai', '2025-07-24 07:30:49');

-- --------------------------------------------------------

--
-- Struktur dari tabel `reviews`
--

CREATE TABLE `reviews` (
  `id` int(10) UNSIGNED NOT NULL,
  `rental_id` int(10) UNSIGNED NOT NULL,
  `rating` tinyint(4) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `roles`
--

CREATE TABLE `roles` (
  `id` int(10) UNSIGNED NOT NULL,
  `role_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `roles`
--

INSERT INTO `roles` (`id`, `role_name`) VALUES
(1, 'admin'),
(2, 'user');

-- --------------------------------------------------------

--
-- Struktur dari tabel `settings`
--

CREATE TABLE `settings` (
  `id` int(10) UNSIGNED NOT NULL,
  `setting_key` varchar(50) DEFAULT NULL,
  `setting_value` text DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `settings`
--

INSERT INTO `settings` (`id`, `setting_key`, `setting_value`, `description`) VALUES
(1, 'app_name', 'RentalKu', 'Nama aplikasi rental kendaraan'),
(2, 'app_description', 'Platform Rental Kendaraan Terpercaya', 'Deskripsi aplikasi'),
(3, 'site_description', 'Layanan rental kendaraan terpercaya', 'Deskripsi website'),
(4, 'contact_email', 'admin@rentalku.com', 'Email kontak'),
(5, 'contact_phone', '081234567890', 'Nomor telepon kontak'),
(6, 'address', 'Jl. Contoh No. 123, Jakarta', 'Alamat kantor'),
(7, 'max_rental_days', '30', 'Maksimal hari penyewaan'),
(8, 'booking_fee_percentage', '10', 'Persentase biaya booking'),
(9, 'late_fee_per_day', '50000', 'Denda keterlambatan per hari');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `email`, `phone`, `role_id`, `created_at`) VALUES
(1, 'admin', 'admin123', 'Administrator', 'admin@rental.com', '081234567890', 1, '2025-07-18 12:23:26'),
(2, 'user', 'user123', 'John Doe', 'john@example.com', '081234567891', 2, '2025-07-18 12:23:26'),
(3, 'user2', 'user123', 'Jane Smith', 'jane@example.com', '081234567892', 2, '2025-07-18 12:23:26');

-- --------------------------------------------------------

--
-- Struktur dari tabel `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int(10) UNSIGNED NOT NULL,
  `brand` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `plat_nomor` varchar(20) NOT NULL,
  `type_id` int(10) UNSIGNED NOT NULL,
  `price_per_day` int(10) UNSIGNED NOT NULL,
  `seats` tinyint(4) NOT NULL DEFAULT 1,
  `transmission` enum('Manual','Automatic') DEFAULT 'Manual',
  `fuel` enum('Bensin','Diesel','Listrik') DEFAULT 'Bensin',
  `image` varchar(255) DEFAULT NULL,
  `status` enum('Tersedia','Disewa','Servis') DEFAULT 'Tersedia',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `vehicles`
--

INSERT INTO `vehicles` (`id`, `brand`, `model`, `plat_nomor`, `type_id`, `price_per_day`, `seats`, `transmission`, `fuel`, `image`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Toyota', 'Fortuner', 'B 1234 ABC', 1, 800001, 7, 'Automatic', 'Diesel', 'https://wallpapers.com/images/hd/toyota-fortuner-black-trd-variant-model-72r9iq6f8avojga4.jpg', 'Tersedia', '2025-07-18 12:23:26', '2025-07-24 07:51:05'),
(2, 'Honda', 'HR‑V', 'B 5678 DEF', 1, 600001, 5, 'Automatic', 'Bensin', 'https://tse4.mm.bing.net/th/id/OIP.VOJ5pi_o7dZx3R8RakvlYwHaE8?rs=1&pid=ImgDetMain&o=7&rm=3', 'Tersedia', '2025-07-18 12:23:26', '2025-07-24 03:51:55'),
(3, 'Toyota', 'Innova', 'B 9012 GHI', 1, 500001, 7, 'Manual', 'Diesel', 'https://tse1.mm.bing.net/th/id/OIP.Nd0JXuzjX_fjyzHT_RtXJgHaEG?rs=1&pid=ImgDetMain&o=7&rm=3', 'Tersedia', '2025-07-18 12:23:26', '2025-07-24 03:51:55'),
(4, 'Yamaha', 'NMAX', 'B 3456 JKL', 2, 180001, 2, 'Automatic', 'Bensin', 'https://motortrade.com.ph/wp-content/uploads/2022/08/4.jpg', 'Tersedia', '2025-07-18 12:23:26', '2025-07-24 03:51:55'),
(5, 'Honda', 'Vario 160', 'B 7890 MNO', 2, 150001, 2, 'Automatic', 'Bensin', 'https://motonewsworld.com/wp-content/uploads/2023/03/2023-honda-vario-160-grande-matte-white-abs.jpg', 'Tersedia', '2025-07-18 12:23:26', '2025-07-24 03:51:55'),
(6, 'Yadea', 'G5', 'B 1357 PQR', 3, 120001, 1, 'Automatic', 'Listrik', 'https://doohan.eu/wp-content/uploads/2021/04/G5-Blue-Stock-2-e1619772318819.jpeg', 'Tersedia', '2025-07-18 12:23:26', '2025-07-24 03:51:55'),
(7, 'Selis', 'E‑Bike', 'B 2468 STU', 3, 100001, 1, 'Automatic', 'Listrik', 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/101/MTA-98382160/selis_selis_e-bike_sepeda_listrik_tipe_mandalika_garansi_resmi_-_kirim_keluar_kota_-_full03_udtjdu2i.jpeg', 'Tersedia', '2025-07-18 12:23:26', '2025-07-24 03:51:55');

-- --------------------------------------------------------

--
-- Struktur dari tabel `vehicle_types`
--

CREATE TABLE `vehicle_types` (
  `id` int(10) UNSIGNED NOT NULL,
  `type_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `vehicle_types`
--

INSERT INTO `vehicle_types` (`id`, `type_name`) VALUES
(1, 'Mobil'),
(2, 'Motor'),
(3, 'Sepeda Listrik');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_payments_rental` (`rental_id`);

--
-- Indeks untuk tabel `rentals`
--
ALTER TABLE `rentals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_rentals_users` (`user_id`),
  ADD KEY `fk_rentals_vehicles` (`vehicle_id`);

--
-- Indeks untuk tabel `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_reviews_rental` (`rental_id`);

--
-- Indeks untuk tabel `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indeks untuk tabel `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `fk_users_roles` (`role_id`);

--
-- Indeks untuk tabel `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_plat_nomor` (`plat_nomor`),
  ADD KEY `fk_vehicle_type` (`type_id`);

--
-- Indeks untuk tabel `vehicle_types`
--
ALTER TABLE `vehicle_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `type_name` (`type_name`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT untuk tabel `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `rentals`
--
ALTER TABLE `rentals`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `vehicle_types`
--
ALTER TABLE `vehicle_types`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payments_rental` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `rentals`
--
ALTER TABLE `rentals`
  ADD CONSTRAINT `fk_rentals_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_rentals_vehicles` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`);

--
-- Ketidakleluasaan untuk tabel `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_reviews_rental` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_roles` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
