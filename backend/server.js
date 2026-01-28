import express from "express";
import cors from "cors";
import fs from "fs";
import os from "os";
import path from "path";
import ytdlp from "yt-dlp-exec";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/download", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL manquante" });

  const filePath = path.join(os.tmpdir(), `video-${Date.now()}.mp4`);

  try {
    await ytdlp(url, {
      output: filePath,

      // ✅ ultra compatible (Render + YouTube Shorts + HD)
      format: "bv*[vcodec^=avc1]+ba[acodec^=mp4a]/b[ext=mp4]/best",

      mergeOutputFormat: "mp4",

      concurrentFragments: 5,

      noWarnings: true,
      quiet: true
    });

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

    stream.on("close", () => fs.unlink(filePath, () => {}));

  } catch (err) {
    console.error("YT-DLP FAILED:", err);
    res.status(500).json({ error: "Erreur téléchargement" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Backend running on", PORT));
