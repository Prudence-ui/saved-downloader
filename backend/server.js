import express from "express";
import cors from "cors";
import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/download", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL manquante" });

    const tempFile = path.join(os.tmpdir(), `video-${Date.now()}.mp4`);

    const args = [
      url,
      "-f",
      "bv*[vcodec^=avc1]+ba[acodec^=mp4a]/b[ext=mp4]/best",
      "--merge-output-format",
      "mp4",
      "-o",
      tempFile
    ];

    execFile("yt-dlp", args, async (err) => {
      if (err) {
        console.error("YT-DLP ERROR:", err);
        return res.status(500).json({ error: "Erreur téléchargement" });
      }

      res.download(tempFile, "video.mp4", () => {
        fs.unlink(tempFile, () => {});
      });
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Backend running on", PORT));
