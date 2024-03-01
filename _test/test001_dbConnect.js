// 환경변수 불러오고 출력해보기
require('dotenv').config({ path: '../.env' })
console.log("IP : " + process.env.DB_CONNECT_STRING)
console.log("ID : " + process.env.DB_USER)

// oracledb 환경설정하기
const oracledb = require('oracledb');
oracledb.initOracleClient({ libDir: process.env.ORACLEDB_INITORACLECLIENT });
oracledb.autoCommit = true;

// db 정보 가져와서 쿼리 테스트 해보기
const dbConfig = require('../_dbConfig');
const sql_test1 = `SELECT COUNT(*) as count FROM member`
const sql_test2 = `SELECT member_id, member_name FROM member WHERE ROWNUM <= 5`

// 테스트 수행
selectDatabase();

// DB 연결 함수 정의
async function selectDatabase() {
    //연결 시도
    const connection = await oracledb.getConnection(dbConfig);

    //쿼리 실행
    const reesult = await connection.execute(sql_test1);
    console.log(reesult.rows[0]);

    // 테이블 보기
    const result2 = await connection.execute(sql_test2)
    const cols = result2.metaData.map(c=>c.name)
    const rows = result2.rows.map(row => Object.fromEntries(row.map((x, i) => [cols[i], x])));
    console.table(rows);

    // 연결해제
    await connection.close();
}