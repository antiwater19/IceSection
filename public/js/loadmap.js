// 초반 네이버지도 클라이언트를 환경변수로 사용하기위한 js파일일
fetch('/config')
    .then(res => res.json())
    .then(config => {
        const clientId = config.naverClientId;
        const script = document.createElement('script');
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
        script.onload = () => {

            // Habityually_icy_section_csv.js에서 가져오는 함수
            initMapFeatures();

            console.log("네이버 지도 API 로드 완료");
            //initMap(); // 지도를 초기화하는 함수 (main.js 등에서 정의되어야 함)
        };
        document.head.appendChild(script);
    })
    .catch(err => {
        console.error("지도 API 로드 실패", err);
    });

function initMap() {
    const map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(37.5665, 126.9780),
        zoom: 12
    });
}
