const axios = require("axios");
const cheerio = require("cheerio");

const getHtml = async (nickname = "z1존짱지민") => {
  try {
    const html = await axios.get(`https://maple.gg/u/${nickname}`);
    let user = {};
    const $ = cheerio.load(html.data);
    const bodyList = $("div.user-profile");
    // console.log(bodyList)
    bodyList.map((i, element) => {
      user = {
        level: $(element)
          .find("div.user-detail li.user-summary-item:first-child")
          .text()
          .replace(/\s/g, ""),
        job: $(element)
          .find("div.user-detail li.user-summary-item:nth-child(2)")
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
      user = {
        ...user,
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
    console.log("userInfo : ", user);
  } catch (error) {
    console.error(error);
  }
};

getHtml();
