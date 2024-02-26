document.addEventListener('DOMContentLoaded', function() {

    // 1. db에서 가져온 이미지 초기 세팅
    // 이거 안하면 이미지 드래그 할 때마다 dragdrop한 것 처럼 인식함
    document.querySelectorAll('img').forEach(function (img) {
        img.addEventListener('dragstart', function (e) {
        });
    });

    // 2. 드래그 영역에 대한 초기 세팅
    // 기본 함수 제거 및, 뒤로 이벤트 확산되는거 제거.
    const dropArea = document.getElementsByClassName('drop-area')[0];
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    // 3. 드레그 영역에 기능 추가
    // 이제 드레그 영영에 대해 drop 이벤트에 함수를 등록함.
    dropArea.addEventListener('drop', function(e) {
        const files = e.dataTransfer.files;

        // FileList자료형을 배열로 변환
        // forEach 를 쓰려면 아래처럼 배열로 전환해서 쓰거나
        // let files = [...files] 이렇게 배열 형식으로 다시 저장해야함.
        Array.from(files).forEach(file => {

            // 공통 기능 사용하여 파일 처리
            handleFileInput(file, dropArea,
                function(container, img, file) {
                const x = e.clientX - dropArea.offsetLeft;
                const y = e.clientY - dropArea.offsetTop;
                addBtn_Upload(container, img, file, x, y);
            });
        });
    });
});
