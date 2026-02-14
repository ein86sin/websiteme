document.addEventListener("DOMContentLoaded", async () => {
  document.querySelectorAll(".card").forEach(async (card, index) => {
    const section = `group-${index + 1}`;
    const container = card.querySelector(".card-img");

    try {
      const res = await fetch(`http://localhost:4000/api/items/${section}`);
      const items = await res.json();

      items.forEach(savedItem => {
        const item = document.createElement("div");
        item.classList.add("uploaded-item");

        const ext = savedItem.fileUrl.split(".").pop().toLowerCase();

        if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
          const img = document.createElement("img");
          img.src = savedItem.fileUrl;
          img.classList.add("uploaded-img");
          item.appendChild(img);
        } else if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext)) {
          const vid = document.createElement("video");
          vid.src = savedItem.fileUrl;
          vid.controls = true;
          vid.classList.add("uploaded-video");
          item.appendChild(vid);
        } else if (["pdf"].includes(ext)) {
          const iframe = document.createElement("iframe");
          iframe.src = savedItem.fileUrl;
          iframe.classList.add("uploaded-pdf");
          item.appendChild(iframe);
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
