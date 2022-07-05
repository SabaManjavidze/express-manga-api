import express, { Router } from "express";
import mangaRouter from "./manga.js";
import {
  getHomePage,
  getMangaDetails,
  getMangaPreview,
  getMangaChapter,
  getManga,
} from "../../../utils/v1/index.js";
const router = Router();

router.get("/homepage", async (req, res) => {
  const arr = await getHomePage(req.query.limit);
  res.json(arr);
});
router.use("/manga", mangaRouter);

router.get("/searchstory/:query", async (req, res) => {
  const { query } = req.params;
  const arr = await getMangaPreview(query);
  res.json(arr);
});
router.get("/search/:query", async (req, res) => {
  const { query } = req.params;
  const { limit } = req.query;
  const arr = await getManga(query, limit);
  res.json(arr);
});
export default router;
