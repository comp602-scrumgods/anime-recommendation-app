import express, { Request, Response } from "express";
import cors from "cors";

console.log("Starting Anime API...");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/images", express.static("public/images"));


app.get("/", (_req: Request, res: Response) => {
  res.send("Anime API is running!");
});

app.get("/animes", (_req: Request, res: Response) => {
  const animeList = [
    { id: 1, title: "Attack on Titan", popularity: 2930630, image: "http://localhost:3000/images/aot.jpg" },
    { id: 2, title: "Jujutsu Kaisen", popularity: 1839539, image: "http://localhost:3000/images/jjk.jpg" },
    { id: 3, title: "Demon Slayer", popularity: 2230309, image: "http://localhost:3000/images/demon-slayer.jpg" },
    { id: 4, title: "One Punch Man", popularity: 2333128, image: "http://localhost:3000/images/opm.jpg" },
    { id: 5, title: "Sakamoto Days", popularity: 138058, image: "http://localhost:3000/images/sakamoto.jpg" },
    { id: 6, title: "Bleach", popularity: 1199405, image: "http://localhost:3000/images/bleach.jpg" },
    { id: 7, title: "Akame ga Kill!", popularity: 1363471, image: "http://localhost:3000/images/akame-ga-kill.jpg" },
    { id: 8, title: "Death Note", popularity: 2872509, image: "http://localhost:3000/images/death-note.jpg" },
    { id: 9, title: "Dr. Stone", popularity: 1119653, image: "http://localhost:3000/images/dr-stone.jpg" },
    { id: 10, title: "Horimiya", popularity: 917496, image: "http://localhost:3000/images/horimiya.jpg" },
    { id: 11, title: "Salaryman's Club", popularity: 30683, image: "http://localhost:3000/images/salary-man.jpg" },
    { id: 12, title: "Tokyo Ghoul", popularity: 1935573, image: "http://localhost:3000/images/tokyo-ghoul.jpg"  },
    { id: 13, title: "Spy X Family", popularity: 1067405, image: "http://localhost:3000/images/spyxfamily.jpg" },
    { id: 14, title: "One Piece", popularity: 1435869, image: "http://localhost:3000/images/one-piece.jpg" },
  ];
  res.json(animeList);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
