import express from "express";
import cors from "cors";
import fs from "fs";
import os from "os";
import path from "path";
import ytdlp from "yt-dlp-exec";

const app = express();
app.use(cors());
app.use(express.json());

const YTDLP_PATH = path.resolve("backend/bin/yt-dlp");
const COOKIES_PATH = path.resolve("backend/cookies.txt");

app.post("/download", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL manquante" });

    const output = path.join(os.tmpdir(), `video-${Date.now()}.mp4`);

    await ytdlp(url, {
      binPath: YTDLP_PATH,
      cookies: COOKIES_PATH,

      output,

      format: "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/best",
      mergeOutputFormat: "mp4",

      noWarnings: true,
      quiet: true
    });

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');

    const stream = fs.createReadStream(output);
    stream.pipe(res);

    stream.on("close", () => fs.unlink(output, () => {}));

  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).json({ error: "Erreur téléchargement" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Backend running on", PORT);
});
