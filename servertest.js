const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 8080;

// CORS 설정 (모든 도메인 허용)
app.use(cors());

// 서울시 포트홀 API 요청을 프록시 처리
app.get('/api/pothole', async (req, res) => {
    try {
        const API_URL = 'http://t-data.seoul.go.kr/apig/apiman-gateway/tapi/v2xPotholeInformation/1.0';
        const API_KEY = '3a17e9e8-d914-47e6-aa45-ee5441f8d45b'; // 여기에 네 API 키 입력
        const response = await axios.get(`${API_URL}?apikey=${API_KEY}`);

        res.json(response.data); // 받은 데이터를 그대로 클라이언트로 전달

    } catch (error) {
        console.error('API 요청 실패:', error.message);
        res.status(500).json({ error: '데이터를 가져올 수 없습니다.' });
    }
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`프록시 서버가 실행 중입니다: http://localhost:${PORT}`);
});
