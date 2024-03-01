document.addEventListener('DOMContentLoaded', function() {
    const dropEvents = ['dragenter', 'dragover', 'dragleave', 'drop'];
    const dropAreas = document.getElementsByClassName('drop-area');

    Array.from(dropAreas).forEach(dropArea => { // dropAreas를 배열로 변환
        dropEvents.forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });

        dropArea.addEventListener('drop', function(e) {
            handleDrop(e, dropArea); // 이벤트와 함께 dropArea도 전달
        }, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleDrop(e, dropArea) { // dropArea 인자 추가
        var dt = e.dataTransfer;
        var files = dt.files;

        // 드롭 위치를 얻습니다.
        const dropX = e.clientX;
        const dropY = e.clientY;

        handleFiles(files, dropArea, dropX, dropY);
    }

    function handleFiles(files, dropArea, dropX, dropY) {
        files = [...files];
        files.forEach(file => previewFile(file, dropArea, dropX, dropY));
    }

    function previewFile(file, dropArea, dropX, dropY) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function() {
            let img = document.createElement('img');
            img.src = reader.result;
            img.className = 'dragable';
            img.onload = function() {
                // 이미지의 크기를 기준으로 드롭된 위치에서 이미지를 중앙에 배치합니다.
                const imgWidth = img.offsetWidth;
                const imgHeight = img.offsetHeight;

                // dropArea의 상대적 위치를 계산합니다.
                const dropAreaRect = dropArea.getBoundingClientRect();
                const relativeX = dropX - dropAreaRect.left - (imgWidth / 2);
                const relativeY = dropY - dropAreaRect.top - (imgHeight / 2);

                // 이미지 위치를 설정합니다.
                img.style.position = 'absolute';
                img.style.left = `${relativeX}px`;
                img.style.top = `${relativeY}px`;

                dropArea.appendChild(img);
            };

            // 드래그 시작 시 기본 동작을 방지합니다.
            img.addEventListener('dragstart', e => e.preventDefault());
        }
    }
});

////////////////////////////////////////////////////////

// 드래그 로직
document.addEventListener('DOMContentLoaded', (event) => {
    let selectedImg = null;
    let offsetX = 0; // 마우스 클릭 위치와 이미지의 x 위치 차이
    let offsetY = 0; // 마우스 클릭 위치와 이미지의 y 위치 차이

    document.addEventListener('mousedown', function(e) {
        if (e.target.className === 'dragable') {
            selectedImg = e.target;
            selectedImg.classList.add('selectedImg');
            selectedImg.style.zIndex = 1000; // 선택된 이미지를 최상위로

            // 클릭한 위치와 이미지의 현재 위치 사이의 오프셋 계산
            let imgRect = selectedImg.getBoundingClientRect();

            // 클릭한 위치와 이미지의 현재 위치 사이의 오프셋 계산, 부모의 border를 고려
            offsetX = e.clientX - imgRect.left ;
            offsetY = e.clientY - imgRect.top ;
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (selectedImg) {
            let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) / 100;
            let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) / 100;

            // 클릭한 지점에 상대적으로 이미지 이동 (오프셋 고려)
            let newLeft = (e.clientX - offsetX) / vw;
            let newTop = (e.clientY - offsetY) / vh;

            selectedImg.style.left = newLeft + 'vw';
            selectedImg.style.top = newTop + 'vh';
        }
    });

    document.addEventListener('mouseup', function() {
        if (selectedImg) {
            selectedImg.style.zIndex = ''; // 드래그 종료 시 zIndex 초기화
            selectedImg.classList.remove('selectedImg');
            selectedImg = null;
        }
    });
});