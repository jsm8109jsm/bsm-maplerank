const axios = require("axios");
const cheerio = require("cheerio");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let input = "";

rl.on("line", (line) => {
  input = line;
  rl.close();
});

rl.on("close", () => {
  getHtml(input);
});

const getHtml = async (nickname) => {
  const url = `https://maple.gg/u/${nickname}`;
  try {
    const html = await axios.get(url);
    let user = {};
    const $ = cheerio.load(html.data);
    const bodyList = $("div.user-profile");
    // console.log(bodyList)
    bodyList.map((i, element) => {
      user = {
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
    if (!!user) {
      console.log("userInfo : ", user);
      return;
    }
  } catch (error) {
    console.error(error);
  }
};
