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
const db_bulletinGetTotalPostCount = require('../db/db_bulletinGetTotalPostCount');
const transposObject = require('../util/util_transposObject');
const db_bulletinGetPostList = require('../db/db_bulletinGetPostList');

// 무명함수를 이용하여 비동기함수 실행 예시
(async ()=>{

    // 사용자 설정 영역
    const currentPage = 3
    const postsPerPage = 5;

    // 전체 게시글 확인
    const bulletinGetTotalPostCount = await db_bulletinGetTotalPostCount();
    const totalPosts = bulletinGetTotalPostCount.totalCount;
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    console.table(bulletinGetTotalPostCount);

    // 표시할 데이터 확인
    const startRow = (currentPage - 1) * postsPerPage + 1;
    const endRow = currentPage * postsPerPage;
    const bulletinGetPostList = await db_bulletinGetPostList(startRow,endRow)

    if(bulletinGetPostList.succeed){
        const {succeed,error, ...data} = bulletinGetPostList
        console.table(transposObject(data));
    }else {
        console.error("페이지 조회 실패")
    }
})()