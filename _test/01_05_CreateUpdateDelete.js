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
const db_userCheckMemberExistById = require("../db/db_userCheckMemberExistById");
const db_userCheckMemberExistByName = require("../db/db_userCheckMemberExistByName");
const db_userCreateMember = require("../db/db_userCreateMember");
const db_userUpdateMemberPasword = require("../db/db_userUpdateMemberPasword");
const db_setDataNull = require("../db/db_util_setDataNull");
const db_userDeleteMember = require("../db/db_userDeleteMember");

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

    // 비밀번호 변경 시도
    const userPwNew = 'test123'
    console.log(`비밀번호 변경 시도 : ${userPwNew}`)
    const userUpdateMemberPasword = await db_userUpdateMemberPasword(userId,userPw, userPwNew)
    console.table(userUpdateMemberPasword)
    console.log(`비밀번호 변경 : ${userUpdateMemberPasword.succeed?"성공":"실패"}`)

    //회원탈퇴 전에 댓글,게시글,장소등록 등에 등록했던 데이터를 모두 참조 해제합니다.
    const relatedData = [
        {tableName:'comments', columnName:'writer_id'},
        {tableName:'bulletin', columnName:'writer_id'},
        {tableName:'hotspot', columnName:'Auther_id'}
    ]

    // 비동기 함수들이 모두 수행될 때까지 기다렸다가 합치는 함수.
    // 여러개의 비동기 함수를 동시실행 후 리턴값을 수집하려면 promise all
    console.log('user 테이블을 참조하는 테이블들에서, 해당 레코드의 참조 제거 시도')
    const deleteDatalog = await Promise.all(
        relatedData.map(data =>
            db_setDataNull(data.tableName, data.columnName, userId)
                .then(result => {
                    return {...data, id: userId, ...result}
                })
        )
    );
    console.table(deleteDatalog);


    // 2.3. 맴버 삭제 시도
    console.log('맴버 삭제 시도')
    const userDeleteMember = await db_userDeleteMember(userId,userPwNew)
    console.table(userDeleteMember);
    console.log(`회원 삭제 : ${userDeleteMember.succeed?"성공":"실패"}`)

})()