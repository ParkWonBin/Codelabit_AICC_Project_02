const oracledb = require('oracledb');
const dbConfig = require('../_dbConfig');

/**
 * member 테이블에서 member_id와 member_pw가 일치하는 대상을 조회합니다.
 * @author (개선) wbpark
 * @author (초안) 이정훈
 * @param {string} memberId - 사용자 아이디
 * @param {string} memberPw - 사용자 비밀번호
 * @param {string} memberName - 사용자 이름
 * @returns {{
 * succeed:boolean,
 * memberNum:number,
 * memberId:string,
 * memberName:string,
 * memberRole:string,
 * error:string|error
 * }}
 * .succeed - 로그인 성공 여부 <br>
 * .memberNum - 사용자 가입 순번 <br>
 * .memberId - 사용자 아이디 <br>
 * .memberName - 사용자 이름 <br>
 * .memberRole - 사용자 역할 <br>
 * .error - 에러여부 혹은 에러내역
 */
async function db_userCreateMember(memberId,memberPw,memberName){
    let connection;
    // DB 네트워크 상태가 안좋으면 connection 만들 때부터 에러 발생하므로 Try 내부에 넣음.
    try {

        // 1. DB에 연결합니다. (연결정보는 dbConfig 사용)
        connection = await oracledb.getConnection(dbConfig);



        // 2. DB에 어떤 명령을 내릴지 SQL을 작성합니다.
        const sqlString = `
            INSERT INTO member (member_num, member_id, member_pw, member_name)
            VALUES (member_seq.nextval, :memberId, :memberPw, :memberName)`;
        const bindData = {memberId,memberPw, memberName}
        const result = await connection.execute( sqlString, bindData );

        // 3. DB에서 응답받은 내용을 바탕으로 어떤 값을 return 할 지 결정.
        if (result.rowsAffected > 0) {
            // 방금 가입한 계정의 순번 가져오기
            const memberNum = (await connection.execute( `SELECT member_num FROM member WHERE member_id = :memberId`,{memberId} )).rows[0][0]

            return {
                succeed:true,
                memberNum:memberNum,
                memberId:memberId,
                memberName:memberName,
                memberRole:null,
                error:null
            };
        } else {
            return {
                succeed:false,
                memberNum:null,
                memberId:null,
                memberName:null,
                memberRole:null,
                error:'회원가입 실패'
            };
        }
    } catch (error) {
        // 4. 에러가 발생하면 어떤 에러인지 서버에 기록.
        console.error('오류 발생:', error);
         return {
            succeed:false,
            memberNum:null,
            memberId:null,
            memberName:null,
            memberRole:null,
            error:error
        };;
    } finally {
        // DB 연결 해제(try에서 return 하면, finally에 있는 코드 수행 후 return 됨)
        if (connection) {
            await connection.close();
        }
    }
}


module.exports = db_userCreateMember;