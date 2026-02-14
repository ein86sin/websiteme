fetch("/public/html/navbar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar-placeholder").innerHTML = data;

    // ⭐️ این خط حیاتیه
    initNavbarAdmin();
  });
