import axios from "axios";
import cheerio from "cheerio";
import { main_url } from "./variables.js";

export const getMangaDetails = async (manga_id) => {
  const url = `${main_url}/manga/${manga_id}`;
  //   console.log(url);
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const arr = [];
  const keys = ["chap_title", "view_count", "upload_date"];
  $(".chapter-list")
    .children()
    .each((parentIdx, parentElem) => {
      const obj = {};

      $(parentElem).children((childIdx, childElem) => {
        if (childIdx == 0) {
          const splited = $("span > a", childElem).attr().href.split("/");
          obj["chap_num"] = splited[splited.length - 1].split("-")[1];
        }
        obj[keys[childIdx]] = $(childElem).text().trim();
      });
      arr.push(obj);
    });
  const img_sel =
    "body > div.container > div.main-wrapper > div.leftCol > div.manga-info-top > div > img";
  const title_sel =
    "body > div.container > div.main-wrapper > div.leftCol > div.manga-info-top > ul > li:nth-child(1) > h1";
  const details = {};
  const img_url = $(img_sel).attr().src;
  const title = $(title_sel).text();
  details["img_url"] = img_url;
  details["title"] = title;
  details["manga_id"] = manga_id;
  return { details: details, chapters: arr };
};
