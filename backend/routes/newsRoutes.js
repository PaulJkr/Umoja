const express = require("express");
const router = express.Router();
const { getAgricultureNews } = require("../controllers/newsController");

router.get("/", getAgricultureNews);

module.exports = router;
