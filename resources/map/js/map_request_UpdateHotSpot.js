const request_UpdateHotSpot = (data) => {
    const {spot_id,src, left, top} = data
    // spot_id : 해당 이미지의 id,
    // src : 해당 이미지의 경로
    // left: vw 단위의 숫자,
    // top: vh 단위의 숫자,
    alert('request_UpdateHotSpot : '+JSON.stringify(data,(key, value)=>{
        return (typeof value === "string" && value.length > 30) ? value.substring(0, 30) + "..." :value;
    },2))

    // /map 백엔드로 요청 보내기
    fetch('/map/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            spotId:spot_id,
            src,
            left,
            top
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