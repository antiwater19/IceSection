// 초반 네이버지도 클라이언트를 환경변수로 사용하기위한 js파일일
fetch('/config')
    .then(res => res.json())
    .then(config => {
        const clientId = config.naverClientId;
        const script = document.createElement('script');
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
        script.onload = () => {

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

// mapInit.js
function initMapFeatures() {

    // 자기위치 표시용 버튼을 위한 변수
    let userMarker;

    const map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(37.5665, 126.9780),
        zoom: 12,
    });

    // 마커 추가 예시
    const markerOptions = {
        position: new naver.maps.LatLng(37.3595704, 127.105399),
        map: map,
        icon: {
            url: '/img/dia.png',
            size: new naver.maps.Size(70, 70),
            origin: new naver.maps.Point(0, 0),
            anchor: new naver.maps.Point(11, 35)
        }
    };

    new naver.maps.Marker(markerOptions);

    // 그 외 코드들
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

                    //현재 위치에 마커 추가
                    const marker = new naver.maps.Marker({
                        position: userLocation,
                        map: map,
                        title: "현재 위치",
                        icon: {
                            url: '/img/oowang.png',
                            size: new naver.maps.Size(70, 70),
                            origin: new naver.maps.Point(0, 0),
                            anchor: new naver.maps.Point(35, 60),
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

    // IceSection.csv 읽기
    function loadCSV() {
        fetch("IceSection_20231222.csv")
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

    // CSV 데이터를 처리하고 마커 생성
    function processCSV(data) {
        const rows = data.split('\n'); // 행 분리
        rows.forEach((row, index) => {
            if (index === 0) return; // 헤더는 건너뛰기
            const [sectionNumber, managementOffice,
                roadClassification, representativeRegion, name, totalLengthKm, lat, lng] = row.split(','); // 열 분리
            if (name && lat && lng) {
                addMarker(name.trim(), parseFloat(lat.trim()), parseFloat(lng.trim()));
            }
        });
    }

    // 지도에 마커 추가
    function addMarker(name, lat, lng) {
        const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(lat, lng),
            map: map,
            title: name,
        });

        // 마커 클릭 이벤트
        naver.maps.Event.addListener(marker, 'click', function () {
            alert(`위치: ${name}\n위도: ${lat}, 경도: ${lng}`);
        });
    }

    // 파일 읽기 및 지도에 마커 표시 csv파일을 선택해서 읽는거임
    // document.getElementById('fileInput').addEventListener('change', function (event) {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = function (e) {
    //             const csvData = e.target.result;
    //             processCSV(csvData);
    //         };
    //         reader.readAsText(file);
    //     }
    // });

    //자기 위치로 지도화면을 이동시켜주는 함수
    function moveToMyLocation() {
        if (userMarker) {
            const myPosition = userMarker.getPosition();
            map.setCenter(myPosition);
            map.setZoom(15); // 내 위치로 이동 시 확대
        } else {
            alert("내 위치 정보가 없습니다.");
        }
    }

    window.moveToMyLocation = moveToMyLocation;

    // 페이지 로드시 실행
    loadCSV();
    showCurrentLocation();
}

