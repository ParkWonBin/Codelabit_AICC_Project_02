document.addEventListener('DOMContentLoaded', (event) => {


    // 2. 화면에서 장소추가 버튼 가져와서 이벤트 연동하기.
    const btndelPicture = document.getElementById('btn_delHotSpot');
    btndelPicture.addEventListener('click', (e) => {
        fileInput.click(); // 숨겨진 file input을 프로그래매틱하게 클릭합니다.
    });

    // 3. 파일 인식 받으면 요소 추가


                    // 버튼을 만들고 이벤트에 등록하는 함수
                    function addUploadBtn() {
                        // 등록 버튼을 생성하고 설정합니다.
                        const btn = document.createElement('button');

                        // container.insertBefore(btn, container.firstChild) // 맨 앞으로 추가
                        container.appendChild(btn); // 맨 뒤로 추가

                        container.child
                        btn.textContent = '등록';
                        btn.className = 'register-button';
                        btn.style.position = 'absolute'

                        // 버튼 클릭 이벤트 핸들러 추가 (예시)
                        btn.addEventListener('click', function () {


                            // 이제 sendImageDataToServer 함수를 호출하여 이미지 데이터와 위치 정보를 전송합니다.
                            console.log('이미지 등록 처리');
                            sendImageDataToServer(file, left, top);
                        });
                    }





});
