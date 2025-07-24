  </main>

  <footer class="py-4 text-center bg-light mt-5">
    <p class="mb-0">&copy; <?= date('Y'); ?> RentalKu. All rights reserved.</p>
  </footer>

  <!-- Optimized JavaScript Loading -->
  <?php
  $jsVersion = '1.0.0'; // Update when JS changes
  $currentPage = basename($_SERVER['REQUEST_URI']);
  ?>
  
  <!-- Bootstrap JavaScript - Preload -->
  <link rel="preload" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" as="script">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" defer></script>

  <!-- Core JavaScript - Always load -->
  <script src="/nur1/assets/js/main.js?v=<?= $jsVersion ?>" defer></script>
  
  <!-- Conditional JavaScript Loading -->
  <?php if (strpos($_SERVER['REQUEST_URI'], '/admin/') !== false): ?>
    <script src="/nur1/assets/js/admin-panel.js?v=<?= $jsVersion ?>" defer></script>
  <?php else: ?>
    <script src="/nur1/assets/js/user-panel.js?v=<?= $jsVersion ?>" defer></script>
  <?php endif; ?>
  
  <!-- Page-specific scripts -->
  <?php if (in_array($currentPage, ['index.php', 'dashboard.php'])): ?>
    <script src="/nur1/assets/js/scripts.js?v=<?= $jsVersion ?>" defer></script>
  <?php endif; ?>
  
  <!-- Performance monitoring -->
  <script>
    // Lazy load performance monitoring
    if ('performance' in window) {
      window.addEventListener('load', function() {
        setTimeout(function() {
          const perfData = performance.timing;
          const loadTime = perfData.loadEventEnd - perfData.navigationStart;
          if (loadTime > 3000) {
            console.warn('Page load time: ' + loadTime + 'ms - Consider optimization');
          }
        }, 0);
      });
    }
  </script>

</body>
</html>
