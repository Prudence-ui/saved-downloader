import express from "express";
import cors from "cors";
import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

const app = express();
app.use(cors());
app.use(express.json());

const YTDLP_PATH = path.resolve("backend/bin/yt-dlp");

app.post("/download", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL manquante" });

    const tempFile = path.join(os.tmpdir(), `video-${Date.now()}.mp4`);

    const args = [
      url,
      "-o", tempFile,
      "-f", "bv*[vcodec^=avc1]+ba[acodec^=mp4a]/b[ext=mp4]/best",
      "--merge-output-format", "mp4",
      "--no-playlist"
    ];

    execFile(YTDLP_PATH, args, async (err) => {
      if (err) {
        console.error("YT-DLP ERROR:", err);
        return res.status(500).json({ error: "Erreur téléchargement" });
      }

      res.setHeader("Content-Type", "video/mp4");
      res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');

      const stream = fs.createReadStream(tempFile);
      stream.pipe(res);

      stream.on("close", () => {
        fs.unlink(tempFile, () => {});
      });
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erreur téléchargement" });
  }
});

app.listen(3001, () => console.log("Backend running on port 3001"));
