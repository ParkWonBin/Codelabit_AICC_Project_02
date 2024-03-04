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
const db_bulletinGetCommentsByPostId = require("../db/db_bulletinGetCommentsByPostId");

// 무명함수를 이용하여 비동기함수 실행 예시
(async ()=>{
    const postId = 73

    //해당 계시글의 댓글 조회
    const bulletinGetCommentsByPostId = await db_bulletinGetCommentsByPostId(postId);
    console.log((bulletinGetCommentsByPostId.commentTree))

})()
