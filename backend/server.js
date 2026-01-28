import express from "express";
import cors from "cors";
import path from "path";
import ytdlp from "yt-dlp-exec";

const app = express();
app.use(cors());
app.use(express.json());

const YTDLP_PATH = path.resolve("backend/bin/yt-dlp");

app.post("/download", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL manquante" });

  try {
    res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');
    res.setHeader("Content-Type", "video/mp4");

    const stream = ytdlp.exec(url, {
      binPath: YTDLP_PATH,
      output: "-",

      format: "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/best",
      mergeOutputFormat: "mp4",

      noWarnings: true,
      quiet: true
    });

    stream.stdout.pipe(res);

    stream.stderr.on("data", data => {
      console.error("yt-dlp:", data.toString());
    });

  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).json({ error: "Erreur téléchargement" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
