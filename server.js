import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

<<<<<<< HEAD
=======
// تنظیم مسیر dirname برای ESModules
>>>>>>> ef1e4b1c31be8b9e7709d9b880486d38b8e9ea51
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

<<<<<<< HEAD
app.use(cors());
=======
// ✅ فعال کردن CORS
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

>>>>>>> ef1e4b1c31be8b9e7709d9b880486d38b8e9ea51
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

<<<<<<< HEAD
// اتصال به مونگو اطلس
mongoose.connect("mongodb+srv://arfh86sdt_db_user:admin123@cluster0.vgyorgw.mongodb.net/rezomehDB")
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));

const ItemSchema = new mongoose.Schema({
  section: String,
  fileUrl: String,
  type: String
});
const Item = mongoose.model("Item", ItemSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

=======
// ✅ اتصال به MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/rezomehDB")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ مدل داده
const ItemSchema = new mongoose.Schema({
  section: String,
  fileUrl: String,
  type: String, // image | video
});
const Item = mongoose.model("Item", ItemSchema);

// ✅ تنظیم Multer برای آپلود فایل‌ها
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// 📤 آپلود فایل از ادمین
>>>>>>> ef1e4b1c31be8b9e7709d9b880486d38b8e9ea51
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const { section } = req.body;
    const newItem = new Item({
      section,
      fileUrl: `/uploads/${req.file.filename}`,
<<<<<<< HEAD
      type: req.file.mimetype.startsWith("image") ? "image" : "video"
=======
      type: req.file.mimetype.startsWith("image") ? "image" : "video",
>>>>>>> ef1e4b1c31be8b9e7709d9b880486d38b8e9ea51
    });
    await newItem.save();
    res.json(newItem);
  } catch (err) {
<<<<<<< HEAD
    res.status(500).send("Upload error");
  }
});

app.get("/api/items/:section", async (req, res) => {
  const items = await Item.find({ section: req.params.section }).sort({ _id: -1 });
  res.json(items);
});

app.delete("/api/item/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
=======
    console.error("❌ Upload Error:", err);
    res.status(500).send("Error uploading file.");
  }
});

// 📥 دریافت همه‌ی آیتم‌ها برای یک بخش خاص
app.get("/api/items/:section", async (req, res) => {
  try {
    const items = await Item.find({ section: req.params.section }).sort({ _id: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).send("Error loading items");
  }
});

// 🗑 حذف آیتم
app.delete("/api/item/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).send("Error deleting item");
  }
});

app.listen(4000, () => console.log("🚀 Server running on http://localhost:4000"));
>>>>>>> ef1e4b1c31be8b9e7709d9b880486d38b8e9ea51
