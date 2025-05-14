// 초반 네이버지도 클라이언트를 환경변수로 사용하기위한 js파일일
fetch('/config')
    .then(res => res.json())
    .then(config => {
        const clientId = config.naverClientId;
        const script = document.createElement('script');
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
        script.onload = () => {

            initMapPothole();

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



function initMapPothole() {

    let userMarker; // 자기 위치 표시용 버튼을 위한 변수
    let PotholeSeoulKey = '';


    function fetchPotholeData() {

        fetch('/config')
            .then(res => res.json())
            .then(config => {
                PotholeSeoulKey = config.PotholeSeoulKey;

                return fetch(`https://t-data.seoul.go.kr/apig/apiman-gateway/tapi/v2xPotholeInformation/1.0?apikey=${PotholeSeoulKey}`);
            })
            .then(response => response.json()) // JSON 변환
            .then(data => {
                data.forEach((item) => {
                    let lat = item.vhcleLat; // 위도
                    let lon = item.vhcleLot; // 경도

                    // 지도에 마커 추가
                    const marker = new naver.maps.Marker({
                        position: new naver.maps.LatLng(lat, lon),
                        map: map
                    });
                    //console.log('잘 출력됬음'); // 디버깅 정상적으로 완료확인용코드.

                    const ImgUrl = "./img/doggy.jpg"
                    // 클릭하면 위도, 경도 표시하는 InfoWindow 생성

                    const infoWindow = new naver.maps.InfoWindow({

                        // 임시 방편 
                        // content: (() => {
                        //     let ImgUrl;

                        //     // 좌표별 이미지 설정
                        //     if (item.vhcleLat >= "37.4" && item.vhcleLat < "37.5" && item.vhcleLot >= "126.8" && item.vhcleLot < "126.9") {
                        //         ImgUrl = "https://potholeimg.s3.ap-northeast-2.amazonaws.com/%ED%8F%AC%ED%8A%B8%ED%99%80%20%EC%82%AC%EC%A7%84%EB%93%A4/37.507537%2C127.059324.jpg?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0yIkcwRQIgDDgK1SZVSkW1uRJlcr0eJAw9SnwwS6iWLYdhwg2PxV4CIQC%2FaBDfkGkI8W4r1S3gX7TszSuta0yIr809TDapTVQoeCrCAwiJ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4Mzc4MyIMaqjfXYP%2Bxy5%2B5JiVKpYDdoDk59Mg11Hn2elqQTNZ6RFiOtMZZRhG%2BpRFiGpO%2Fl4%2FoR74yd5vjiqp3JZ7ZVu9lpEvZSNrsbhqzLieSuGHA27WypdhklLwdsFg8A7wyKO%2BBomJVjA%2Bq5kiCHi63wtz1Nd7giumlmrrxLZCKAj6%2FM9qnuIWsCmC9meDmdyEHgMPRyxsOnabubSYPHKpw2CvD5zsOFtStWQ1mUn3zHaKquBSL0Nv6buZz0cllaaTjnv12%2FD75TAkj9WDy1BcvMu8%2FwK4ySgTCMpJphSfI%2F7K8orkiIxRGotQnEzzQh0Q8cEKwQPwICaIGwEwp5GllEvNGfZpLByb4lgsr79Om3NT9VJpfeCoPBm0Dljn4J6DNpEJvdeu%2B%2Ff69jTaHiKFRp2gnGypm7xhi25SSeWSEsyixiGbaz%2BBsrXdPR0V%2BMKUiknhvG4xZNUCfQ%2F5b412iDqV%2BASKRFIxcva3nsKoJLMCHzpXwsoOSIBKIf0WXKNG97MusCjpqQl%2B7uOiLVpKUr6mdOn02RtyRlkPW%2BghnTLuAH86bf1EwTCunfbABjreAn1E7NBor7%2FhQW3EF3EP0K%2BlnIivL4W%2Bg3ZfnAAQP%2Ft4TNKNWVSVRsN3NzgljbC2V123RFVxKVgNsPNJER2AxeoRAOls%2FpT74MGhnK4ckNY0yOy4jAlPGjwspig4N8wHRdp66q%2FJn60PbomcV7QZCQGIzirqi9rIy%2BsBogCv3XFVzCIILeELt%2Fsl6wD2g6%2FdlQmCq48YcvKlJIoJoNKbJHBNdeeAHK%2FkIY4l0rhu%2BI0FpIXi4%2BSEDl3b%2B648HW68fqnmX3VoX5mzBRXRvFho2S%2FGgBLiQz95uWXz2Ou8LNiaPHPliox3f7466olkGXpXxq%2BpQjMzSRzrueMV5iS20JSXsxiG5zj8a0308P4NdiQ%2BZkmWUmLw96zNOMPlnp0AyolwIBRuVaQ%2Fusywp%2BvB%2BORGkWBKI6jZarz9dBJu%2BA%2BSF2lq5oyly2cxY%2Fy74k6PjW%2BLWSQdd29vcixNSLSE&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAZI2LB46T3KIINTLQ%2F20250509%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250509T080534Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=59cf0775fb20fa8b61f39481b696222688a936d24915c3a660e53f4e356f04e4";
                        //     } else if (item.vhcleLat >= "37.5" && item.vhcleLat < "37.6" && item.vhcleLot >= "126.9" && item.vhcleLot < "127.0") {
                        //         ImgUrl = "https://potholeimg.s3.ap-northeast-2.amazonaws.com/%ED%8F%AC%ED%8A%B8%ED%99%80%20%EC%82%AC%EC%A7%84%EB%93%A4/37.509913%2C127.097514.jpg?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0yIkcwRQIgDDgK1SZVSkW1uRJlcr0eJAw9SnwwS6iWLYdhwg2PxV4CIQC%2FaBDfkGkI8W4r1S3gX7TszSuta0yIr809TDapTVQoeCrCAwiJ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4Mzc4MyIMaqjfXYP%2Bxy5%2B5JiVKpYDdoDk59Mg11Hn2elqQTNZ6RFiOtMZZRhG%2BpRFiGpO%2Fl4%2FoR74yd5vjiqp3JZ7ZVu9lpEvZSNrsbhqzLieSuGHA27WypdhklLwdsFg8A7wyKO%2BBomJVjA%2Bq5kiCHi63wtz1Nd7giumlmrrxLZCKAj6%2FM9qnuIWsCmC9meDmdyEHgMPRyxsOnabubSYPHKpw2CvD5zsOFtStWQ1mUn3zHaKquBSL0Nv6buZz0cllaaTjnv12%2FD75TAkj9WDy1BcvMu8%2FwK4ySgTCMpJphSfI%2F7K8orkiIxRGotQnEzzQh0Q8cEKwQPwICaIGwEwp5GllEvNGfZpLByb4lgsr79Om3NT9VJpfeCoPBm0Dljn4J6DNpEJvdeu%2B%2Ff69jTaHiKFRp2gnGypm7xhi25SSeWSEsyixiGbaz%2BBsrXdPR0V%2BMKUiknhvG4xZNUCfQ%2F5b412iDqV%2BASKRFIxcva3nsKoJLMCHzpXwsoOSIBKIf0WXKNG97MusCjpqQl%2B7uOiLVpKUr6mdOn02RtyRlkPW%2BghnTLuAH86bf1EwTCunfbABjreAn1E7NBor7%2FhQW3EF3EP0K%2BlnIivL4W%2Bg3ZfnAAQP%2Ft4TNKNWVSVRsN3NzgljbC2V123RFVxKVgNsPNJER2AxeoRAOls%2FpT74MGhnK4ckNY0yOy4jAlPGjwspig4N8wHRdp66q%2FJn60PbomcV7QZCQGIzirqi9rIy%2BsBogCv3XFVzCIILeELt%2Fsl6wD2g6%2FdlQmCq48YcvKlJIoJoNKbJHBNdeeAHK%2FkIY4l0rhu%2BI0FpIXi4%2BSEDl3b%2B648HW68fqnmX3VoX5mzBRXRvFho2S%2FGgBLiQz95uWXz2Ou8LNiaPHPliox3f7466olkGXpXxq%2BpQjMzSRzrueMV5iS20JSXsxiG5zj8a0308P4NdiQ%2BZkmWUmLw96zNOMPlnp0AyolwIBRuVaQ%2Fusywp%2BvB%2BORGkWBKI6jZarz9dBJu%2BA%2BSF2lq5oyly2cxY%2Fy74k6PjW%2BLWSQdd29vcixNSLSE&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAZI2LB46T3KIINTLQ%2F20250509%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250509T080729Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=56c94523179a1a37ec4adb49dd1973f85cb0d4d937b8bdacc326ae9494a7e9d4";
                        //     } else if (item.vhcleLat >= "37.6" && item.vhcleLat < "37.7" && item.vhcleLot >= "127.0" && item.vhcleLot < "127.1") {
                        //         ImgUrl = "https://potholeimg.s3.ap-northeast-2.amazonaws.com/%ED%8F%AC%ED%8A%B8%ED%99%80%20%EC%82%AC%EC%A7%84%EB%93%A4/37.511845%2C127.070411.jpg?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0yIkcwRQIgDDgK1SZVSkW1uRJlcr0eJAw9SnwwS6iWLYdhwg2PxV4CIQC%2FaBDfkGkI8W4r1S3gX7TszSuta0yIr809TDapTVQoeCrCAwiJ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4Mzc4MyIMaqjfXYP%2Bxy5%2B5JiVKpYDdoDk59Mg11Hn2elqQTNZ6RFiOtMZZRhG%2BpRFiGpO%2Fl4%2FoR74yd5vjiqp3JZ7ZVu9lpEvZSNrsbhqzLieSuGHA27WypdhklLwdsFg8A7wyKO%2BBomJVjA%2Bq5kiCHi63wtz1Nd7giumlmrrxLZCKAj6%2FM9qnuIWsCmC9meDmdyEHgMPRyxsOnabubSYPHKpw2CvD5zsOFtStWQ1mUn3zHaKquBSL0Nv6buZz0cllaaTjnv12%2FD75TAkj9WDy1BcvMu8%2FwK4ySgTCMpJphSfI%2F7K8orkiIxRGotQnEzzQh0Q8cEKwQPwICaIGwEwp5GllEvNGfZpLByb4lgsr79Om3NT9VJpfeCoPBm0Dljn4J6DNpEJvdeu%2B%2Ff69jTaHiKFRp2gnGypm7xhi25SSeWSEsyixiGbaz%2BBsrXdPR0V%2BMKUiknhvG4xZNUCfQ%2F5b412iDqV%2BASKRFIxcva3nsKoJLMCHzpXwsoOSIBKIf0WXKNG97MusCjpqQl%2B7uOiLVpKUr6mdOn02RtyRlkPW%2BghnTLuAH86bf1EwTCunfbABjreAn1E7NBor7%2FhQW3EF3EP0K%2BlnIivL4W%2Bg3ZfnAAQP%2Ft4TNKNWVSVRsN3NzgljbC2V123RFVxKVgNsPNJER2AxeoRAOls%2FpT74MGhnK4ckNY0yOy4jAlPGjwspig4N8wHRdp66q%2FJn60PbomcV7QZCQGIzirqi9rIy%2BsBogCv3XFVzCIILeELt%2Fsl6wD2g6%2FdlQmCq48YcvKlJIoJoNKbJHBNdeeAHK%2FkIY4l0rhu%2BI0FpIXi4%2BSEDl3b%2B648HW68fqnmX3VoX5mzBRXRvFho2S%2FGgBLiQz95uWXz2Ou8LNiaPHPliox3f7466olkGXpXxq%2BpQjMzSRzrueMV5iS20JSXsxiG5zj8a0308P4NdiQ%2BZkmWUmLw96zNOMPlnp0AyolwIBRuVaQ%2Fusywp%2BvB%2BORGkWBKI6jZarz9dBJu%2BA%2BSF2lq5oyly2cxY%2Fy74k6PjW%2BLWSQdd29vcixNSLSE&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAZI2LB46T3KIINTLQ%2F20250509%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250509T080801Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=5868fe4df5b98fcf807cea9452d8f458c5de9d7db1504febc48dc0f6194f9682";
                        //     } else {
                        //         ImgUrl = "https://potholeimg.s3.ap-northeast-2.amazonaws.com/%ED%8F%AC%ED%8A%B8%ED%99%80%20%EC%82%AC%EC%A7%84%EB%93%A4/37.512488%2C127.070321.jpg?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0yIkcwRQIgDDgK1SZVSkW1uRJlcr0eJAw9SnwwS6iWLYdhwg2PxV4CIQC%2FaBDfkGkI8W4r1S3gX7TszSuta0yIr809TDapTVQoeCrCAwiJ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4Mzc4MyIMaqjfXYP%2Bxy5%2B5JiVKpYDdoDk59Mg11Hn2elqQTNZ6RFiOtMZZRhG%2BpRFiGpO%2Fl4%2FoR74yd5vjiqp3JZ7ZVu9lpEvZSNrsbhqzLieSuGHA27WypdhklLwdsFg8A7wyKO%2BBomJVjA%2Bq5kiCHi63wtz1Nd7giumlmrrxLZCKAj6%2FM9qnuIWsCmC9meDmdyEHgMPRyxsOnabubSYPHKpw2CvD5zsOFtStWQ1mUn3zHaKquBSL0Nv6buZz0cllaaTjnv12%2FD75TAkj9WDy1BcvMu8%2FwK4ySgTCMpJphSfI%2F7K8orkiIxRGotQnEzzQh0Q8cEKwQPwICaIGwEwp5GllEvNGfZpLByb4lgsr79Om3NT9VJpfeCoPBm0Dljn4J6DNpEJvdeu%2B%2Ff69jTaHiKFRp2gnGypm7xhi25SSeWSEsyixiGbaz%2BBsrXdPR0V%2BMKUiknhvG4xZNUCfQ%2F5b412iDqV%2BASKRFIxcva3nsKoJLMCHzpXwsoOSIBKIf0WXKNG97MusCjpqQl%2B7uOiLVpKUr6mdOn02RtyRlkPW%2BghnTLuAH86bf1EwTCunfbABjreAn1E7NBor7%2FhQW3EF3EP0K%2BlnIivL4W%2Bg3ZfnAAQP%2Ft4TNKNWVSVRsN3NzgljbC2V123RFVxKVgNsPNJER2AxeoRAOls%2FpT74MGhnK4ckNY0yOy4jAlPGjwspig4N8wHRdp66q%2FJn60PbomcV7QZCQGIzirqi9rIy%2BsBogCv3XFVzCIILeELt%2Fsl6wD2g6%2FdlQmCq48YcvKlJIoJoNKbJHBNdeeAHK%2FkIY4l0rhu%2BI0FpIXi4%2BSEDl3b%2B648HW68fqnmX3VoX5mzBRXRvFho2S%2FGgBLiQz95uWXz2Ou8LNiaPHPliox3f7466olkGXpXxq%2BpQjMzSRzrueMV5iS20JSXsxiG5zj8a0308P4NdiQ%2BZkmWUmLw96zNOMPlnp0AyolwIBRuVaQ%2Fusywp%2BvB%2BORGkWBKI6jZarz9dBJu%2BA%2BSF2lq5oyly2cxY%2Fy74k6PjW%2BLWSQdd29vcixNSLSE&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAZI2LB46T3KIINTLQ%2F20250509%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250509T080836Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=954dd76a90e5e8e86803ffcdf99ddf29493948c05ce0a5ff0e01d33666181cbb";
                        //     }

                        //     return `
                        //         <div style="padding:10px;">
                        //             위도 : ${item.vhcleLat} 경도 : ${item.vhcleLot} <br/>
                        //             <img src="${ImgUrl}" style="width: 50%; margin-top: 5px;" alt = "포트홀 사진" />
                        //         </div>
                        //     `;
                        // })(),

                        content: `<div style="padding:10px;"> 위도 : ${item.vhcleLat} 경도 : ${item.vhcleLot}<br/>
                                    <img src="${ImgUrl}" style="width: 50%; margin-top: 5px;" alt = "포트홀 사진" />
                                  </div>`, // 마커 클릭 시 정보창 내용
                        maxWidth: 300
                    });

                    // 마커 클릭 이벤트 추가
                    naver.maps.Event.addListener(marker, 'click', function () {
                        console.log('마커 클릭됨'); // 디버깅용
                        infoWindow.open(map, marker.getPosition());
                    });

                    console.log('마커 생성 완료'); // 디버깅 정상적으로 완료확인용코드.
                });
            })
            .catch(error => console.error("API 호출 오류:", error));
    }

    // 포트홀 api응답 테스트
    // async function fetchData() {
    //     try {
    //         const response = await fetch('https://t-data.seoul.go.kr/apig/apiman-gateway/tapi/v2xPotholeInformation/1.0?apikey=' + PotholeSeoulKey);
    //         if (!response.ok) {
    //             throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
    //         }
    //         const data = await response.json(); // JSON 데이터 변환
    //         // const dataStr = JSON.stringify(data); // 데이터 콘솔에 잘 출력되는지 확인해보는 코드.
    //         // console.log(`${dataStr}`);
    //         console.log("호출 됬음");
    //     } catch (error) {
    //         console.error('API 호출 오류:', error);
    //     }
    // }

    // 지도 초기화
    var map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(37.5665, 126.9780), // 초기 중심 좌표 (서울)
        zoom: 12, // 확대 레벨
    });

    var markerOptions = {
        position: new naver.maps.LatLng(37.3595704, 127.105399),
        map: map,
        title: "네이버 본사"
    };

    var marker = new naver.maps.Marker(markerOptions, {
        position: new naver.maps.LatLng(37.3595704, 127.105399),
        map: map
    });

    // 현재위치 조회 불러오는 코드
    function showCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    // 지도 중심을 현재 위치로 이동
                    const userLocation = new naver.maps.LatLng(lat, lng);
                    map.setCenter(userLocation);

                    // 현재 위치에 마커 추가
                    const marker = new naver.maps.Marker({
                        position: userLocation,
                        map: map,
                        title: "현재 위치",
                        icon: {
                            url: './img/oowang.png',
                            size: new naver.maps.Size(70, 70),
                            origin: new naver.maps.Point(0, 0),
                            anchor: new naver.maps.Point(35, 35)
                        }
                    });

                    userMarker = marker;

                    // 정보창 추가
                    const infoWindow = new naver.maps.InfoWindow({
                        content: `<div style="padding:10px;">현재 위치</div>`
                    });
                    infoWindow.open(map, marker);
                },
                (error) => {
                    alert("위치 정보를 가져올 수 없습니다.");
                    console.error(error);
                }
            );
        } else {
            alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
        }
    }

    // 지도 초기화 함수
    // function initMap() {
    //     const map = new naver.maps.Map('map', {
    //         center: new naver.maps.LatLng(37.5665, 126.9780), // 서울 중심 좌표
    //         zoom: 12, // 초기 확대 레벨
    //     });

    //     // 마커 추가
    //     const marker = new naver.maps.Marker({
    //         position: new naver.maps.LatLng(37.5665, 126.9780), // 마커 위치
    //         map: map,
    //         title: '서울',
    //     });
    // }


    //자기 위치로 지도화면을 이동시켜주는 함수
    function moveToMyLocation() {
        if (userMarker) {
            const myPosition = userMarker.getPosition();
            map.setCenter(myPosition);
            map.setZoom(15); // 내 위치로 이동 시 확대
            console.log('위치로 이동됨.'); // 디버깅 정상적으로 완료확인용코드.
        } else {
            alert("내 위치 정보가 없습니다.");
        }
    }

    // csv 파일 불러와서 마커 찍는건데 지금 
    function CSVmarker() {
        let normalstr = "normal.csv";
        let potholestr = "pothole.csv";

        // csv파일 이용
        function loadCSV(csvstr) {
            if (csvstr === "pothole.csv") {
                fetch(csvstr)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("CSV 파일을 불러올 수 없습니다.");
                        }
                        return response.text();
                    })
                    .then(data => {
                        processCSV(data);
                    })
                    .catch(error => {
                        document.getElementById("output").innerText = error.message;
                    });
            }
            else if (csvstr === "normal.csv") {
                fetch(csvstr)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("CSV 파일을 불러올 수 없습니다.");
                        }
                        return response.text();
                    })
                    .then(data => {
                        processCSV2(data);
                    })
                    .catch(error => {
                        document.getElementById("output").innerText = error.message;
                    });
            }
        }

        // 마커 추가 함수
        function addMarker(imgurl, lat, lng) {
            const marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(lat, lng),
                map: map,
                icon: {
                    url: './img/redping2.png',
                    size: new naver.maps.Size(50, 50),
                    origin: new naver.maps.Point(0, 0),
                    anchor: new naver.maps.Point(25, 25)
                }
            });

            // 클릭 시 정보창 열기
            const infoWindow = new naver.maps.InfoWindow({
                content: `<div style="padding:10px;">위도 : ${lat} 경도 : ${lng}<br/>
                          <img src="./img/porthole/${imgurl}.jpg" style="width: 50%; margin-top: 5px;" alt="포트홀 사진" />
                          </div>`,
                maxWidth: 300
            });

            naver.maps.Event.addListener(marker, 'click', function () {
                infoWindow.open(map, marker.getPosition());
            });
        }

        // 마커 추가 함수 다른 색깔
        function addMarker2(imgurl, lat, lng) {
            const marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(lat, lng),
                map: map,
                icon: {
                    url: './img/greenping.png',
                    size: new naver.maps.Size(50, 50),
                    origin: new naver.maps.Point(0, 0),
                    anchor: new naver.maps.Point(25, 25)
                }
            });

            // 클릭 시 정보창 열기
            const infoWindow = new naver.maps.InfoWindow({
                content: `<div style="padding:10px;">위도 : ${lat} 경도 : ${lng}<br/>
                          <img src="./img/normal/${imgurl}.png" style="width: 50%; margin-top: 5px;" alt="${imgurl}" />
                          </div>`,
                maxWidth: 300
            });

            naver.maps.Event.addListener(marker, 'click', function () {
                infoWindow.open(map, marker.getPosition());
            });
        }

        // CSV 데이터를 처리하고 마커 생성
        function processCSV(data) {
            const rows = data.split('\n'); // 행 분리
            rows.forEach((row, index) => {
                if (index === 0) return; // 헤더는 건너뛰기
                const [lat, lng, imgurl] = row.split(','); // 열 분리
                if (imgurl && lat && lng) {
                    addMarker(imgurl.trim(), parseFloat(lat.trim()), parseFloat(lng.trim()));
                    console.log(imgurl.trim()); // 이미지 이름 어떻게나오는지 테스트
                }
            });
        }

        function processCSV2(data) {
            const rows = data.split('\n'); // 행 분리
            rows.forEach((row, index) => {
                if (index === 0) return; // 헤더는 건너뛰기
                const [lat, lng, imgurl] = row.split(','); // 열 분리
                if (imgurl && lat && lng) {
                    addMarker2(imgurl.trim(), parseFloat(lat.trim()), parseFloat(lng.trim()));
                    console.log(imgurl.trim()); // 이미지 이름 어떻게나오는지 테스트
                }
            });
        }

        loadCSV(normalstr);
        loadCSV(potholestr);
    }

    // 외부에서 호출할 수 있게 window에 등록
    window.moveToMyLocation = moveToMyLocation;

    showCurrentLocation();
    CSVmarker();
    fetchPotholeData();
}