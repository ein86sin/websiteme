document.addEventListener("DOMContentLoaded", () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  if (!isAdmin) return;

  document.querySelectorAll(".card").forEach((card, index) => {
    const section = `group-${index + 1}`;
    const container = card.querySelector(".card-img");

    // دکمه افزودن فایل
    const addBtn = document.createElement("button");
    addBtn.textContent = "+";
    addBtn.classList.add("add-content-btn");
    card.appendChild(addBtn);

    addBtn.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "*/*"; // هر فرمتی
      input.click();

      input.addEventListener("change", async e => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("section", section);

        try {
          const res = await fetch("http://localhost:4000/api/upload", {
            method: "POST",
            body: formData,
          });
          const savedItem = await res.json();

          renderItem(savedItem, container, section);
        } catch (err) {
          console.error("❌ خطا در آپلود فایل:", err);
        }
      });
    });

    // لود فایل‌های ذخیره‌شده قبلی
    (async () => {
      const res = await fetch(`http://localhost:4000/api/items/${section}`);
      const items = await res.json();
      items.forEach(savedItem => renderItem(savedItem, container, section));
    })();
  });
});

// تابع نمایش فایل در کارت
function renderItem(savedItem, container, section) {
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

  // دکمه حذف
  const delBtn = document.createElement("button");
  delBtn.textContent = "🗑";
  delBtn.classList.add("delete-btn");
  delBtn.addEventListener("click", async () => {
    await fetch(`http://localhost:4000/api/item/${savedItem._id}`, {
      method: "DELETE",
    });
    item.remove();
  });

  item.appendChild(delBtn);
  container.appendChild(item);
}
