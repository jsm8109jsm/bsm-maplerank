const mongoose = require("mongoose");

const UserInfoModel = mongoose.model("user", {
  server: String,
  level: String,
  level_percent: String,
  job: String,
  nickname: String,
  imageUrl: String,
  muleng_floor: String,
  muleng_minute: String,
  muleng_second: String,
});

module.exports = UserInfoModel;
