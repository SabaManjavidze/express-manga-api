import express from "express";
import cors from "cors";
import RouterV1 from "./routes/api/v1/api.js";
import RouterV2 from "./routes/api/v2/api.js";
// import { getHomePage } from "./utils/getHomePage.js";
// import { getMangaPreview } from "./utils/getMangaPreview.js";
// import { getMangaDetails } from "./utils/getMangaDetails.js";

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send(
    "Welcome To Hisashiburi Api. If you are not owner of this website fuck you"
  );
});
app.use("/api/v1", RouterV1);
app.use("/api/v2", RouterV2);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`server darbis dzmao port : ${port}`);
});
