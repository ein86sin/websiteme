document.addEventListener("DOMContentLoaded", () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  
  document.querySelectorAll(".card").forEach((card) => {
    const section = card.dataset.section;

    // فقط اگر ادمین باشه دکمه + ساخته میشه
    if (isAdmin) {
      const addBtn = document.createElement("button");
      addBtn.textContent = "+";
      addBtn.classList.add("add-content-btn");
      card.appendChild(addBtn);

      addBtn.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*,video/*";
        input.click();

        input.addEventListener("change", async (e) => {
          const file = e.target.files[0];
          if (!file) return;

          const formData = new FormData();
          formData.append("file", file);
          formData.append("section", section);

          try {
            // ✅ اصلاح: آدرس نسبی
            const res = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });

            if (!res.ok) throw new Error(await res.text());
            const savedItem = await res.json();

            const container = card.querySelector(".card-img");
            const item = document.createElement("div");
            item.classList.add("uploaded-item");

            item.style.display = "flex";
            item.style.justifyContent = "center";
            item.style.alignItems = "center";
            item.style.position = "relative";
            item.style.marginTop = "10px";

            if (savedItem.type === "image") {
              const img = document.createElement("img");
              // ✅ اصلاح: آدرس نسبی
              img.src = savedItem.fileUrl;
              img.style.maxWidth = "100%";
              img.style.height = "auto";
              img.style.borderRadius = "12px";
              item.appendChild(img);
            } else {
              const vid = document.createElement("video");
              // ✅ اصلاح: آدرس نسبی
              vid.src = savedItem.fileUrl;
              vid.controls = true;
              vid.style.maxWidth = "100%";
              vid.style.height = "auto";
              vid.style.borderRadius = "12px";
              item.appendChild(vid);
            }

            // دکمه حذف
            const delBtn = document.createElement("button");
            delBtn.textContent = "🗑";
            delBtn.classList.add("delete-item-btn");
            delBtn.addEventListener("click", async () => {
              // ✅ اصلاح: آدرس نسبی
              await fetch(`/api/item/${savedItem._id}`, { method: "DELETE" });
              item.remove();
            });

            item.appendChild(delBtn);
            container.appendChild(item);
          } catch (err) {
            console.error("❌ Upload error:", err);
            alert("خطا در آپلود فایل!");
          }
        });
      });
    }

    // لود آیتم‌های قبلی
    (async () => {
      try {
        // ✅ اصلاح: آدرس نسبی
        const res = await fetch(`/api/items/${section}`);
        if (!res.ok) throw new Error("Failed to fetch items");
        const items = await res.json();
        const container = card.querySelector(".card-img");

        items.forEach((savedItem) => {
          const item = document.createElement("div");
          item.classList.add("uploaded-item");
          item.style.display = "flex";
          item.style.justifyContent = "center";
          item.style.alignItems = "center";
          item.style.position = "relative";
          item.style.marginTop = "10px";

          if (savedItem.type === "image") {
            const img = document.createElement("img");
            // ✅ اصلاح: آدرس نسبی
            img.src = savedItem.fileUrl;
            img.style.maxWidth = "100%";
            img.style.height = "auto";
            img.style.borderRadius = "12px";
            item.appendChild(img);
          } else {
            const vid = document.createElement("video");
            // ✅ اصلاح: آدرس نسبی
            vid.src = savedItem.fileUrl;
            vid.controls = true;
            vid.style.maxWidth = "100%";
            vid.style.height = "auto";
            vid.style.borderRadius = "12px";
            item.appendChild(vid);
          }

          // دکمه حذف فقط برای ادمین
          if (isAdmin) {
            const delBtn = document.createElement("button");
            delBtn.textContent = "🗑";
            delBtn.classList.add("delete-item-btn");
            delBtn.addEventListener("click", async () => {
              // ✅ اصلاح: آدرس نسبی
              await fetch(`/api/item/${savedItem._id}`, { method: "DELETE" });
              item.remove();
            });
            item.appendChild(delBtn);
          }

          container.appendChild(item);
        });
      } catch (err) {
        console.error("❌ Error loading content:", err);
      }
    })();
  });
});