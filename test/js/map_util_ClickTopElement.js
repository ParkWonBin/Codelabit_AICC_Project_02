document.addEventListener('touchend', function(e) {
    const e_target = e.changedTouches  ? e.changedTouches [0] : e
    selectImage(e_target);
})
document.addEventListener('click', function(e) {
    selectImage(e);
})

const selectImage = (e) => {
    // 클릭 위치에 있는 최상단의 요소를 찾습니다.
    const topElement = document.elementFromPoint(e.clientX, e.clientY);

    // 찾은 요소에 대한 조작을 수행합니다.
    if (topElement.parentNode) {
        // alert(JSON.stringify(topElement.parentNode.getAttributeNames()))

       // imageHotSpot를 클릭한 게 아니라면 return
        if(!topElement.parentNode.getAttribute('class').includes('imageHotSpot')){
            return null
        }

        // 이미 Active 클라스를 갖고있다면 return
        if(topElement.parentNode.getAttribute('class').includes('Active')){
            return null
        }

        // const imgContainder = topElement
        const imgContainder = topElement.parentNode
        imgContainder.classList.add('Active')

        ////////////////////////////////
        // alert('갱신/삭제 버튼 생성 ')

        // 버튼 컨테이너 가져오기 || 없으면 생성
        const btnContainder =
            (imgContainder.getElementsByClassName('btnContainer').length > 0) ?
             imgContainder.getElementsByClassName('btnContainer')[0] :
             createElement({tagName: 'div',className:'btnContainer'})
        imgContainder.appendChild(btnContainder);

        // 갱신버튼 만들기
        const btnUpdate = createElement({
            tagName: 'button',
            textContent : '이동',
            className : 'update-button',
            onclick : ()=>{
                const imgContainer = imgContainder;
                // sendImageDataToServer 함수를 호출하여 이미지 데이터와 위치 정보를 전송합니다.
                request_UpdateHotSpot({
                    hotspot_id: imgContainer.getElementsByTagName('img')[0].src,
                    src : imgContainer.getElementsByTagName('img')[0].src,
                    left : imgContainer.style.left,
                    top : imgContainer.style.top
                });
            }
        })
        btnContainder.appendChild(btnUpdate);

        // 삭제 버튼 만들기
        const btndelete = createElement({
            tagName: 'button',
            textContent : '삭제',
            className : 'delete-button',
            onclick : ()=>{
                const imgContainer = imgContainder;
                // sendImageDataToServer 함수를 호출하여 이미지 데이터와 위치 정보를 전송합니다.
                request_UpdateHotSpot({
                    src : imgContainer.style.left,
                    top : imgContainer.style.top
                });
            }
        })
        btnContainder.appendChild(btndelete);

    }
};