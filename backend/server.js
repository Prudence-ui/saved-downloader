import express from "express";
import cors from "cors";
import fs from "fs";
import os from "os";
import path from "path";
import { spawn } from "child_process";

const app = express();
app.use(cors());
app.use(express.json());

const YTDLP = path.join(process.cwd(), "bin", "yt-dlp");

app.post("/download", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL manquante" });

  const output = path.join(os.tmpdir(), `video-${Date.now()}.mp4`);

  const args = [
    url,

    // 🎯 FORCE formats compatibles partout
    "-f",
    "bv*[vcodec!=av01][ext=mp4]+ba[ext=m4a]/b[ext=mp4]/best",

    "--merge-output-format",
    "mp4",

    "--no-playlist",

    "-o",
    output
  ];

  console.log("Downloading:", url);

  const proc = spawn(YTDLP, args);

  proc.stderr.on("data", d => console.log(d.toString()));

  proc.on("error", err => {
    console.error("Spawn error:", err);
    res.status(500).json({ error: "yt-dlp error" });
  });

  proc.on("close", code => {
    if (code !== 0 || !fs.existsSync(output)) {
      console.log("Download failed");
      return res.status(500).json({ error: "Erreur téléchargement" });
    }

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');

    const stream = fs.createReadStream(output);
    stream.pipe(res);

    stream.on("close", () => fs.unlink(output, () => {}));
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Backend running on", PORT));
