import express from "express";
import cors from "cors";
import ytdlp from "yt-dlp-exec";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/download", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL manquante" });

    res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');
    res.setHeader("Content-Type", "video/mp4");

    const stream = ytdlp.exec(url, {
      output: "-",

      // format direct MP4 → pas besoin ffmpeg (important sur Render)
      format: "best[ext=mp4]/best",

      noWarnings: true,
      quiet: true,
    });

    stream.stdout.pipe(res);

  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).json({ error: "Erreur téléchargement" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
