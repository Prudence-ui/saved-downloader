import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// chemin ABSOLU cookies sur Render
const COOKIES_PATH = path.resolve("backend/cookies.txt");

app.post("/download", (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL manquante" });

  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');

  const yt = spawn("backend/bin/yt-dlp", [
    url,

    "--cookies", COOKIES_PATH,

    "-o", "-",

    "-f", "bv*[vcodec^=avc1]+ba[acodec^=mp4a]/b[ext=mp4]/best",

    "--merge-output-format", "mp4",

    "--no-warnings",
    "--quiet"
  ]);

  yt.stdout.pipe(res);

  yt.stderr.on("data", d => console.error("yt-dlp:", d.toString()));

  yt.on("error", err => {
    console.error("SPAWN ERROR:", err);
    res.status(500).end();
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Backend running on", PORT));
