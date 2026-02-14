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

                    const res = await fetch("http://localhost:4000/api/upload", {
                        method: "POST",
                        body: formData,
                    });
                    const savedItem = await res.json();

                    const item = createVideoItem(savedItem);
                    container.appendChild(item);
                });
            });
        }

        // لود ویدیوهای قبلی
        (async () => {
            const res = await fetch(`http://localhost:4000/api/items/${section}`);
            const items = await res.json();

            items.forEach(savedItem => {
                const item = createVideoItem(savedItem);
                container.appendChild(item);
            });
        })();
    });

    // تابع کمکی ساخت آیتم ویدیو با دکمه حذف
    function createVideoItem(savedItem) {
        const item = document.createElement("div");
        item.classList.add("uploaded-item");

        const vid = document.createElement("video");
        vid.src = savedItem.fileUrl;
        vid.controls = true;
        item.appendChild(vid);

        if (isAdmin) {
            const delBtn = document.createElement("button");
            delBtn.textContent = "🗑";
            delBtn.classList.add("delete-item-btn");
            delBtn.addEventListener("click", async () => {
                await fetch(`http://localhost:4000/api/item/${savedItem._id}`, { method: "DELETE" });
                item.remove();
            });
            item.appendChild(delBtn);
        }

        return item;
    }
});
