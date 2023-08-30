require("dotenv").config(); // dotenv 설정
const getHtml = require("./utils/getHtml");
const mongoose = require("mongoose"); // mongoose를 사용하여 MongoDB 연결
const UserInfoModel = require("./models/userInfo"); // UserInfo 모델을 임포트

const express = require("express");
const app = express();
const port = 3000;
const { MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "bsm-maple-rank",
  })
  .then(() => console.log("mongodb connected"))
  .catch((error) => console.error(error));

app.get("/api/search", async (req, res) => {
  const userInfo = await getHtml(req.query.nickname);
  res.json(userInfo);
});

app.post("/api/rank", (req, res) => {
  const userInfo = req.body;
  if (userInfo !== null) {
    const newUser = new UserInfoModel(userInfo);
    newUser
      .save()
      .then(() => {
        console.log("데이터가 MongoDB에 성공적으로 저장되었습니다.");
        res.json(userInfo);
      })
      .catch((error) => {
        console.error("데이터 저장 중 오류 발생:", error);
        res.status(500).json({ error: "데이터 저장 중 오류 발생" });
      });
  } else {
    res.status(404).json({ error: "유저 정보를 찾을 수 없습니다." });
  }
});

const sortBy = {
  LEVEL: { level: -1, level_persent: -1 },
  MULENG: { muleng_floor: -1, muleng_minute: 1, muleng_second: 1 },
};

app.get("/api/rank", (req, res) => {
  UserInfoModel.find({})
    .sort(sortBy[req.query.sortBy])
    .then((result) => {
      console.log("정렬된 결과:");
      console.log(result);
      res.json(result);

      mongoose.connection.close();
    })
    .catch((error) => {
      console.error("데이터 저장 중 오류 발생:", error);
      res.status(500).json({ error: "데이터 저장 중 오류 발생" });
    });
});

app.listen(port, () => {
  console.log(`server is listening at localhost:3000`);
});
