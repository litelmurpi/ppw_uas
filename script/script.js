document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // ========== Configuration ==========
  const config = {
    mobileBreakpoint: 768,
    tabletBreakpoint: 992,
    animationDuration: 300,
  };
  
  // ========== Utility Functions ==========
  const utils = {
    isMobile: () => window.innerWidth < config.mobileBreakpoint,
    isTablet: () => window.innerWidth < config.tabletBreakpoint,
    debounce: (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
  };

  // ========== Smooth Scrolling ==========
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        if (targetId === "#") return;

        const target = document.querySelector(targetId);
        if (target) {
          const navbarHeight =
            document.querySelector(".navbar")?.offsetHeight || 0;
          const targetPosition =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            navbarHeight -
            20;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  }

  // ========== Mobile Menu Enhancement ==========
  function initMobileMenu() {
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector(".navbar-collapse");

    if (navbarToggler && navbarCollapse) {
      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (
          !navbarToggler.contains(e.target) &&
          !navbarCollapse.contains(e.target)
        ) {
          if (navbarCollapse.classList.contains("show")) {
            navbarToggler.click();
          }
        }
      });

      // Close menu when clicking on a link
      navbarCollapse.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => {
          if (utils.isMobile() && navbarCollapse.classList.contains("show")) {
            navbarToggler.click();
          }
        });
      });
    }
  }

  // ========== Mobile Sidebar Navigation ==========
  function initMobileSidebar() {
    // Create sidebar elements if they don't exist
    if (!document.querySelector(".mobile-sidebar")) {
      createSidebarElements();
    }

    const toggler = document.querySelector(".navbar-toggler");
    const sidebar = document.querySelector(".mobile-sidebar");
    const overlay = document.querySelector(".sidebar-overlay");
    const closeBtn = document.querySelector(".mobile-sidebar-close");
    const body = document.body;

    // Toggle sidebar
    if (toggler) {
      toggler.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleSidebar();
      });
    }

    // Close sidebar
    if (closeBtn) {
      closeBtn.addEventListener("click", closeSidebar);
    }

    if (overlay) {
      overlay.addEventListener("click", closeSidebar);
    }

    // Close sidebar when clicking links
    const sidebarLinks = document.querySelectorAll(
      ".mobile-sidebar-nav .nav-link:not(.dropdown-toggle)"
    );
    sidebarLinks.forEach((link) => {
      link.addEventListener("click", function () {
        closeSidebar();
      });
    });

    // Functions
    function toggleSidebar() {
      sidebar.classList.toggle("active");
      overlay.classList.toggle("active");
      toggler.classList.toggle("active");
      body.classList.toggle("sidebar-open");
    }

    function closeSidebar() {
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
      toggler.classList.remove("active");
      body.classList.remove("sidebar-open");
    }

    // Close sidebar on ESC key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sidebar.classList.contains("active")) {
        closeSidebar();
      }
    });
  }

  function createSidebarElements() {
    // Get current nav items
    const navItems = document.querySelector(".navbar-nav");
    if (!navItems) return;

    // Check if user is logged in (has profile dropdown or avatar)
    const profileDropdown = document.querySelector(".profile-dropdown");
    const avatarElement = document.querySelector(
      '.navbar img[alt*="Avatar"], .navbar img[alt*="Profil"], .navbar img[alt="User Avatar"]'
    );
    const isLoggedIn = profileDropdown || avatarElement;

    let profileHTML = "";

    if (isLoggedIn) {
      // Get user name if available
      const userName = profileDropdown
        ? profileDropdown.querySelector(".dropdown-header")?.textContent ||
          "User"
        : "User";

      profileHTML = `
        <li class="nav-item dropdown mt-3 pt-3 border-top">
          <div class="d-flex align-items-center px-3 mb-2">
            <img src="${
              avatarElement?.src || "https://i.pravatar.cc/150?img=32"
            }" 
                 alt="User" 
                 class="rounded-circle me-2" 
                 width="40" 
                 height="40">
            <span class="fw-semibold">${userName}</span>
          </div>
          <ul class="list-unstyled ps-3">
            <li><a class="nav-link" href="#"><i class="bi bi-person-circle"></i> Profil Saya</a></li>
            <li><a class="nav-link" href="#"><i class="bi bi-gear"></i> Pengaturan</a></li>
            <li><hr class="dropdown-divider mx-3"></li>
            <li><a class="nav-link text-danger" href="index.html"><i class="bi bi-box-arrow-right"></i> Keluar</a></li>
          </ul>
        </li>
      `;
    }

    // Clone nav items and modify for mobile
    const navItemsClone = navItems.cloneNode(true);

    // Remove desktop-only classes
    navItemsClone
      .querySelectorAll(".d-none.d-lg-inline-block")
      .forEach((el) => {
        el.classList.remove("d-none", "d-lg-inline-block");
      });

    navItemsClone.querySelectorAll(".d-lg-none").forEach((el) => {
      el.classList.remove("d-lg-none");
    });

    // Create sidebar HTML
    const sidebarHTML = `
      <div class="mobile-sidebar">
        <div class="mobile-sidebar-header">
          <a class="navbar-brand" href="${
            isLoggedIn ? "landing_page_login.html" : "index.html"
          }">NAKAMA</a>
          <button class="mobile-sidebar-close" aria-label="Close sidebar">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="mobile-sidebar-body">
          <ul class="mobile-sidebar-nav">
            ${navItemsClone.innerHTML}
            ${profileHTML}
          </ul>
        </div>
      </div>
      <div class="sidebar-overlay"></div>
    `;

    // Add to body
    document.body.insertAdjacentHTML("beforeend", sidebarHTML);

    // Re-initialize Bootstrap dropdowns in sidebar if needed
    const sidebarDropdowns = document.querySelectorAll(
      ".mobile-sidebar .dropdown-toggle"
    );
    sidebarDropdowns.forEach((dropdown) => {
      new bootstrap.Dropdown(dropdown);
    });
  }

  // ========== Filter Sidebar Management ==========
  function initFilterSidebar() {
    const filterSidebar = document.querySelector(".filter-sidebar");
    if (!filterSidebar) return;

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "btn btn-outline-secondary w-100 mb-3 d-lg-none";
    toggleBtn.innerHTML = '<i class="bi bi-funnel"></i> Tampilkan Filter';

    const updateFilterVisibility = () => {
      if (utils.isTablet()) {
        filterSidebar.style.display = "none";
        if (!document.querySelector(".filter-toggle-btn")) {
          toggleBtn.classList.add("filter-toggle-btn");
          filterSidebar.parentNode.insertBefore(toggleBtn, filterSidebar);
        }
      } else {
        filterSidebar.style.display = "block";
        const existingBtn = document.querySelector(".filter-toggle-btn");
        if (existingBtn) existingBtn.remove();
      }
    };

    toggleBtn.addEventListener("click", () => {
      const isHidden = filterSidebar.style.display === "none";
      filterSidebar.style.display = isHidden ? "block" : "none";
      toggleBtn.innerHTML = isHidden
        ? '<i class="bi bi-funnel-fill"></i> Sembunyikan Filter'
        : '<i class="bi bi-funnel"></i> Tampilkan Filter';
    });

    updateFilterVisibility();
    window.addEventListener(
      "resize",
      utils.debounce(updateFilterVisibility, 250)
    );
  }

  // ========== Form Validation Enhancement ==========
  function initFormValidation() {
    const forms = document.querySelectorAll(".needs-validation");

    forms.forEach((form) => {
      form.addEventListener(
        "submit",
        (event) => {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add("was-validated");
        },
        false
      );
    });
  }

  // ========== iOS Keyboard Fix ==========
  function initIOSKeyboardFix() {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (isIOS) {
      document.querySelectorAll("input, textarea, select").forEach((input) => {
        input.addEventListener("focus", () => {
          document.body.style.paddingBottom = "150px";
          setTimeout(() => {
            input.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 300);
        });

        input.addEventListener("blur", () => {
          document.body.style.paddingBottom = "0";
        });
      });
    }
  }

  // ========== Lazy Loading Enhancement ==========
  function initLazyLoading() {
    const images = document.querySelectorAll("img[data-src]");

    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.classList.add("loaded");
              img.removeAttribute("data-src");
              observer.unobserve(img);
            }
          });
        },
        {
          rootMargin: "50px 0px",
          threshold: 0.01,
        }
      );

      images.forEach((img) => imageObserver.observe(img));
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      images.forEach((img) => {
        img.src = img.dataset.src;
        img.classList.add("loaded");
      });
    }
  }

  // ========== Initialize All Functions ==========
  function init() {
    initSmoothScrolling();
    initMobileMenu();
    initMobileSidebar(); // Add this
    initFilterSidebar();
    initFormValidation();
    initIOSKeyboardFix();
    initLazyLoading();
  }

  // Run initialization
  init();

  // Re-initialize certain functions on window resize
  window.addEventListener(
    "resize",
    utils.debounce(() => {
      // Re-initialize responsive components if needed
    }, 250)
  );
});
