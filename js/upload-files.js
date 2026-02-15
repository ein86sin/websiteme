document.addEventListener("DOMContentLoaded", () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  if (!isAdmin) return;

  document.querySelectorAll(".card").forEach(card => {
    const section = card.dataset.section || "default";
    const container = card.querySelector(".card-img");

    // دکمه +
    const addBtn = document.createElement("button");
    addBtn.textContent = "+";
    addBtn.classList.add("add-content-btn");
    card.appendChild(addBtn);

    addBtn.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".ppt,.pptx,.doc,.docx,.xls,.xlsx,.one,.pdf,.jpg,.jpeg,.png,.mp4,.mov";
      input.click();

      input.addEventListener("change", async e => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("section", section);

        try {
          // ✅ اصلاح: آدرس نسبی
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData
          });
          const savedItem = await res.json();

          const item = document.createElement("div");
          item.classList.add("uploaded-item");

          if (file.type.startsWith("image/")) {
            const img = document.createElement("img");
            img.src = savedItem.fileUrl;
            item.appendChild(img);
          } else if (file.type.startsWith("video/")) {
            const video = document.createElement("video");
            video.src = savedItem.fileUrl;
            video.controls = true;
            item.appendChild(video);
          } else {
            const link = document.createElement("a");
            link.href = savedItem.fileUrl;
            link.textContent = file.name;
            link.target = "_blank";
            item.appendChild(link);
          }

          const delBtn = document.createElement("button");
          delBtn.textContent = "🗑";
          delBtn.addEventListener("click", async () => {
            // ✅ اصلاح: آدرس نسبی
            await fetch(`/api/item/${savedItem._id}`, { method: "DELETE" });
            item.remove();
          });

          item.appendChild(delBtn);
          container.appendChild(item);

        } catch (err) {
          console.error("❌ خطا در آپلود فایل:", err);
        }
      });
    });

    // لود فایل‌های قبلی
    (async () => {
      try {
        // ✅ اصلاح: آدرس نسبی
        const res = await fetch(`/api/items/${section}`);
        const items = await res.json();

        items.forEach(savedItem => {
          const item = document.createElement("div");
          item.classList.add("uploaded-item");

          if (savedItem.fileType?.startsWith("image/")) {
            const img = document.createElement("img");
            img.src = savedItem.fileUrl;
            item.appendChild(img);
          } else if (savedItem.fileType?.startsWith("video/")) {
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

          const delBtn = document.createElement("button");
          delBtn.textContent = "🗑";
          delBtn.addEventListener("click", async () => {
            // ✅ اصلاح: آدرس نسبی
            await fetch(`/api/item/${savedItem._id}`, { method: "DELETE" });
            item.remove();
          });

          item.appendChild(delBtn);
          container.appendChild(item);
        });
      } catch (err) {
        console.error("❌ خطا در لود فایل‌ها:", err);
      }
    })();

  });
});