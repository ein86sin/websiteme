document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("caligraphy");

  try {
    const res = await fetch("http://localhost:4000/api/items/caligraphy");
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
    console.error("❌ Error loading caligraphy items:", err);
  }
});
