document.addEventListener("DOMContentLoaded", () => {
  const burgerMenu = document.querySelector(".burger-menu");
  const navbar = document.querySelector(".navbar");

  if (burgerMenu && navbar) {
    burgerMenu.addEventListener("click", () => {
      navbar.classList.toggle("active");
      // Accessibility: Toggle aria-expanded
      const isExpanded = burgerMenu.getAttribute("aria-expanded") === "true";
      burgerMenu.setAttribute("aria-expanded", !isExpanded);
    });
  }

  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  const navbarCollapse = document.querySelector(".navbar-collapse");
  const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 992) {
        bsCollapse.hide();
      }
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });
  console.log("test");

  const fixVirtualKeyboardScroll = () => {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (isIOS) {
      document.querySelectorAll("input, textarea, select").forEach((input) => {
        input.addEventListener("focus", () => {
          // Tambahkan padding bottom sementara untuk mencegah konten tersembunyi di bawah keyboard
          document.body.style.paddingBottom = "150px";
        });

        input.addEventListener("blur", () => {
          // Hapus padding tambahan
          document.body.style.paddingBottom = "0";
        });
      });
    }
  };

  // Deteksi ukuran layar dan terapkan perubahan spesifik
  const handleResponsiveAdjustments = () => {
    const isMobile = window.innerWidth < 768;

    // Filter sidebar toggle pada halaman daftar_kursus.html dan bootcamp.html
    const filterSidebar = document.querySelector(".filter-sidebar");
    if (isMobile && filterSidebar) {
      // Jika belum ada toggle button, buat baru
      if (!document.querySelector(".filter-toggle-btn")) {
        const toggleBtn = document.createElement("button");
        toggleBtn.className =
          "btn btn-sm btn-outline-secondary w-100 mb-3 filter-toggle-btn";
        toggleBtn.innerHTML = 'Tampilkan Filter <i class="bi bi-funnel"></i>';

        // Sembunyikan sidebar secara default di mobile
        filterSidebar.style.display = "none";

        // Tambahkan button sebelum sidebar
        filterSidebar.parentNode.insertBefore(toggleBtn, filterSidebar);

        // Tambahkan event listener
        toggleBtn.addEventListener("click", function () {
          if (filterSidebar.style.display === "none") {
            filterSidebar.style.display = "block";
            this.innerHTML =
              'Sembunyikan Filter <i class="bi bi-funnel-fill"></i>';
          } else {
            filterSidebar.style.display = "none";
            this.innerHTML = 'Tampilkan Filter <i class="bi bi-funnel"></i>';
          }
        });
      }
    }

    // Perbaiki layout curriculum-sidebar di detail_kursus.html
    const curriculumSidebar = document.querySelector(".curriculum-sidebar");
    const mainContent = document.querySelector(".main-content");

    if (isMobile && curriculumSidebar && mainContent) {
      curriculumSidebar.style.width = "100%";
      curriculumSidebar.style.maxHeight = "300px";
      curriculumSidebar.style.position = "relative";
      mainContent.style.width = "100%";
    } else if (curriculumSidebar && mainContent) {
      curriculumSidebar.style.width = "var(--sidebar-width)";
      curriculumSidebar.style.maxHeight = "none";
      curriculumSidebar.style.position = "sticky";
      mainContent.style.width = "auto";
    }
    console.log("Responsive adjustments applied");
  };

  // Jalankan fungsi perbaikan
  fixVirtualKeyboardScroll();
  handleResponsiveAdjustments();

  // Jalankan fungsi ulang saat ukuran window berubah
  window.addEventListener("resize", handleResponsiveAdjustments);
});
