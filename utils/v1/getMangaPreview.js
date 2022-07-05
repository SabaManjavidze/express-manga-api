import axios from "axios";
import FormData from "form-data";

export const getMangaPreview = async (query) => {
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
};
