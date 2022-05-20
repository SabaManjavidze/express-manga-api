import express from "express";
import cors from "cors";
// import { getHomePage } from "./utils/getHomePage.js";
// import { getMangaPreview } from "./utils/getMangaPreview.js";
// import { getMangaDetails } from "./utils/getMangaDetails.js";
import {
  getHomePage,
  getMangaDetails,
  getMangaPreview,
  getMangaChapter,
  getManga,
} from "./utils/index.js";

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send(
    "Welcome To Hisashiburi Api. If you are not owner of this website fuck you"
  );
});
app.get("/api/homepage", async (req, res) => {
  const arr = await getHomePage(req.query.limit);
  res.json(arr);
});
app.get("/api/manga/:mangaId", async (req, res) => {
  const { mangaId } = req.params;
  const txt = await getMangaDetails(mangaId);
  res.send(txt);
});

app.get("/api/manga/:mangaId/:chap", async (req, res) => {
  const { mangaId, chap } = req.params;
  const txt = await getMangaChapter(mangaId, chap);
  res.send(txt);
});
app.get("/api/searchstory/:query", async (req, res) => {
  const { query } = req.params;
  const arr = await getMangaPreview(query);
  res.json(arr);
});
app.get("/api/search/:query", async (req, res) => {
  const { query } = req.params;
  const { limit } = req.query;
  const arr = await getManga(query, limit);
  res.json(arr);
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`server darbis dzmao port : ${port}`);
});
