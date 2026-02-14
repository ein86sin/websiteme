document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".card").forEach(async card => {
    const section = card.dataset.section || "default";
    const container = card.querySelector(".card-img");

    try {
      const res = await fetch(`http://localhost:4000/api/items/${section}`);
      const items = await res.json();

      items.forEach(savedItem => {
        const item = document.createElement("div");
        item.classList.add("uploaded-item");

        // تشخیص نوع فایل
        if (savedItem.fileType.startsWith("image/")) {
          const img = document.createElement("img");
          img.src = savedItem.fileUrl;
          item.appendChild(img);
        } else if (savedItem.fileType.startsWith("video/")) {
          const video = document.createElement("video");
          video.src = savedItem.fileUrl;
          video.controls = true;
          item.appendChild(video);
        } else {
          const link = document.createElement("a");
          link.href = savedItem.fileUrl;
          link.textContent = savedItem.fileUrl.split("/").pop();
          link.target = "_blank";
          item.appendChild(link);
        }

        container.appendChild(item);
      });
    } catch (err) {
      console.error("❌ خطا در لود فایل‌ها:", err);
    }
  });
});
