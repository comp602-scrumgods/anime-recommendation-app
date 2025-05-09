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
    { id: 1, title: "Attack on Titan", popularity: 2930630 },
    { id: 2, title: "Jujutsu Kaisen", popularity: 1839539 },
    { id: 3, title: "Demon Slayer", popularity: 2230309 },
    { id: 4, title: "One Punch Man", popularity: 2333128 },
    { id: 5, title: "Sakamoto Days", popularity: 138058 },
    { id: 6, title: "Bleach", popularity: 1199405 },
    { id: 7, title: "Akame ga Kill!", popularity: 1363471 },
    { id: 8, title: "Death Note", popularity: 2872509 },
    { id: 9, title: "Dr. Stone", popularity: 1119653  },
    { id: 10, title: "Horimiya", popularity: 917496 },
    { id: 11, title: "Salaryman's Club", popularity: 30683 },
    { id: 12, title: "Tokyo Ghoul", popularity: 1935573  },
    { id: 13, title: "Spy X Family", popularity: 1067405 },
    { id: 14, title: "One Piece", popularity: 1435869 },
  ];
  res.json(animeList);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
