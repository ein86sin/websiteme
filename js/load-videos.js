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

            const vid = document.createElement("video");
            vid.src = savedItem.fileUrl;
            vid.controls = true;
            item.appendChild(vid);

            container.appendChild(item);
        });
    });
});