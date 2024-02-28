const request_CreateHotSpot = (data) => {
    const {file, left, top} = data
    // file: file객체,
    // left: vw 단위의 숫자,
    // top: vh 단위의 숫자,
    alert('request_CreateHotSpot : '+JSON.stringify(data))

    // payload 만들기
    const formData = new FormData();
    formData.append('image', file);
    formData.append('left', left);
    formData.append('top', top);

    // 백엔드로 요청 보내기
    fetch('/MapImageUpload', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) { throw new Error('이미지 등록에 실패했습니다.') }
            // 서버로부터 응답을 JSON 형태로 받아 리턴합니다.
            return response.json();
        })
        .then(res => {
            // 서버로부터 받은 JSON 데이터를 콘솔에 출력합니다.
            console.log('Response :', JSON.stringify(res));
            // TODO : 등록후 HotSpot_Id 받아와서 매핑해주기.
        })
        .catch(error => {
            console.error('Error:', error); // 에러 처리
        }).finally(()=>{
            console.log('CreateHotSpot 함수 종료')
    });
}