import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ==================== میدلورها ====================
app.use(cors());
app.use(express.json());

// ==================== پوشه‌های استاتیک ====================
// برای فایل‌های عمومی (css, js, html, images)
app.use(express.static("public"));

// برای پوشه js جداگانه (اگه داری)
app.use("/js", express.static("js"));

// برای پوشه ادمین
app.use("/admin", express.static("admin"));

// برای فایل‌های آپلود شده
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==================== مسیرهای صفحه ====================

// صفحه اصلی (عمومی)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "index.html"));
});

// صفحه لاگین ادمین
app.get("/admin-login", (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "html", "login.html"));
});

// صفحه اصلی ادمین (با چک دستی توی فرانت‌اند)
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "html", "index.html"));
});

// ==================== اتصال به مونگو اطلس ====================
mongoose.connect("mongodb+srv://arfh86sdt_db_user:admin123@cluster0.vgyorgw.mongodb.net/rezomehDB")
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));

// ==================== مدل داده ====================
const ItemSchema = new mongoose.Schema({
  section: String,
  fileUrl: String,
  type: String
});
const Item = mongoose.model("Item", ItemSchema);

// ==================== تنظیم Multer برای آپلود ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// ==================== APIهای عمومی ====================
app.get("/api/items/:section", async (req, res) => {
  try {
    const items = await Item.find({ section: req.params.section }).sort({ _id: -1 });
    res.json(items);
  } catch (err) {
    console.error("Error loading items:", err);
    res.status(500).send("Error loading items");
  }
});

// ==================== APIهای ادمین ====================
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const { section } = req.body;
    const newItem = new Item({
      section,
      fileUrl: `/uploads/${req.file.filename}`,
      type: req.file.mimetype.startsWith("image") ? "image" : "video"
    });
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).send("Upload error");
  }
});

app.delete("/api/item/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).send("Error deleting item");
  }
});

// ==================== پورت ====================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));