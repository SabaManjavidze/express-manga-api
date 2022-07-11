import cheerio from "cheerio";
import axios from "axios";
import { v2_url } from "../../variables.js";

export const getMangaChapter = async (manga_id, chap) => {
  const url = `${v2_url}/${manga_id}/${chap}`;
  console.log(url);
  const { data } = await axios({
    method: "GET",
    url: url,
  });
  const $ = cheerio.load(data);
  const arr = [];
  $("#loadchapter > div.img > img")
    // .children()
    .each((parentIdx, parentElem) => {
      const src = parentElem.attribs["data-src"];
      arr.push({ src: src });
    });
  return arr;
};
