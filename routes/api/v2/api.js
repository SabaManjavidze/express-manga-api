import { Router } from "express";
import { getHomePage, searchManga } from "../../../utils/v2/index.js";
import MangaRouter from "./manga.js";
const router = Router();

router.get("/homepage", async (req, res) => {
  const data = await getHomePage();
  res.send(data);
});
router.use("/manga", MangaRouter);
router.get("/search/:query", async (req, res) => {
  const { query } = req.params;
  const { limit } = req.query;
  const data = await searchManga(query, limit);
  res.send(data);
});
export default router;
