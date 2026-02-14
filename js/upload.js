document.addEventListener("DOMContentLoaded", async () => {
  // نقشه اسم کارت‌ها به بخش در سرور
  const sections = {
    "نسخ": "neskh",
    "کالیگرافی": "caligraphy",
    "شکسته": "shekasteh",
    "نستعلیق": "nastaliq"
  };

  document.querySelectorAll(".card").forEach(async (card) => {
    const cardTitle = card.textContent.trim();
    const section = sections[cardTitle];
    if (!section) return;

    const container = card.querySelector(".card-img");

    try {
      const res = await fetch(`http://localhost:4000/api/items/${section}`);
      if (!res.ok) throw new Error("Error loading items");
      const items = await res.json();

      items.forEach((item) => {
        const div = document.createElement("div");
        div.classList.add("uploaded-item");

        if (item.type === "image") {
          const img = document.createElement("img");
          img.src = `http://localhost:4000${item.fileUrl}`;
          div.appendChild(img);
        } else {
          const vid = document.createElement("video");
          vid.src = `http://localhost:4000${item.fileUrl}`;
          vid.controls = true;
          div.appendChild(vid);
        }

        container.appendChild(div);
      });
    } catch (err) {
      console.error(`❌ Error loading ${cardTitle} items:`, err);
    }
  });
});
