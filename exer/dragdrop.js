document.addEventListener('DOMContentLoaded', function() {
    var dropArea = document.getElementById('drop-area');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    dropArea.addEventListener('drop', handleDrop, false);


    function handleDrop(e) {
        var dt = e.dataTransfer;
        var files = dt.files;

        handleFiles(files);
    }

    function handleFiles(files) {
        files = [...files];
        files.forEach(previewFile);
    }

    function previewFile(file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function() {
            let img = document.createElement('img');
            img.src = reader.result;
            img.className = 'dragable'; // 드래그 가능한 이미지에 클래스 추가
            dropArea.appendChild(img);

            // 이미지 드래그 시작 시 기본 동작 방지
            img.addEventListener('dragstart', function(e) {
                e.preventDefault();
            });
        }
    }

});


// 드래그 로직
document.addEventListener('DOMContentLoaded', (event) => {
    let selectedImg = null;
    let offsetX = 0; // 마우스 클릭 위치와 이미지의 x 위치 차이
    let offsetY = 0; // 마우스 클릭 위치와 이미지의 y 위치 차이

    document.addEventListener('mousedown', function(e) {
        if (e.target.className === 'dragable') {
            selectedImg = e.target;
            selectedImg.style.zIndex = 1000; // 선택된 이미지를 최상위로

            // 클릭한 위치와 이미지의 현재 위치 사이의 오프셋 계산
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
            selectedImg = null;
        }
    });
});