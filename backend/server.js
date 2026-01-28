import express from "express";
import cors from "cors";
import { spawn } from "child_process";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/download", (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL manquante" });

    res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');
    res.setHeader("Content-Type", "video/mp4");

    const args = [
      url,

      // meilleure qualité vidéo + audio compatibles
      "-f",
      "bv*[vcodec^=avc1]+ba[acodec^=mp4a]/b[ext=mp4]/best",

      "--merge-output-format",
      "mp4",

      "-o",
      "-"
    ];

    const ytdlp = spawn("yt-dlp", args);

    ytdlp.stdout.pipe(res);

    ytdlp.stderr.on("data", d => {
      console.log("yt-dlp:", d.toString());
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur téléchargement" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Backend running on", PORT));
