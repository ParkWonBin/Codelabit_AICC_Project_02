const express = require('express');
// const path = require('path')
// const oracledb = require('oracledb');
// const dbConfig = require('../_dbConfig');

const router = express.Router();

router.get('/', async (req, res) => {

});

router.post('/', async (req, res) => {

});

// DB 연결이 필요한 경우 아래 함수 수정하여 적용
// async function customFunc(){
//     let connection;
//     try {
//         // DB 네트워크 상태가 안좋으면 connection 만드는 데부터 에러나므로 Try 내부에 넣음.
//         connection = await oracledb.getConnection(dbConfig);
//
//         // sql 쿼리 만들기
//         const sql_string =  '';
//         const result = await connection.execute( sql_string,{ } );
//
//         // 결과 있으면 리턴값 만들어 리턴하기
//         if(result){
//             return result;
//         }else{
//             return null;
//         }
//     } catch (error) {
//         console.error('오류 발생:', error);
//         return null;
//     } finally {
//         // 연결정보 남아있으면 close
//         if (connection) {
//             await connection.close();
//         }
//     }
// }


module.exports = router;