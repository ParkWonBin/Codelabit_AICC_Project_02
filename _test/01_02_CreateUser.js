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

const moment = require('moment');
const db_userCreateMember = require("../db/db_userCreateMember");
const db_userCheckMemberExistById = require("../db/db_userCheckMemberExistById");
const db_userCheckMemberExistByName = require("../db/db_userCheckMemberExistByName");

// 무명함수를 이용하여 비동기함수 실행 예시
(async ()=>{
    const formattedDateTime = moment().format('YYYYMMDD_HHmmss_ms');

    // 아이디 안겹치게 하려고 현재시기 밀리초 단위로 가져와서 id/name 에 넣음.
    const userName = 'test_'+formattedDateTime
    const userId = 'test_'+formattedDateTime
    const userPw = formattedDateTime
    console.log({id: userId, name: userName, pw: userPw})

    const checkId = await db_userCheckMemberExistById(userId)
    console.log("id 중복여부 : "+checkId.memberExist)

    const checkName = await db_userCheckMemberExistByName(userName)
    console.log("name 중복여부 : "+checkName.memberExist)

    const userCreateMember = await db_userCreateMember(userId,userPw,userName)
    console.table(userCreateMember)
    console.log(`회원가입 : ${(userCreateMember.succeed)?"성공":"실패"}`)
})()