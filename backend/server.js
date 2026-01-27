import express from "express";
import cors from "cors";
import ytdlp from "yt-dlp-exec";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/download", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL manquante" });
    }

    res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');
    res.setHeader("Content-Type", "video/mp4");

    const stream = ytdlp.exec(url, {
  output: "-",

  // meilleur format rapide et compatible
  format: "bv*[vcodec^=avc1]+ba[acodec^=mp4a]/b[ext=mp4]/best",

  mergeOutputFormat: "mp4",

  // accélération massive
  concurrentFragments: 8,
  retries: 5,
  fragmentRetries: 5,

  // pas de traitement inutile
  postprocessorArgs: ["-movflags", "faststart"],

  noWarnings: true,
  quiet: true
});

    stream.stdout.pipe(res);

  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).json({ error: "Erreur téléchargement" });
  }
});

app.listen(3001, () => {
  console.log("Backend running on port 3001");
});
