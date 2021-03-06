import cheerio from "cheerio";
import axios from "axios";
import { v1_url } from "../../variables.js";

export const getMangaChapter = async (manga_id, chap) => {
  const { data } = await axios({
    method: "GET",
    url: `${v1_url}/chapter/${manga_id}/chapter-${chap}`,
  });
  const $ = cheerio.load(data);
  const arr = [];
  $(".vung-doc")
    .children()
    .each((parentIdx, parentElem) => {
      const src = parentElem.attribs["data-src"];
      arr.push({ src: src });
    });
  return arr;
};
