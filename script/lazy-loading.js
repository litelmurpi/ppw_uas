// Tambahkan script ini di bagian bawah setiap halaman

document.addEventListener("DOMContentLoaded", function () {
  // Lazy loading untuk gambar
  const images = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add("loaded");
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
});

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
