import axios from "axios";
import cheerio from "cheerio";
import { main_url } from "./variables.js";

export const getHomePage = async (limit) => {
  const { data } = await axios.get(`${main_url}/home`);
  const $ = cheerio.load(data);
  const arr = [];

  $(".itemupdate").each((parentIdx, parentElem) => {
    if (limit && parentIdx >= limit) return;

    const obj = {};

    const slugStr = $("a", parentElem).attr().href.split("/");
    obj["manga_id"] = slugStr[slugStr.length - 1];

    const previewChaps = [];

    $("ul > li", parentElem).each((childIdx, childElem) => {
      const preview = {};
      if (childIdx == 0) {
        obj["title"] = $(childElem).text().trim();
      } else {
        preview["chap_title"] = $("span > a", childElem).text().trim();
        preview["upload_date"] = $("i", childElem).text().trim();
        previewChaps.push(preview);
      }
    });

    obj["chapters"] = previewChaps;

    arr.push(obj);
  });

  return arr;
};
