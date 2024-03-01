// 파일명 : 코드번호_테스트명
// 코드번호 : 업무번호(00)_테스트번호(00)
// 화면번호 : 00:예시템플릿, 01:user 관련, 02:map 관련, 03:board 관련

// 환경변수 불러오고 출력해보기
require('dotenv').config({ path: '../.env' })
console.log("IP : " + process.env.DB_CONNECT_STRING)
console.log("ID : " + process.env.DB_USER)

// oracledb 환경설정하기
const oracledb = require('oracledb');
oracledb.initOracleClient({ libDir: process.env.ORACLEDB_INITORACLECLIENT });
oracledb.autoCommit = true;
///////////////////////////////////

(async () => {
    const sendQueryToDB = require('../db/_sendQueryToDB.js');

    const result1 = await sendQueryToDB(`SELECT COUNT(*) as count FROM member`)
    const result2 = await sendQueryToDB(`SELECT * FROM member WHERE ROWNUM <= 5`)

    console.log(result1.rows[0][0]);
    console.table(result2.rows);
})();