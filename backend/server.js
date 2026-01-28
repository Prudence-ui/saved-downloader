import express from "express";
import cors from "cors";
import fs from "fs";
import os from "os";
import path from "path";
import { spawn } from "child_process";

const app = express();
app.use(cors());
app.use(express.json());

const YTDLP = path.resolve("backend/bin/yt-dlp");
const COOKIES = path.resolve("backend/cookies.txt");

app.post("/download", (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL manquante" });

  const output = path.join(os.tmpdir(), `video-${Date.now()}.mp4`);

  const args = [
    url,
    "--cookies", COOKIES,
    "-f", "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/best",
    "--merge-output-format", "mp4",
    "-o", output,
    "--no-warnings",
    "--quiet"
  ];

  const proc = spawn(YTDLP, args);

  proc.on("close", code => {
    if (code !== 0) {
      console.error("yt-dlp failed", code);
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
