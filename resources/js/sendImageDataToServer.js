// 서버로 이미지 전송하는 함수
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