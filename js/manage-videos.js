// تابع ساخت آیتم ویدیو
function createVideoItem(savedItem, isAdmin) {
    const item = document.createElement("div");
    item.classList.add("uploaded-item");

    const vid = document.createElement("video");
    vid.src = savedItem.fileUrl;
    vid.controls = true;
    vid.style.maxWidth = "100%";
    vid.style.maxHeight = "100%";
    item.appendChild(vid);

    if (isAdmin) {
        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑";
        delBtn.classList.add("delete-item-btn");
        delBtn.addEventListener("click", async () => {
            try {
                await fetch(`/api/item/${savedItem._id}`, { method: "DELETE" });
                item.remove();
            } catch (err) {
                console.error("Delete error:", err);
            }
        });
        item.appendChild(delBtn);
    }

    return item;
}

// کد اصلی
document.addEventListener("DOMContentLoaded", () => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    document.querySelectorAll(".card").forEach(card => {
        const section = card.dataset.section;
        const container = card.querySelector(".card-img");

        // اضافه کردن دکمه + فقط برای ادمین
        if (isAdmin) {
            const addBtn = document.createElement("button");
            addBtn.textContent = "+";
            addBtn.classList.add("add-content-btn");
            card.appendChild(addBtn);

            addBtn.addEventListener("click", () => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "video/*";
                input.click();

                input.addEventListener("change", async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("section", section);

                    try {
                        const res = await fetch("/api/upload", {
                            method: "POST",
                            body: formData,
                        });
                        
                        if (!res.ok) throw new Error("Upload failed");
                        const savedItem = await res.json();

                        const item = createVideoItem(savedItem, isAdmin);
                        container.appendChild(item);
                    } catch (err) {
                        console.error("Upload error:", err);
                        alert("خطا در آپلود فایل");
                    }
                });
            });
        }

        // لود ویدیوهای قبلی
        (async () => {
            try {
                const res = await fetch(`/api/items/${section}`);
                if (!res.ok) throw new Error("Failed to load items");
                const items = await res.json();

                items.forEach(savedItem => {
                    const item = createVideoItem(savedItem, isAdmin);
                    container.appendChild(item);
                });
            } catch (err) {
                console.error("Error loading videos:", err);
            }
        })();
    });
});