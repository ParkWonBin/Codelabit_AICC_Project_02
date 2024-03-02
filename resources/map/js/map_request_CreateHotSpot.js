const request_CreateHotSpot = (data) => {
    const {file, left, top} = data
    alert('request_CreateHotSpot : '+JSON.stringify(data,(key, value)=>{
            return (typeof value === "string" && value.length > 30) ? value.substring(0, 30) + "..." :value;
    },2))

    // payload 만들기
    // multer를 쓸 때는 필요하지만, 요청 body 상한을 올리고
    // req.body 에서 받은 데이터를 baseb4로 처리하도록 수정하면서 비활성화
    // const formData = new FormData();
    // formData.append('base64Data', file);
    // formData.append('top', top);
    // formData.append('left', left);
    // 세션 통해 id 넘기고 본인이 만든것만 수정하도록

    // /map 백엔드로 요청 보내기
    fetch('/map/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            base64Data: file,
            top: top,
            left: left
        })
    })
        .then(response => {
            if (!response.ok) { throw new Error('이미지 등록에 실패했습니다.') }
            // 서버로부터 응답을 JSON 형태로 받아 리턴합니다.
            return response.json();
        })
        .then(res => {
            // 서버로부터 받은 JSON 데이터를 콘솔에 출력합니다.
            console.log('Response :', JSON.stringify(res));
        })
        .catch(error => {
            console.error('Error:', error); // 에러 처리
        }).finally(()=>{
            console.log('CreateHotSpot 함수 종료')
    });
}