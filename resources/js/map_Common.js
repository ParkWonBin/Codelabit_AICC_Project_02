// 이미지 파일을 처리하고 미리보기를 생성하는 공통 함수
function handleFileInput(file, dropArea, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {

        // 이미지 생성
        const img = document.createElement('img'); // 새 이미지 엘리먼트를 생성합니다.
        img.src = reader.result;
        img.onload = function() {
            const container = document.createElement('div');
            container.className = 'draggable';
            container.style.position = 'absolute';

            // 드롭다운된 위치에 이미지 붙여넣기
            positionImg(container, dropArea, img, 0, 0)

            dropArea.appendChild(container);
            container.appendChild(img);

            // 콜백 함수를 통해 위치 설정 및 버튼 추가
            callback(container, img, file);
        };
    };
}

// 특정 좌표에 이밎를 위치 시키는 함수
function positionImg(container, dropArea, img, pos_x, pos_y) {
    // dropArea.appendChild(container);
    // container.appendChild(img);

    // 이미지의 크기를 기준으로 드롭된 위치에서 이미지를 중앙에 배치합니다.
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) / 100;
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) / 100;
    const imgWidth = img.offsetWidth;
    const imgHeight = img.offsetHeight;

    // dropArea의 상대적 위치를 계산합니다.
    const dropAreaRect = dropArea.getBoundingClientRect();
    const relativeX = pos_x - dropAreaRect.left - (imgWidth / 2);
    const relativeY = pos_y - dropAreaRect.top - (imgHeight / 2);

    // 이미지 위치를 설정합니다.
    container.style.position = 'absolute';
    container.style.left = `${relativeX / vw}vw`;
    container.style.top = `${relativeY / vh}vh`;
}

// 위치 설정 및 버튼 추가 함수
function addBtn_Upload(container, img, file, x = 0, y = 0) {
    // 이미지 위치 설정
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;

    // 등록 버튼 추가
    const btn = document.createElement('button');
    btn.textContent = '등록';
    btn.className = 'register-button';
    btn.onclick = function() {
        sendImageDataToServer(file, container.style.left, container.style.top, btn);
    };
    container.insertBefore(btn, container.firstChild);
}

// 서버로 이미지 데이터 전송
function sendImageDataToServer(file, left, top, btn) {
    // alert('test')
    const formData = new FormData();
    formData.append('image', file); // 'image'는 서버에서 기대하는 필드명입니다.
    formData.append('left', left);
    formData.append('top', top);

    fetch('/MapImageUpload', {
        method: 'POST',
        body: formData // FormData는 Content-Type을 자동으로 설정합니다.
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // 서버로부터 응답을 JSON 형태로 받습니다.
        })
        .then(data => {
            console.log('Response data:', data); // 서버로부터 받은 데이터를 콘솔에 출력합니다.
            // 서버로부터의 응답에 따라 조건부 로직을 수행합니다.
            if (data.status === '성공') {
                console.log('DB 데이터 삽입 성공');
                btn.remove(); // 버튼을 DOM에서 삭제합니다.
                // window.location.reload(); // 페이지를 새로고침합니다.
            } else {
                console.log('응답 처리 실패');
                // 요청 실패 시 버튼 스타일 및 텍스트 변경
                btn.style.background = 'red'; // 버튼 배경을 빨간색으로 변경합니다.
                btn.textContent = '재전송'; // 버튼의 텍스트를 '재전송'으로 변경합니다.

            }
        })
        .catch(error => {
            console.error('Error:', error); // 에러 처리
        });
}