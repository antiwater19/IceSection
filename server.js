const express = require('express');
const path = require("path");
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

// 혹시모를 필요한 것들 
// const fs = require("fs");
// const csv = require("csv-parser");


const app = express();
const port = 8080;

// app.use(cors({
//     origin: '*', // 모든 출처 허용 옵션. true 를 써도 된다.
// }))

//app.use(express.static('GRADUATION_WORK_2025'));

// 정적 파일 서빙 (html, JS 등)
app.use(express.static("public"));

// img 폴더를 정적 폴더로 설정 (최상위에 있는 경우)
app.use('/img', express.static(path.join(__dirname, 'img')));

// 네이버지도api 클라이언트ID를 환경변수가지고 json으로 제공.
app.get('/config', (req, res) => {
    res.json({
        naverClientId: process.env.NAVER_MAP_CLIENTID,
        PotholeSeoulKey: process.env.DB_POTHOLE_SEOUL
    });
});

// Home 페이지 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "views", "Habitually_icy_section_csv.html"));
    //res.json({ navermapCLAID: process.env.NAVER_MAP_CLIENTID });
});

// 위험존 설정 페이지
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, "views", "dangerzonetest.html"));
// });


// index 페이지 라우트
app.get('/pothole', (req, res) => {
    res.sendFile(path.join(__dirname, "views", "pothole.html"));
});


// api 요청 테스트 http가 아닌 https
// fetch는 API요청 .then()은 
fetch('https://t-data.seoul.go.kr/apig/apiman-gateway/tapi/v2xPotholeInformation/1.0?apikey=' + process.env.DB_POTHOLE_SEOUL, {
    mode: 'no-cors'
})
    .then(response => response.json())
    .then(data => console.log(`api리퀘스트 잘 나오고있음`))
    .catch(error => console.error("CORS 문제 발생", error));

app.listen(port, () => {
    console.log(`서버 실행 중: http://localhost:${port}`);
});

console.log("dotenv testing :", process.env.NAVER_MAP_CLIENTID);