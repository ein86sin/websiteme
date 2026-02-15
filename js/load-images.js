document.addEventListener("DOMContentLoaded", async () => {
    document.querySelectorAll(".card").forEach(async card => {
        const section = card.dataset.section;
        const container = card.querySelector(".card-img");

        // ✅ اصلاح: آدرس نسبی
        const res = await fetch(`/api/items/${section}`);
        const items = await res.json();

        items.forEach(savedItem => {
            const item = document.createElement("div");
            item.classList.add("uploaded-item");

            const img = document.createElement("img");
            img.src = savedItem.fileUrl;
            item.appendChild(img);

            container.appendChild(item);
        });
    });
});