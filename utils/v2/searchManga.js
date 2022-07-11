import cheerio from "cheerio";
import axios from "axios";
import { v2_url } from "../../variables.js";
import { cleanStr } from "../v1/index.js";

export const searchManga = async (query, limit) => {
  const url = `${v2_url}/advanced-search.html?keyword=${query}&orderby=2`;
  // console.log(url);
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const arr = [];
  const keys = ["author", "last_updated", "views"];
  const result_item_sel =
    "#wrapp_content_mc > div > div.container.row-a.background-b > div.col-md-8.wrapper_content.margin-top > div:nth-child(6) > ul > li";
  console.log($(result_item_sel).children().length);
  $(result_item_sel).each((parentIdx, parentElem) => {
    // if (limit && parentIdx >= limit) return;
    const obj = {};
    const slugStr = $(".wrapper_imgage > a", parentElem).attr().href.split("/");
    obj["manga_id"] = slugStr[slugStr.length - 1];
    obj["img_url"] = $(".wrapper_imgage > a > img ", parentElem).attr().src;
    obj["title"] = $(".info-manga > .name-manga", parentElem).text().trim();

    const chapters = [];

    $(".info-manga > .name-chapter ", parentElem).each(
      (childIdx, childElem) => {
        const chap_obj = {};

        const chap_str = $(childElem).attr().href.split("/");
        chap_obj["chap_num"] = chap_str[chap_str.length - 1];
        chap_obj["href"] = chap_str[chap_str.length - 2];
        chap_obj["chap_title"] = $("span", childElem).text().trim();
        chap_obj["upload_date"] = $(".date_created", childElem).text().trim();

        chapters.push(chap_obj);
      }
    );

    // const object = {};
    // const details = [];
    // $("span", parentElem).each((childIdx, childElem) => {
    //   const str = $(childElem).text().replace("\n", "");
    //   object[keys[childIdx]] = cleanStr($(childElem).text().split(": ")[1]);
    // });
    // details.push(object);
    // obj["details"] = details;
    obj["chapters"] = chapters;

    arr.push(obj);
  });
  return arr;
};
