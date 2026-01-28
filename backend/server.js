import express from "express";
import cors from "cors";
import { spawn } from "child_process";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/download", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL manquante" });

    res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');
    res.setHeader("Content-Type", "video/mp4");

    const ytdlp = spawn("yt-dlp", [
      url,
      "-f",
      "best[ext=mp4]/best",
      "-o",
      "-"
    ]);

    ytdlp.stdout.pipe(res);

    ytdlp.stderr.on("data", d => {
      console.log("yt-dlp:", d.toString());
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erreur téléchargement" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Backend running on", PORT));
