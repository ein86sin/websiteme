// document.addEventListener("DOMContentLoaded", () => {
//   // بررسی اینکه آیا مدیر لاگین کرده
//   const isAdmin = localStorage.getItem("isAdmin") === "true";

//   if (isAdmin) {
//     // ساخت دکمه + برای افزودن مطلب
//     const addButton = document.createElement("button");
//     addButton.textContent = "+";
//     addButton.title = "افزودن مطلب جدید";
//     addButton.classList.add("admin-add-btn");

//     // افزودن به بدنه یا هرجایی که خواستی
//     document.body.appendChild(addButton);

//     // رفتار کلیک روی دکمه
//     addButton.addEventListener("click", () => {
//       alert("🔹 بخش آپلود مطلب در حال توسعه است.");
//       // یا می‌تونی هدایتش کنی به صفحه مخصوص آپلود:
//       // window.location.href = "../html/upload.html";
//     });
//   }
// });

/////////////////////////////////////////////
// ساخت دکمه خروج
document.addEventListener("DOMContentLoaded", () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  if (!isAdmin && !window.location.href.includes("login.html")) {
    window.location.href = "/admin/html/login.html";
  }
});
