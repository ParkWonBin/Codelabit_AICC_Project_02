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

// db 정보 가져와서 쿼리 테스트 해보기
const dbConfig = require('../_dbConfig');
const sql_test1 = `SELECT COUNT(*) as count FROM member`
const sql_test2 = `SELECT * FROM member WHERE ROWNUM <= 5`

// 테스트 수행
selectDatabase();

// 무명함수를 이용하여 비동기함수 실행 예시
(async ()=>{
    // 접속하기
    const connection = await oracledb.getConnection(dbConfig);

    // 테이블 보기
    const result2 = await connection.execute(sql_test2)
    const cols = result2.metaData.map(c=>c.name)
    const rows = result2.rows.map(row => Object.fromEntries(row.map((x, i) => [cols[i], x])));
    console.table(rows);

    // 연결해제
    await connection.close();
})()

// function 키워드로 함수 정의
// function 은 옛날에 JS에 class도 없던 시절에, 함수겸 클래스겸 기타등등으로 사용했기 때문에 객체생성(prototype) 이나 this 바인딩 등
// 신경쓰기 귀찮은 속성들이 대거 들어있고, 호이스팅 등 독특한 성질이 있기 때문에. 일회적이거나 호출만을 위한 함수를 생성할 떄는
// function 대신 무명함수(에로우 함수)를 사용하여 함수를 정의하고 사용하는 게 혼란을 줄일 수 있다.
async function selectDatabase() {
    //연결 시도
    const connection = await oracledb.getConnection(dbConfig);

    //쿼리 실행
    const reesult = await connection.execute(sql_test1);
    console.log(reesult.rows[0]);

    // 연결해제
    await connection.close();
}