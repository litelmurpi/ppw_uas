// filepath: script/checkout.js
document.addEventListener("DOMContentLoaded", function() {
  "use strict";

  // Payment method handling
  const paymentMethods = {
    creditCard: document.getElementById("creditCardFields"),
    virtualAccount: document.getElementById("virtualAccountFields"),
    eWallet: document.getElementById("eWalletFields")
  };

  const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
  
  paymentRadios.forEach(radio => {
    radio.addEventListener("change", function() {
      // Hide all payment fields
      Object.values(paymentMethods).forEach(field => {
        if (field) {
          field.style.display = "none";
          field.querySelectorAll("input").forEach(input => {
            input.required = false;
          });
        }
      });

      // Show selected payment field
      const selectedField = paymentMethods[this.value];
      if (selectedField) {
        selectedField.style.display = "block";
        selectedField.querySelectorAll("input").forEach(input => {
          input.required = true;
        });
      }
    });
  });

  // Logo selection
  function setupLogoSelection(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const logos = container.querySelectorAll(".payment-logo");
    
    logos.forEach(logo => {
      logo.addEventListener("click", function() {
        logos.forEach(l => l.classList.remove("selected"));
        this.classList.add("selected");
      });
    });
  }

  setupLogoSelection("bank-logos");
  setupLogoSelection("ewallet-logos");

  // Form validation with SweetAlert
  const form = document.getElementById("checkoutForm");
  
  if (form && typeof Swal !== 'undefined') {
    form.addEventListener("submit", async function(event) {
      event.preventDefault();
      event.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      const totalAmount = document.getElementById("totalAmount").textContent;
      
      const result = await Swal.fire({
        title: "Konfirmasi Pesanan",
        html: `Anda akan melakukan pembayaran sebesar <strong>${totalAmount}</strong>.<br>Pastikan semua data sudah benar.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#F5A623",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Ya, Bayar Sekarang!",
        cancelButtonText: "Batal"
      });

      if (result.isConfirmed) {
        await Swal.fire({
          title: "Pembayaran Berhasil!",
          text: "Terima kasih, pesanan Anda sedang diproses.",
          icon: "success",
          confirmButtonColor: "#F5A623"
        });
        
        form.reset();
        window.location.href = "landing_page_login.html";
      }
    });
  }
});