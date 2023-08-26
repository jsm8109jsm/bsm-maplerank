const axios = require("axios");
const cheerio = require("cheerio");
const readline = require("readline");
require("dotenv").config(); // dotenv 설정
const {
  BsmOauth,
  BsmOauthError,
  BsmOauthErrorType,
  BsmUserRole,
  BsmStudentResource,
  BsmTeacherResource,
} = require("bsm-oauth");

const express = require("express");
const app = express();
const port = 3000;
let userInfo = {};

app.get("/api/search", async (req, res) => {
  await getHtml(req.query.nickname);
  res.json(userInfo);
});

app.listen(port, () => {
  console.log(`server is listening at localhost:3000`);
});

const bsmOauth = new BsmOauth(
  process.env.BSM_AUTH_CLIENT_ID,
  process.env.BSM_AUTH_CLIENT_SECRET
);

// console.log(process.env.BSM_AUTH_CLIENT_ID, process.env.BSM_AUTH_CLIENT_SECRET);

const getHtml = async (nickname) => {
  const url = `https://maple.gg/u/${nickname}`;
  try {
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);
    const bodyList = $("div.user-profile");
    bodyList.map((i, element) => {
      userInfo = {
        server: $(element)
          .find("div.user-detail li.user-summary-item:first-child")
          .text()
          .replace(/\s/g, ""),
        level: $(element)
          .find("div.user-detail li.user-summary-item:nth-child(2)")
          .text()
          .replace(/\s/g, ""),
        job: $(element)
          .find("div.user-detail li.user-summary-item:nth-child(3)")
          .text()
          .replace(/\s/g, ""),
        nickname: $(element)
          .find("div.user-detail h3 b.align-middle")
          .text()
          .replace(/\s/g, ""),
        imageUrl: $(element).find("img.character-image").attr("src"),
      };
    });

    const muleng = $("div.col-lg-3.col-6.mt-3.px-1:first-child");
    muleng.map((i, element) => {
      userInfo = {
        ...userInfo,
        muleng_floor: $(element)
          .find("h1.user-summary-floor.font-weight-bold")
          .text()
          .replace(/\s/g, ""),
        muleng_time: $(element)
          .find("small.user-summary-duration")
          .text()
          .replace(/\s/g, ""),
      };
    });
    if (Object.keys(userInfo).length !== 0) {
      console.log("userInfo : ", userInfo);
      return;
    }
    console.log("유저 정보가 없습니다");
  } catch (error) {
    console.error(error);
  }
};
