const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios").default;
var FormData = require("form-data");

const app = express();
const cors = require("cors");

const main_url = "https://ww.mangakakalot.tv";
app.use(cors());

app.get("/", (req, res) => {
  res.send(
    "Welcome To Sashiburi Api. If you are not owner of this website fuck you"
  );
});
async function getHomePage() {
  const html = await axios.get(`${main_url}/home`);
  const $ = cheerio.load(html.data);
  const arr = [];
  $(".itemupdate").each((parentIdx, parentElem) => {
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
}
app.get("/api/homepage", async (req, res) => {
  const arr = await getHomePage();
  res.json(arr);
});
async function getMangaDetails(manga_id) {
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
}
app.get("/api/manga/:mangaId", async (req, res) => {
  const { mangaId } = req.params;
  const txt = await getMangaDetails(mangaId);
  res.send(txt);
});

async function getMangaChapter(manga_id, chap) {
  const { data } = await axios({
    method: "GET",
    url: `${main_url}/chapter/${manga_id}/chapter-${chap}`,
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
}
app.get("/api/manga/:mangaId/:chap", async (req, res) => {
  const { mangaId, chap } = req.params;
  const txt = await getMangaChapter(mangaId, chap);
  res.send(txt);
});
async function getMangaPreview(query) {
  var search = new FormData();
  search.append("searchword", query);

  const { data } = await axios({
    method: "post",
    url: `https://manganato.com/getstorysearchjson/`,
    headers: {
      ...search.getHeaders(),
    },
    data: search,
  });
  const data_arr = [];
  data.map((child) => {
    const obj = {};
    obj["title"] = child.name.replace(/(<([^>]+)>)/gi, "");
    const word_list = child.link_story.split("/");
    obj["manga_id"] = word_list[word_list.length - 1];
    obj["author"] = child.author;
    obj["chapters"] = child.lastchapter;
    data_arr.push(obj);
  });
  return data_arr;
}
function cleanStr(str) {
  while (str.indexOf("\n") > -1) {
    str = str.replace("\n", " ");
  }
  while (str.indexOf("  ") > -1) {
    str = str.replace("  ", " ");
  }
  return str;
}
app.get("/api/searchstory/:query", async (req, res) => {
  const { query } = req.params;
  const arr = await getMangaPreview(query);
  res.json(arr);
});
const getManga = async (query) => {
  const { data } = await axios.get(`${main_url}/search/${query}`);
  const $ = cheerio.load(data);
  const arr = [];
  const keys = ["author", "upload_date", "views"];
  $(".story_item").each((parentIdx, parentElem) => {
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
      object[keys[childIdx]] = cleanStr($(childElem).text());
    });
    details.push(object);
    obj["details"] = details;
    obj["chapters"] = chapters;

    arr.push(obj);
  });
  return arr;
};

app.get("/api/search/:query", async (req, res) => {
  const { query } = req.params;
  const arr = await getManga(query);
  res.json(arr);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`server darbis dzmao port : ${port}`);
});
