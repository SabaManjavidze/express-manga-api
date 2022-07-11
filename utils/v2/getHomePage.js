import axios from "axios";
import cheerio from "cheerio";
import { cleanStr } from "../v1/index.js";
import { v1_url } from "../../variables.js";

export const getHomePage = async () => {
  const { data } = await axios.get(`${v1_url}/index.php`);

  const $ = cheerio.load(data);
  const manga_list = $(
    "#wrapp_content_mc > div > div.container.row-a.background-b > div.col-xs-12.wrapper_content.margin-top > div:nth-child(3) > ul"
  );
  const homePageJson = [];
  manga_list.children().each((parentIdx, parentElem) => {
    const manga_obj = {};
    const title_elem = $(".div_item > .info-manga > .name-manga", parentElem);
    const poster_elem = $(".div_item > .wrapper_imgage > a > img", parentElem);
    const chapters = [];
    $(".div_item > .info-manga > .name-chapter", parentElem).each(
      (chapterIdx, chapterElem) => {
        const chap_obj = {};
        chap_obj["chap_title"] = $("span", chapterElem).text();
        chap_obj["upload_date"] = cleanStr(
          $(".date_created", chapterElem).text().replace("new ", "").trim()
        );
        chapters.push(chap_obj);
      }
    );
    manga_obj["title"] = title_elem.text().trim();
    manga_obj["manga_id"] = title_elem.attr().href.replace(`${main_url}/`, "");
    manga_obj["img_url"] = poster_elem.attr().src;
    manga_obj["chapters"] = chapters;
    homePageJson.push(manga_obj);
  });
  return homePageJson;
};
