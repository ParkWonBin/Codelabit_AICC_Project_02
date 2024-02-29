const createElement = (data) => {
    const {tagName, id, className, textContent, onclick, change} = data
    const tag = document.createElement(tagName ? tagName : 'div');

    if(id){tag.id = id}
    if(className){tag.className = className}
    if(textContent){tag.textContent = textContent}
    if(onclick){tag.addEventListener('click',onclick)}
    if(change){tag.addEventListener('change', change)}

    return tag
}

const createImg = (data)=> {
    const {imgContainer, dropX, dropY, src} = data

    const img = document.createElement('img');
    if(src){img.src = src}

    // 좌표계산을 위한 노트 확인
    const dropArea = document.getElementsByClassName('drop-area')[0];
    const dropAreaRect = dropArea.getBoundingClientRect();

    img.onload = function () {
        // 이미지가 로드된 시점에서 화면 크기 가져오기
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) / 100;
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) / 100;

        // 로드된 이미지의 크기를 상각했을 때 넣을 상대위치
        const x_vw = ( dropX - dropAreaRect.left - (img.offsetWidth / 2) ) /vw;
        const y_vh = ( dropY - dropAreaRect.top - (img.offsetHeight / 2) ) /vh;

        // 이미지 위치를 설정합니다.
        // 기본적으로는 드롭된 위치의 중점에 사진을 배치하나, 화면 밖으로 밀려난 경우, 원점 기준으로 놓기
        imgContainer.style.top = `${y_vh>0? y_vh : 0}vh`;
        imgContainer.style.left = `${x_vw>0? x_vw : 0}vw`;
    };
    return img
}

function createImageConainer(data) {
    const {file, dropX, dropY} = data

    const dropArea = document.getElementsByClassName('drop-area')[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
        // 이미지 컨테이너 생성 및 배치
        const container = createElement({
            tagName : 'div',
            className : 'draggable imageHotSpot',
        })
        dropArea.appendChild(container);

        // 이미지 생성 및 배치
        const img = createImg({
            imgContainer : container,
            src : reader.result,
            dropX: dropX,
            dropY: dropY
        })
        container.appendChild(img)

        const btnCntainder = createElement({
            tagName : 'div',
            className : 'btnContainer'
        })
        container.appendChild(btnCntainder)

        // 등록 버튼 만들기
        const btn = createElement({
            tagName: 'button',
            textContent : '등록',
            className : 'register-button',
            onclick : ()=>{
                const imgContainer = container;
                // sendImageDataToServer 함수를 호출하여 이미지 데이터와 위치 정보를 전송합니다.
                request_CreateHotSpot({
                    file : imgContainer.src,
                    left : imgContainer.style.left,
                    top : imgContainer.style.top
                });
            }
        })
        btnCntainder.appendChild(btn);

    }
    // 생성한 컨테이너 반환
}

