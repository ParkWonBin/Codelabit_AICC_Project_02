const express = require('express');
// const path = require('path')
const oracledb = require('oracledb');
const dbConfig = require('../_dbConfig');

const router = express.Router();

// router.get('/', async (req, res) => {
    // 브라우저 주소창으로 접근했을 때 어떤 페이지 보여줄지 쓰기
    // res.render('',{})
    // res.sendFile(path.join(__dirname,'/../resources/xxx.html'))
// });

router.post('/', async (req, res) => {
    // 1. post 로 요청받으면, 데이터를 가져오는게 시작. (아래는 예시)
    const{ spotId,left,top } = req.body
    // const data = {
    //     'spot_idx' :1 ,
    //     'image_path':'image.png'
    // }
    // 2. DB 연결과 관련된 부분은 다른 함수랑 연결해서 처리
    const result = await updateSpotPos(spotId,left,top)

    // 3. DB 요청 결과를 통해 어떤 화면과 연결시킬지 판단 및 결정.
    // res.render('', {})
});

// 4. DB 연결과 관련된 부분은 함수로 분리해서 따로 관리합니다.
async function updateSpotPos(spotId, newLeft, newTop){
    let connection;
    try {
        // DB 네트워크 상태가 안좋으면 connection 만들 때부터 에러 발생하므로 Try 내부에 넣음.

       // 4.1. DB에 연결합니다. (연결정보는 dbConfig 사용)
        connection = await oracledb.getConnection(dbConfig);

        // 4.2. DB에 어떤 명령을 내릴지 SQL을 작성합니다.
        const sql_string =  'update hotspot set x_position = :newLeft, y_position = :newTop where spot_idx = :spotId';
        const result = await connection.execute( sql_string,{'spotId':spotId, 'newLeft':newLeft, 'newTop':newTop } );

        // 4.3. DB에서 응답받은 내용을 바탕으로 어떤 값을 return 할 지 결정.
        if(result !== null){
            return result;
        }else{
            return null;
        }
    } catch (error) {
        // 4.4. 에러가 발생하면 어떤 에러인지 서버에 기록.
        console.error('오류 발생:', error);

        // 4.5. 에러 메시지를 통해 어떤 상황에서 어떻게 대처할지를 판단.
        if(error.message.includes("unique constraint")){
             return null;
        }else {
             return null
        }
    } finally {
        // DB 연결 해제(try에서 return 하면, finally에 있는 코드 수행 후 return 됨)
        if (connection) {
            await connection.close();
        }
    }
}


module.exports = router;