// =========================
// ساعت و تاریخ سیستم
// =========================
const clockDiv = document.getElementById("clock");

function updateClock() {
  const now = new Date();

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  const timeString = `${hours}:${minutes}:${seconds}`;

  const dateString = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(now);

  clockDiv.textContent = `${timeString} - ${dateString}`;
}

setInterval(updateClock, 1000);
updateClock();


// =========================
// عکس پروفایل navbar (ادمین)
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const logoImg = document.querySelector(".logo img");
  const aboutData = JSON.parse(localStorage.getItem("aboutData"));

  if (logoImg && aboutData && aboutData.imgSrc) {
    logoImg.src = aboutData.imgSrc;

    // استایل آواتار
    logoImg.style.width = "50px";
    logoImg.style.height = "50px";
    logoImg.style.borderRadius = "50%";
    logoImg.style.objectFit = "cover";
  }
});
