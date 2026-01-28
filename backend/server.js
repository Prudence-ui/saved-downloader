import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const YTDLP = path.resolve("backend/bin/yt-dlp");

app.post("/download", (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL manquante" });

  res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');
  res.setHeader("Content-Type", "video/mp4");

  const args = [
  url,
  "--cookies", "backend/cookies.txt",
  "-o", "-",
  "-f", "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/best",
  "--merge-output-format", "mp4",
  "--no-warnings",
  "--quiet"
];

  const ytdlp = spawn(YTDLP, args);

  ytdlp.stdout.pipe(res);

  ytdlp.stderr.on("data", data => {
    console.error("yt-dlp:", data.toString());
  });

  ytdlp.on("error", err => {
    console.error("SPAWN ERROR:", err);
    res.status(500).end();
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
