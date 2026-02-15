import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ CORS کامل
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ اضافه کردن پوشه js به مسیرهای استاتیک (برای ۱۶ تا فایل JS)
app.use("/js", express.static(path.join(__dirname, "js")));

// ==================== MIDDLEWARE احراز هویت ====================
const checkAdmin = (req, res, next) => {
  // اینجا می‌تونی از session، token یا هر روش دیگه استفاده کنی
  // برای سادگی، از هدر استفاده می‌کنیم
  const isAdmin = req.headers["x-admin-token"] === "admin123"; // نمونه ساده
  
  // یا می‌تونی از query parameter استفاده کنی
  // const isAdmin = req.query.admin === "true";
  
  if (isAdmin) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

// ==================== مسیرهای عمومی ====================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "index.html"));
});

// ✅ صفحه لاگین ادمین (بدون احراز)
app.get("/admin-login", (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "html", "login.html"));
});

// ✅ صفحه ادمین با محافظت
app.get("/admin", checkAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "html", "index.html"));
});

// ✅ API برای لاگین (اختیاری)
app.post("/api/admin-login", (req, res) => {
  const { username, password } = req.body;
  // اینجا چک کن با دیتابیس یا ثابت
  if (username === "admin" && password === "admin123") {
    res.json({ success: true, token: "admin123" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
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

// ==================== تنظیم Multer ====================
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

// ==================== APIهای مخصوص ادمین ====================
app.post("/api/upload", checkAdmin, upload.single("file"), async (req, res) => {
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

app.delete("/api/item/:id", checkAdmin, async (req, res) => {
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
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));