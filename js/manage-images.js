document.addEventListener("DOMContentLoaded", () => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) return;

    document.querySelectorAll(".card").forEach(card => {
        const section = card.dataset.section;

        const addBtn = document.createElement("button");
        addBtn.textContent = "+";
        addBtn.classList.add("add-content-btn");
        card.appendChild(addBtn);

        addBtn.addEventListener("click", () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.click();

            input.addEventListener("change", async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("file", file);
                formData.append("section", section);

                const res = await fetch(`http://localhost:4000/api/upload`, {
                    method: "POST",
                    body: formData,
                });
                const savedItem = await res.json();

                const container = card.querySelector(".card-img");
                const item = document.createElement("div");
                item.classList.add("uploaded-item");

                const img = document.createElement("img");
                img.src = savedItem.fileUrl;
                item.appendChild(img);

                const delBtn = document.createElement("button");
                delBtn.textContent = "🗑";
                delBtn.addEventListener("click", async () => {
                    await fetch(`http://localhost:4000/api/item/${savedItem._id}`, { method: "DELETE" });
                    item.remove();
                });

                item.appendChild(delBtn);
                container.appendChild(item);
            });
        });

        // لود عکس‌های قبلی
        (async () => {
            const res = await fetch(`http://localhost:4000/api/items/${section}`);
            const items = await res.json();
            const container = card.querySelector(".card-img");

            items.forEach(savedItem => {
                const item = document.createElement("div");
                item.classList.add("uploaded-item");

                const img = document.createElement("img");
                img.src = savedItem.fileUrl;
                item.appendChild(img);

                const delBtn = document.createElement("button");
                delBtn.textContent = "🗑";
                delBtn.addEventListener("click", async () => {
                    await fetch(`http://localhost:4000/api/item/${savedItem._id}`, { method: "DELETE" });
                    item.remove();
                });

                item.appendChild(delBtn);
                container.appendChild(item);
            });
        })();
    });
});
