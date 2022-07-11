import axios from "axios";
import cheerio from "cheerio";
import { v2_url } from "../../variables.js";

export const getMangaDetails = async (mangaId) => {
  const url = `${v2_url}/${mangaId}`;
  const { data } = await axios.get(url);
  let $ = cheerio.load(data);
  const details = {};
  const chapters = [];
  // title,alt_titles,authors,img_url,manga_id
  const titles_selector =
    "#wrapp_content_mc > div > div.container.row-a.background-b > div.wrapper_content.margin-top > div.col-xs-12.col-mb-12.info-content > div.info-title";
  const titles_elem = $(titles_selector);
  details["title"] = $("h1", titles_elem).text().trim();
  const alt_titles = $("h3", titles_elem).text().trim().split(";");
  details["alternative_titles"] = alt_titles;
  const img_selector =
    "#wrapp_content_mc > div > div.container.row-a.background-b > div.wrapper_content.margin-top > div.col-md-4.col-sm-4.info-img > img";
  details["img_url"] = $(img_selector).attr().src;
  const split_src = details.img_url.split("/");
  details["href"] = split_src[split_src.length - 1].split(".")[0];
  const authors_selector =
    "#wrapp_content_mc > div > div.container.row-a.background-b > div.wrapper_content.margin-top > div.col-xs-12.col-mb-12.info-content > div.info-c.clearfix > div.col.box-des > div:nth-child(3) > span";
  const authors = [];
  $(authors_selector)
    .children()
    .each((authorIdx, authorElem) => {
      const author = {};
      const author_elem = $(authorElem);
      author.name = author_elem.text().trim();
      author.href = author_elem.attr().href.replace("/", "");
      authors.push(author);
    });
  details["authors"] = authors.length > 0 ? authors : null;
  const chapters_selector =
    "#wrapp_content_mc > div > div.container.row-a.background-b > div.wrapper_content.margin-top > div:nth-child(7) > div.list-chapter.scrollbar-primary > table > tbody";
  $(chapters_selector)
    .children()
    .each((chapterIdx, chapterElem) => {
      const chapter = {};
      const title_elem = $(".name > a", chapterElem);
      chapter["upload_date"] = $(".date-updated", chapterElem).text().trim();
      chapter["chap_title"] = title_elem.html().split("</span>")[1];
      const split_href = title_elem.attr().href.split("/");
      chapter["chap_num"] = split_href[split_href.length - 1];
      chapters.push(chapter);
    });
  return { details, chapters };
};
