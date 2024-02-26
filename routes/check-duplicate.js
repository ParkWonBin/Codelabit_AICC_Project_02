const express = require('express');
// const path = require('path')
const oracledb = require('oracledb');
const dbConfig = require('../_dbConfig');

const router = express.Router();

// router.get('/', async (req, res) => {
//
// });

router.post('/', async (req, res) => {
    // 1. post 로 요청받으면, 데이터를 가져오는게 시작. (아래는 예시)
    // const{ a,b,c } = req.body
    const { field, value } = req.body;

    let tableName =''
    let fieldName = ''
    if (field === 'userId'){
        tableName = 'users'
        fieldName = 'user_id'
    }else if(field === 'userName'){
        tableName = 'users'
        fieldName = 'user_name'
    }else {

    }

    // 2. DB 연결과 관련된 부분은 다른 함수랑 연결해서 처리
    const result = await countDataFromTable(tableName, fieldName, value);

    // 3. DB 요청 결과를 통해 어떤 화면과 연결시킬지 판단 및 결정.
    if(result === null){ res.json({ isDuplicate: null }) }
    if(result === 0){ res.json({ isDuplicate: false }) }
    if(result > 1){ res.json({ isDuplicate: true }) }

});

// 4. DB 연결과 관련된 부분은 함수로 분리해서 따로 관리합니다.
async function countDataFromTable(tableName, fieldName, value){
    let connection;
    try {
        // DB 네트워크 상태가 안좋으면 connection 만들 때부터 에러 발생하므로 Try 내부에 넣음.

       // 4.1. DB에 연결합니다. (연결정보는 dbConfig 사용)
        connection = await oracledb.getConnection(dbConfig);

        // 4.2. DB에 어떤 명령을 내릴지 SQL을 작성합니다.
        const sql_string =  `SELECT COUNT(*) AS count FROM ${tableName} WHERE ${fieldName} = ${value}`;
        const result = await connection.execute( sql_string);

        // 4.3. DB에서 응답받은 내용을 바탕으로 어떤 값을 return 할 지 결정.
        if(result.rows.length>0){
            return result.rows[0].count;
        }else{
            return null;
        }
    } catch (error) {
        // 4.4. 에러가 발생하면 어떤 에러인지 서버에 기록.
        console.error('오류 발생:', error);

        // 4.5. 에러 메시지를 통해 어떤 상황에서 어떻게 대처할지를 판단.
        // 이 경우 판단할 수 없으면 null 반환하도록 합니다.
        return null;
    } finally {
        // DB 연결 해제(try에서 return 하면, finally에 있는 코드 수행 후 return 됨)
        if (connection) {
            await connection.close();
        }
    }
}


module.exports = router;