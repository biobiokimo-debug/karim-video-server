import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// Cartella per i video finti
const OUTPUT_DIR = path.join(__dirname, "output");
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

// Endpoint semplice per test: GET /
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "karim-video-server is running" });
});

// Endpoint che simula la creazione di un video
app.post("/api/short-video", (req, res) => {
  try {
    const id = Date.now();
    const fakeVideoName = `video_${id}.mp4`;
    const fakeVideoPath = path.join(OUTPUT_DIR, fakeVideoName);

    // Invece di generare davvero un video, creiamo un file finto
    fs.writeFileSync(fakeVideoPath, "FAKE_VIDEO_CONTENT");

    const baseUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    const videoUrl = `${baseUrl}/videos/${fakeVideoName}`;

    res.json({
      success: true,
      videoUrl,
      message: "Video generated (fake) for testing"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Video generation failed" });
  }
});

// Servire i "video" dalla cartella output
app.use("/videos", express.static(OUTPUT_DIR));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`karim-video-server running on port ${PORT}`);
});
