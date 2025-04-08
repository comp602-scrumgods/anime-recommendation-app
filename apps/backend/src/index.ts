import express, { Request, Response } from "express";
import cors from "cors";

console.log("Starting Anime API...");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Anime API is running!");
});

app.get("/animes", (_req: Request, res: Response) => {
  const animeList = [
    { id: 1, title: "Attack on Titan" },
    { id: 2, title: "Jujutsu Kaisen" },
    { id: 3, title: "Demon Slayer" },
  ];
  res.json(animeList);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
