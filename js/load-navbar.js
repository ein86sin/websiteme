fetch("/html/navbar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar-placeholder").innerHTML = data;

    // تابع initNavbarAdmin رو تعریف کن
    if (typeof initNavbarAdmin === "function") {
      initNavbarAdmin();
    }
  })
  .catch(err => console.error("❌ Error loading navbar:", err));