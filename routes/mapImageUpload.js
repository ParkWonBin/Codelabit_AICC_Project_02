const express = require('express');
// DB 연동을 위한 수고..
const oracledb = require('oracledb');
const dbConfig = require('../_dbConfig');

// 파일 저장을 위한 고생..
const multer  = require('multer');
const moment = require('moment');
const path = require('path')
const fs = require('fs');

// 이미지 업로드 폴더 경로를 설정합니다. resources/images 폴더가 없다면 생성합니다.
const uploadDir = path.join(__dirname,'../resources/images/upload');
fs.existsSync(uploadDir) || fs.mkdirSync(uploadDir, { recursive: true });

// 저장소 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        // 날짜 형식으로 파일 이름 설정
        const filename = moment().format('YYYYMMDD_HHmmss') + path.extname(file.originalname)
        cb(null, filename);
    }
});

// 업로드를 위한 객체, 라우터를 위한 객체.
const upload = multer({ storage: storage });
const router = express.Router();
router.post('/', upload.single('image'), async (req, res) => {
    // 1. post 로 요청받으면, 데이터를 가져오는게 시작. (아래는 예시)
    console.log(req.file); // 업로드된 이미지 파일 정보
    // console.log(req.body.left, req.body.top); // 이미지의 left, top 위치 정보

    // db에 넣을 데이터
    const data = {
        fileName: `/images/upload/${req.file.filename}`,
        top: req.body.top.replace('vh', ''),
        left: req.body.left.replace('vw', '')
    };

    console.log(data)
    // 2. DB 연결과 관련된 부분은 다른 함수랑 연결해서 처리
    const result = await insertImageToDB(data)

    // 3. DB 요청 결과를 통해 어떤 화면과 연결시킬지 판단 및 결정.
    res.json({'status':'성공'})
});

// 4. DB 연결과 관련된 부분은 함수로 분리해서 따로 관리합니다.
async function insertImageToDB(data){
    let connection;
    try {
        // DB 네트워크 상태가 안좋으면 connection 만들 때부터 에러 발생하므로 Try 내부에 넣음.

       // 4.1. DB에 연결합니다. (연결정보는 dbConfig 사용)
        connection = await oracledb.getConnection(dbConfig);

        // 4.2. DB에 어떤 명령을 내릴지 SQL을 작성합니다.
        const sql_string =  'INSERT INTO ImageData (image_path, x_position, y_position) VALUES (:fileName, :left, :top)'
        const result = await connection.execute( sql_string,data );

        // 4.3. DB에서 응답받은 내용을 바탕으로 어떤 값을 return 할 지 결정.
        if(result !== null && result.rowsAffected > 0){
            return '성공';
        }else{
            console.error(result)
            return '실패';
        }
    } catch (error) {
        // 4.4. 에러가 발생하면 어떤 에러인지 서버에 기록.
        console.error('오류 발생:', error);

        // 4.5. 에러 메시지를 통해 어떤 상황에서 어떻게 대처할지를 판단.
        if(error.message.includes("unique constraint")){
             return '에러';
        }else {
             return '에러'
        }
    } finally {
        // DB 연결 해제(try에서 return 하면, finally에 있는 코드 수행 후 return 됨)
        if (connection) {
            await connection.close();
        }
    }
}


module.exports = router;