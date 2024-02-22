document.addEventListener('DOMContentLoaded', function() {
    // 기본적으로 로드된 이미지에 대해서는 dragstart 이벤트를 제거함
    var ElementImages = document.querySelectorAll('img');
    // 각 이미지에 대해 이벤트 리스너 추가
    ElementImages.forEach(function(img) {
        img.addEventListener('dragstart', function(e) {
            e.preventDefault(); // 드래그 시작 이벤트의 기본 동작을 방지
        });
    });


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
            let container = document.createElement('div');
            container.className = 'dragable';

            let img = document.createElement('img');
            img.src = reader.result;
            img.onload = function() {
                // 이미지의 크기를 기준으로 드롭된 위치에서 이미지를 중앙에 배치합니다.
                const imgWidth = img.offsetWidth;
                const imgHeight = img.offsetHeight;

                // dropArea의 상대적 위치를 계산합니다.
                const dropAreaRect = dropArea.getBoundingClientRect();
                const relativeX = dropX - dropAreaRect.left - (imgWidth / 2);
                const relativeY = dropY - dropAreaRect.top - (imgHeight / 2);

                // 이미지 위치를 설정합니다.
                container.style.position = 'absolute';
                container.style.left = `${relativeX}px`;
                container.style.top = `${relativeY}px`;

                dropArea.appendChild(container);
                container.appendChild(img);

                // 등록 버튼을 생성하고 설정합니다.
                let btn = document.createElement('button');
                btn.textContent = '등록';
                btn.className = 'register-button';
                btn.style.position = 'absolute';

                // 버튼 클릭 이벤트 핸들러 추가 (예시)
                btn.addEventListener('click', function() {
                    console.log('이미지 등록 처리');
                    // 여기에 이미지를 등록하는 로직을 추가할 수 있습니다.
                });

                container.appendChild(btn);
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
        let dragableElement = e.target.closest('.dragable'); // 클릭된 요소에서 가장 가까운 .dragable 요소를 찾습니다.
        if (dragableElement) {
            selectedImg = dragableElement; // dragable 클래스를 가진 div를 선택합니다.
            selectedImg.style.zIndex = 1000; // 선택된 요소를 최상위로
            // 하이라이트 이미지
            dragableElement.getElementsByTagName('img')[0].classList.add('selectedImg');

            let imgRect = selectedImg.getBoundingClientRect();
            offsetX = e.clientX - imgRect.left;
            offsetY = e.clientY - imgRect.top;
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
            selectedImg.getElementsByTagName('img')[0].classList.remove('selectedImg');
            selectedImg = null;
        }
    });
});