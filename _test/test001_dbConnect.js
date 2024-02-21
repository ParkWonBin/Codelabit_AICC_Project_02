// 환경변수 불러오고 출력해보기
require('dotenv').config({ path: '../.env' })
console.log("IP : " + process.env.DB_CONNECT_STRING)
console.log("ID : " + process.env.DB_USER)
console.log("연결예시 :")

// oracledb 환경설정하기
const oracledb = require('oracledb');
oracledb.initOracleClient({ libDir: process.env.ORACLEDB_INITORACLECLIENT });
oracledb.autoCommit = true;

// db 정보 가져와서 쿼리 테스트 해보기
const dbConfig = require('../_dbConfig');
selectDatabase();

// DB 연결 함수 정의
async function selectDatabase() {
    //연결 시도
    const connection = await oracledb.getConnection(dbConfig);

    //쿼리 생성
    const sql_string = "SELECT COUNT(*) FROM users"
    const binds = {};
    const options = {outFormat: oracledb.OUT_FORMAT_OBJECT};

    //쿼리 실행
    let result = await connection.execute(sql_string, binds, options);

    //결과 보기
    console.log(result.rows[0]);

    // 테이블 보기
    let rsult2 = await connection.execute(
        `SELECT user_id, user_name FROM users WHERE ROWNUM <= 5`
    )
    console.table(rsult2.rows)

    // 연결해제
    await connection.close();
}