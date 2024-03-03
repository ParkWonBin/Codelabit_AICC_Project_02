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
const db_bulletinCreatePost = require('../db/db_bulletinCreatePost');
const db_bulletinUpdatePost = require('../db/db_bulletinUpdatePost');

// 무명함수를 이용하여 비동기함수 실행 예시
(async ()=>{
    // 글작성에 필요한 데이터
    const writerId = 'test'
    const postTitle = '테스트입니다.'
    const postContent = '아무말 테스트'

    // 글 작성 시도
    console.log('게시글 작성 시도')
    const createPost = await db_bulletinCreatePost(writerId, postTitle, postContent)
    console.log(createPost)

    // 글 수정 시도
    const postTitleNew = postTitle + " (수정함)"
    const postContentNew = postContent + " (수정함)"

    console.log("게시글 수정 시도")
    const updatePost = await db_bulletinUpdatePost(createPost.postId, postTitleNew, postContentNew);
    console.log(updatePost)
})()
