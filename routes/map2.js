const express = require('express');
const path = require('path')
const oracledb = require('oracledb');
const dbConfig = require('../_dbConfig');

const router = express.Router();

router.get('/', async (req, res) => {
    // 브라우저 주소창으로 접근했을 때 어떤 페이지 보여줄지 쓰기
  const result = await customFunc();
  console.table(result)
  // console.log(result)
    res.render('map2', {
        'x':  [result[0][1],result[1][1],result[2][1]],
        'y' : [result[0][2],result[1][2],result[2][2]],
        'p' : [result[0][0],result[1][0],result[2][0]],
        'n' : [result[0][4],result[1][4],result[2][4]]
    })
    //앞 사진123,뒤 값위치  x: result 배열의 각 요소의 두 번째 요소(인덱스 1)를 추출하여 새로운 배열을 만듭니다.

    // res.sendFile(path.join(__dirname,'/../resources/xxx.html'))
});

router.get('/delete',async (req,res)=>{

    // 뭔가 복잡하고 어려운 절차를 거쳤다고 가정하고. 결과적으로
    const data = {
        'imageId':'12312',
        'imgaePath':'123123'
    }

})


// 4. DB 연결과 관련된 부분은 함수로 분리해서 따로 관리합니다.
async function customFunc(){
    let connection;
    try {
        // DB 네트워크 상태가 안좋으면 connection 만들 때부터 에러 발생하므로 Try 내부에 넣음.

       // 4.1. DB에 연결합니다. (연결정보는 dbConfig 사용)
        connection = await oracledb.getConnection(dbConfig);

        // 4.2. DB에 어떤 명령을 내릴지 SQL을 작성합니다.
        const sql_string =  'DELETE FROM hotspot WHERE spot_id =[];'
        const result = await connection.execute( sql_string );

        // 4.3. DB에서 응답받은 내용을 바탕으로 어떤 값을 return 할 지 결정.
        if(result){
            return result.rows;
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