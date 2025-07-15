// Tambahkan script ini di bagian bawah setiap halaman

(function() {
  "use strict";

  // Configuration
  const config = {
    rootMargin: "50px 0px",
    threshold: 0.01,
    fadeInDuration: 300
  };

  // Check connection speed
  function getConnectionSpeed() {
    const connection = navigator.connection || 
                      navigator.mozConnection || 
                      navigator.webkitConnection;
    
    if (!connection) return "unknown";
    
    const slowConnections = ["slow-2g", "2g"];
    return slowConnections.includes(connection.effectiveType) ? "slow" : "fast";
  }

  // Preload image
  function preloadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = reject;
      img.src = url;
    });
  }

  // Load image with fade effect
  async function loadImage(img) {
    const src = img.dataset.src;
    const lowSrc = img.dataset.srcLow;
    const connectionSpeed = getConnectionSpeed();
    
    // Use low quality image for slow connections
    const imageUrl = (connectionSpeed === "slow" && lowSrc) ? lowSrc : src;
    
    try {
      await preloadImage(imageUrl);
      img.style.opacity = "0";
      img.src = imageUrl;
      
      // Force reflow
      img.offsetHeight;
      
      // Fade in
      img.style.transition = `opacity ${config.fadeInDuration}ms ease-in-out`;
      img.style.opacity = "1";
      
      img.classList.add("loaded");
      delete img.dataset.src;
      if (lowSrc) delete img.dataset.srcLow;
    } catch (error) {
      console.error("Failed to load image:", error);
      img.classList.add("error");
    }
  }

  // Initialize lazy loading
  function initLazyLoading() {
    const images = document.querySelectorAll("img[data-src]");
    
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadImage(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, config);

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => loadImage(img));
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLazyLoading);
  } else {
    initLazyLoading();
  }

  // Export for use in other scripts
  window.lazyLoading = {
    init: initLazyLoading,
    loadImage: loadImage
  };
})();

// CSS untuk efek fade-in
const style = document.createElement("style");
style.textContent = `
    img {
        opacity: 1;
        transition: opacity 0.3s ease-in-out;
    }
    img[data-src] {
        opacity: 0;
    }
    img.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);
