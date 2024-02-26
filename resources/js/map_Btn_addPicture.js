document.addEventListener('DOMContentLoaded', function() {
    //<input type="file" accept="image/*">
    // 요소는 모바일 기기에서 사용자가 터치하면 기본적으로 해당 기기의 사진 라이브러리, 카메라, 또는 파일 시스템에 접근할 수 있는 인터페이스를 제공함
    // 이는 모바일 운영 체제와 브라우저가 자동으로 처리해 주기 때문에, 개발자가 별도로 모바일 특화 기능을 구현하지 않아도 됩니다.

    // 1. 안보이는 input 요소 생성 및 추가
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'fileInput';
    fileInput.style.display = 'none';
    fileInput.accept = 'image/*';
    document.body.appendChild(fileInput);

    // 2. 화면에서 장소추가 버튼 가져와서 이벤트 연동하기.
    const btnAddPicture = document.getElementById('btn_addHotSpot');
    btnAddPicture.addEventListener('click', function() {
        fileInput.click();
    });

    // 3. 파일 인식 받으면 요소 추가
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const dropArea = document.getElementsByClassName('drop-area')[0];

            // 공통 기능 사용하여 파일 처리
            handleFileInput(file, dropArea,
                function(container, img, file) {
                // 버튼 클릭시 파일이 추가되는 위치는 기본적으로 (0, 0)으로 설정
                addBtn_Upload(container, img, file);
            });
        }
    });
});
