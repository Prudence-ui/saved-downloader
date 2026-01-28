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

  const file = path.join(os.tmpdir(), `video-${Date.now()}.mp4`);

  try {
    const subprocess = ytdlp.exec(url, {
      output: file,

      format: "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/best",

      mergeOutputFormat: "mp4",

      noWarnings: true,
      quiet: true
    });

    await subprocess;

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');

    const stream = fs.createReadStream(file);
    stream.pipe(res);

    stream.on("close", () => fs.unlink(file, () => {}));

  } catch (err) {
    console.error("YT ERROR:", err);
    res.status(500).json({ error: "Erreur téléchargement" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Backend running on", PORT));
