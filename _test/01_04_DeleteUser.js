// 파일명 : 코드번호_테스트명
// 코드번호 : 업무번호(00)_테스트번호(00)
// 화면번호 : 00:예시템플릿, 01:user 관련, 02:map 관련, 03:board 관련

// 환경변수 불러오고 출력해보기
require('dotenv').config({ path: '../.env' })
console.log("IP : " + process.env.DB_CONNECT_STRING)
console.log("ID : " + process.env.DB_USER)

// oracledb 환경설정하기
const oracledb = require('oracledb');
const db_userLogin = require("../db/db_userLogin");
oracledb.initOracleClient({ libDir: process.env.ORACLEDB_INITORACLECLIENT });
oracledb.autoCommit = true;
///////////////////////////////////

const db_setDataNull = require("../db/db_util_setDataNull");
const db_userDeleteMember = require("../db/db_userDeleteMember");

// 무명함수를 이용하여 비동기함수 실행 예시
(async ()=>{

    const userId = 'user1'
    const userPw = 'password1'
    console.log({id: userId, pw: userPw})

    // 회원탈퇴 전에 비밀번호 맞는지 보고 넘기기
    const userLogin = await db_userLogin(userId,userPw)
    if(!userLogin.succeed){
        console.log("비밀번호 틀림!")
        return "비밀번호 틀림"
    }

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
    const userDeleteMember = await db_userDeleteMember(userId,userPw)
    console.table(userDeleteMember);
    console.log(`회원 삭제 : ${userDeleteMember.succeed?"성공":"실패"}`)

})()