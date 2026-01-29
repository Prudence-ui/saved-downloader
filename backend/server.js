import express from "express";
import cors from "cors";
import fs from "fs";
import os from "os";
import path from "path";
import { spawn } from "child_process";

const app = express();
app.use(cors());
app.use(express.json());

const YTDLP_FILE = path.join(process.cwd(), "bin", "yt-dlp");

app.post("/download", (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL manquante" });

  const output = path.join(os.tmpdir(), `video-${Date.now()}.mp4`);

  const args = [
    YTDLP_FILE,
    url,
    "-f",
    "bv*[height<=1080][ext=mp4]+ba[ext=m4a]/b[ext=mp4]/best",
    "--merge-output-format",
    "mp4",
    "--no-playlist",
    "-o",
    output
  ];

  const proc = spawn("python3", args);

  proc.on("close", (code) => {
    if (code !== 0) {
      console.log("yt-dlp failed");
      return res.status(500).json({ error: "Erreur téléchargement" });
    }

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');

    const stream = fs.createReadStream(output);
    stream.pipe(res);

    stream.on("close", () => fs.unlink(output, () => {}));
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Backend running on", PORT));
