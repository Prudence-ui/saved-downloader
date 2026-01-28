import express from "express";
import cors from "cors";
import { execFile } from "child_process";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const YTDLP_PATH = path.resolve("backend/bin/yt-dlp");

app.post("/download", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL manquante" });

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');

    const args = [
      url,
      "-o", "-",
      "-f", "bv*[vcodec^=avc1]+ba[acodec^=mp4a]/b[ext=mp4]/best",
      "--merge-output-format", "mp4",
      "--no-playlist"
    ];

    const proc = execFile(YTDLP_PATH, args, { maxBuffer: 1024 * 1024 * 100 });

    proc.stdout.pipe(res);

    proc.stderr.on("data", d => console.error("yt-dlp:", d.toString()));

    proc.on("error", err => {
      console.error("EXEC ERROR:", err);
      res.status(500).end();
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erreur téléchargement" });
  }
});

app.listen(3001, () => console.log("Backend running on port 3001"));
