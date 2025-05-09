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

                    let ImgUrl = "https://potholeimg.s3.ap-northeast-2.amazonaws.com/dog.jpg?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0yIkYwRAIgabAjRQ6Ic9SPZkl9bS7nccqCFSVMwmqg0mtDZfQ0QrACIG%2FUGn4hbzOlrdR%2BUWzyDebmkLtltqrYegh7%2BvFoyTbvKrkDCFMQABoMNjM3NDIzMTgzNzgzIgy%2FK4wM6qH2mevSU5AqlgMUhIx0OcbxHDIhZEzYIdOCQwlorWYclVdXCk8e1KyldlpoyGR6zAKPzMbGQTInnP3QaPBf0o%2FNCxEf8H6hjFJ8mx62mmYDuQes8RQeEmepMNamvKlzblQr2UtXHyN1gZBuQp77TRxvxj9LhwaUz31ugKE8bR%2F2Kiqr830t89uTku6sACldEeTcVgOOtCCpXPyCKSfcTlDzFUSAv16Nln2zWOWbB7w%2BwiI8UwqCkjVYsPqbPDVGRg6o626Xn6tZeexozCanoR5Rj6nE5xuChaZw%2Fop8%2B%2BkamFAmXTz2haxnSmTLCxPFmO0G41on419sziXbRpGQCSpu3y7%2BhDdrq1IdMDRuLUP9R2sDmSxrHAJ5dPcbIl7dxXHMGse3Vmj7iNrJ9e4aYiI3zGPJv%2BK2QaRLrOisrcMsFELI%2Fn3i4BvO5wibpHefwMFGJnw8uTlYdxv68DutoM1L0I%2F6F3hmGhqwKnFN12z%2F%2FbX8cNX3SD12W%2BAjFPaV2psBdbTsgjeO438vZjmctOYedVW%2FL6erpaTaovgJNdCcMI%2FR6sAGOt8CQHKdw58yW2Q%2FzgNsC7omGz1AOqDc2MTCuuoetJ0VNqBuerjYfBJ%2BflMzQg%2Bk06WBPZ%2Fza415vUAervHDRfxcQbVkE99RIwjCVD0EqOZaxQXroZTmrzjeDEKjdid7%2F%2B0%2Bqb3WvLoA6eale%2B4Lp8c6pUk4IUC3pgsauQgm1iLJDV8MIems2QnwCU4tAHGwLLLz1xqeuCaJdOiSyQrBpIcnyGmvdbJcylvjcKHx3ZaiRcDkryWzxQZbrMDTeczUJFsCP%2BD5UIu15iVMS8Q%2BxYGWqeT1CuFSoMKtyjgjQrlu0OMgFAzO1Am%2FsPg95SNqLHOyAV%2FJA4AxEoW3xDqQc8YGbmYLi9fPW7by%2FP6t3nSVL0snegcWXHo7kQ4Ihnn9g%2FPZ5%2BWwkjUgBQkr1WtBuC7Pk4gP7WtAU8oKyga6C1EVS%2FQs7XpXiGmOpAD%2Bw2aEuMmdHVZmKvZZ3PlOJafgN4jM&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAZI2LB46TXIMVSMCG%2F20250507%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20250507T020902Z&X-Amz-Expires=10800&X-Amz-SignedHeaders=host&X-Amz-Signature=99af211d04c6925184330b742d1a46c8c9d571b6db623e73901edff6e838595c"

                    // 클릭하면 위도, 경도 표시하는 InfoWindow 생성
                    const infoWindow = new naver.maps.InfoWindow({ 

                        content: (() => {

                        } ) `<div style="padding:10px;"> 위도 : ${item.vhcleLat} 경도 : ${item.vhcleLot} <br/>
                        <img src="${ImgUrl}" style="width: 50%; margin-top: 5px;" alt="포트홀 사진" />
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
                            url: './img/dia.png',
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


    // 외부에서 호출할 수 있게 window에 등록
    window.moveToMyLocation = moveToMyLocation;

    fetchPotholeData();
    showCurrentLocation();
}