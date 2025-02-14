const express = require('express');
const path = require("path");
// const fs = require("fs");
// const csv = require("csv-parser");


const app = express();
const port = 8080;

//app.use(express.static('GRADUATION_WORK_2025'));

// 정적 파일 서빙 (CSS, 이미지, JS 등)
app.use(express.static("public"));

// Home 페이지 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "views", "Habitually_icy_section_csv.html"));
});

// index 페이지 라우트
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.listen(port, () => {
    console.log(`서버 실행 중: http://localhost:${port}`);
});