import express from "express";
import cors from "cors";
import fs from "fs";
import os from "os";
import path from "path";
import { spawn } from "child_process";

const app = express();
app.use(cors());
app.use(express.json());

const YTDLP_PATH =
  process.platform === "win32"
    ? path.join(process.cwd(), "bin", "yt-dlp.exe")
    : path.join(process.cwd(), "bin", "yt-dlp");

// Bloquer YouTube proprement (évite 0 octet & bugs)
function isYouTube(url) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

app.post("/download", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL manquante" });
  }

  if (isYouTube(url)) {
    return res.status(400).json({
      error: "YouTube non supporté pour le moment"
    });
  }

  const output = path.join(os.tmpdir(), `video-${Date.now()}.mp4`);

  const args = [
    url,
    "-f",
    "bv*[height<=1080][ext=mp4]+ba[ext=m4a]/b[ext=mp4]/best",
    "--merge-output-format",
    "mp4",
    "-o",
    output,
    "--no-playlist",
    "--no-warnings"
  ];

  console.log("Downloading:", url);

  const ytdlp = spawn(YTDLP_PATH, args);

  let errorOutput = "";

  ytdlp.stderr.on("data", d => {
    errorOutput += d.toString();
  });

  ytdlp.on("close", (code) => {
    if (code !== 0 || !fs.existsSync(output)) {
      console.error("yt-dlp error:", errorOutput);
      return res.status(500).json({ error: "Erreur téléchargement" });
    }

    const stats = fs.statSync(output);
    if (stats.size < 100000) {
      fs.unlinkSync(output);
      return res.status(500).json({ error: "Fichier vidéo invalide" });
    }

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');

    const stream = fs.createReadStream(output);
    stream.pipe(res);

    stream.on("close", () => {
      fs.unlink(output, () => {});
    });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
