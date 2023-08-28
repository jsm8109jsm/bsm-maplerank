const cheerio = require("cheerio");
const axios = require("axios");

const getHtml = async (nickname) => {
  const url = `https://maple.gg/u/${nickname}`;
  try {
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);
    const bodyList = $("div.user-profile");

    let userInfo = {}; // userInfo 객체를 함수 내부에서 생성

    bodyList.map((i, element) => {
      userInfo = {
        server: $(element)
          .find("div.user-detail li.user-summary-item:first-child")
          .text()
          .replace(/\s/g, ""),
        level: $(element)
          .find("div.user-detail li.user-summary-item:nth-child(2)")
          .text()
          .match(/\d+/g)[0],
        level_percent: $(element)
          .find("div.user-detail li.user-summary-item:nth-child(2)")
          .text()
          .match(/(\d+\.\d+)/g)[0],
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
          .match(/\d+/g, "")[0],
        muleng_minute: $(element)
          .find("small.user-summary-duration")
          .text()
          .match(/\d+/g, "")[0],
        muleng_second: $(element)
          .find("small.user-summary-duration")
          .text()
          .match(/\d+/g, "")[1],
      };
    });

    if (Object.keys(userInfo).length !== 0) {
      console.log("userInfo : ", userInfo);
      return userInfo; // userInfo 객체를 반환
    }
    console.log("유저 정보가 없습니다");
    return null; // 유저 정보가 없을 경우 null 반환
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = getHtml; // getHtml 함수만 내보냅니다.
