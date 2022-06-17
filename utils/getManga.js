import cheerio from "cheerio";
import axios from "axios";
import { main_url } from "./variables.js";
import { cleanStr } from "./index.js";

export const getManga = async (query, limit) => {
  const { data } = await axios.get(`${main_url}/search/${query}`);
  const $ = cheerio.load(data);
  const arr = [];
  const keys = ["author", "last_updated", "views"];
  $(".story_item").each((parentIdx, parentElem) => {
    if (limit && parentIdx >= limit) return;
    const obj = {};
    const slugStr = $("a", parentElem).attr().href.split("/");
    obj["manga_id"] = slugStr[slugStr.length - 1];
    obj["title"] = $(".story_item_right > .story_name", parentElem)
      .text()
      .trim();
    obj["img_url"] = $("a > img ", parentElem).attr().src;

    const chapters = [];

    $(".story_chapter ", parentElem).each((childIdx, childElem) => {
      const chap_obj = {};
      const chap_main_node = $("a", childElem);

      const chap_str = chap_main_node.attr().href.split("/");
      chap_obj["chap_num"] = chap_str[chap_str.length - 1].split("-")[1];

      chap_obj["chap_title"] = chap_main_node.text().trim();

      chapters.push(chap_obj);
    });

    const object = {};
    const details = [];
    $("span", parentElem).each((childIdx, childElem) => {
      const str = $(childElem).text().replace("\n", "");
      object[keys[childIdx]] = cleanStr($(childElem).text().split(": ")[1]);
    });
    details.push(object);
    obj["details"] = details;
    obj["chapters"] = chapters;

    arr.push(obj);
  });
  return arr;
};
