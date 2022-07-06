import { Router } from "express";
import { getMangaChapter, getMangaDetails } from "../../../utils/v2/index.js";

const router = Router();
router.get("/:mangaId", async (req, res) => {
  const { mangaId } = req.params;
  const txt = await getMangaDetails(mangaId);
  res.send(txt);
});

router.get("/:mangaId/:chap", async (req, res) => {
  const { mangaId, chap } = req.params;
  const txt = await getMangaChapter(mangaId, chap);
  res.send(txt);
});
export default router;
// module.exports = { router };
