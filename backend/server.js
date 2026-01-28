import express from "express";
import cors from "cors";
import ytdlp from "yt-dlp-exec";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const YTDLP_PATH = path.join(__dirname, "bin", "yt-dlp");

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
      format:
        "bv*[vcodec^=avc1]+ba[acodec^=mp4a]/b[ext=mp4]/best",
      mergeOutputFormat: "mp4",

      concurrentFragments: 8,
      fragmentRetries: 5,
      retries: 5,

      postprocessorArgs: ["-movflags", "faststart"],
      noWarnings: true,
      quiet: true,

      // 🔥 IMPORTANT POUR RENDER
      binPath: YTDLP_PATH
    });

    stream.stdout.pipe(res);

    stream.stderr.on("data", d => console.log(d.toString()));

  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).json({ error: "Erreur téléchargement" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
