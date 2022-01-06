const express = require("express")
const cheerio = require("cheerio")
const axios = require("axios").default

const app = express()
const cors = require("cors")

const main_url = "https://ww.mangakakalot.tv"
app.use(cors()); 



async function getHomePage(){
    const html = await axios.get(main_url)
    const $ = cheerio.load(html.data)
    const arr = []
    $(".itemupdate").each((parentIdx,parentElem)=>{
        const obj = {}
        const slugStr = $("a",parentElem).attr().href.split("/")
        obj["manga_id"]=slugStr[slugStr.length-1].split("-")[1]
        const previewChaps = []
        $("ul > li",parentElem).each((childIdx,childElem)=>{
            const preview = {}
            if(childIdx==0){
                obj["title"] = $(childElem).text().trim()
            }else{
                preview["chap_title"] = $("span",childElem).text().trim()
                preview["upload_date"] = $("i",childElem).text().trim()
                previewChaps.push(preview)
            }
        })
        obj["chapters"] = previewChaps
        
        arr.push(obj)
    })
    return arr
}
app.get("/api/homepage",async (req,res)=>{
    const arr = await getHomePage()
    res.json(arr)
})
async function getMangaDetails(manga_id){
    const {data} = await axios.get(`${main_url}/manga/manga-${manga_id}`)
    console.log(`${main_url}/manga/manga-${manga_id}`)
    const $ = cheerio.load(data)
    const arr = []
    const keys = [
        "chap_title",
        "view_count",
        "upload_date"
    ]
    $(".chapter-list").children().each((parentIdx,parentElem)=>{
        const obj = {}
        
        $(parentElem).children((childIdx,childElem)=>{
            if(childIdx==0){
                const splited = $("span > a",childElem).attr().href.split("/")
                obj["chapter_num"] = splited[splited.length-1].split("-")[1]
            }
            obj[keys[childIdx]] = $(childElem).text().trim()
        })
        arr.push(obj)
    })
    return arr;
}
app.get("/api/manga/:mangaId",async (req,res)=>{
    const {mangaId} = req.params
    const txt = await getMangaDetails(mangaId)
    res.send(txt)
    
})

async function getMangaChapter(manga_id,chap){
    const {data} = await axios({
        method:"GET",
        url:`${main_url}/chapter/manga-${manga_id}/chapter-${chap}`
    })
    const $ = cheerio.load(data)
    const arr = []
    $('.vung-doc').children().each((parentIdx,parentElem)=>{
        const src=parentElem.attribs["data-src"]
        arr.push({src:src})
    })
    return arr;
}
app.get("/api/manga/:mangaId/:chap",async (req,res)=>{
    const {mangaId,chap} = req.params
    const txt = await getMangaChapter(mangaId,chap)
    res.send(txt)

})
const getManga = async (query)=>{
    const {data} = await axios.get(`${main_url}/search/${query}`)
    const $ = cheerio.load(data)
    const arr = []
    const keys = [
        "author",
        "upload_date",
        "views"
    ]
    $(".story_item").each((parentIdx,parentElem)=>{
        const obj = {}
        const slugStr = $("a",parentElem).attr().href.split("/")
        obj["manga_id"]=slugStr[slugStr.length-1].split("-")[1]
        obj["title"] =  $(".story_item_right > .story_name",parentElem).text().trim()
        obj["img_url"]= $("a > img ",parentElem).attr().src

        const chapters = []

        $(".story_chapter ",parentElem).each((childIdx,childElem)=>{
            const chap_obj = {}
            const chap_main_node = $("a",childElem)
            
            const chap_str = chap_main_node.attr().href.split("/")
            chap_obj["chapter_num"] = chap_str[chap_str.length-1].split("-")[1]

            chap_obj["chap_title"] =chap_main_node.text().trim()

            chapters.push(chap_obj)
        })

        const object = {}
        const details = []
        $("span",parentElem).each((childIdx,childElem)=>{
            object[keys[childIdx]]=$(childElem).html().trim()
        })
        details.push(object)
        obj["details"] = details
        obj["chapters"] = chapters
        
        arr.push(obj)
    })
    return arr
}
app.get("/api/search/:query",async (req,res)=>{
    const {query} = req.params
    const arr = await getManga(query)
    res.json(arr)

})
const port = process.env.PORT||5000
app.listen(port,()=>{console.log(`server darbis dzmao port : ${port}`)})

