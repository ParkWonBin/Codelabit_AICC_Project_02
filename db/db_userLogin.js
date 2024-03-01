const oracledb = require('oracledb');
const dbConfig = require('../_dbConfig');

/**
* member 테이블에서 member_id와 member_pw가 일치하는 대상을 조회합니다.
* @author (개선) wbpark
* @author (초안) 이정훈
* @param {string} memberId - 사용자 아이디
* @param {string} memberPw - 사용자 비밀번호
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
const db_userLogin = async (memberId, memberPw) => {
    let connection;
    // DB 네트워크 상태가 안좋으면 connection 만들 때부터 에러 발생하므로 Try 내부에 넣음.
    try {

        // 1. DB에 연결합니다. (연결정보는 dbConfig 사용)
        connection = await oracledb.getConnection(dbConfig);

        // 2. DB에 어떤 명령을 내릴지 SQL을 작성합니다.
        const sqlString = 'SELECT member_num, member_id, member_name, member_role FROM member WHERE member_id = :memberId AND member_pw = :memberPw';
        const bindData = {'memberId': memberId, 'memberPw': memberPw}
        const result = await connection.execute(sqlString, bindData);

        // 3. DB에서 응답받은 내용을 바탕으로 어떤 값을 return 할 지 결정.
        // 가령 성공 여부 등
        if (result.rows.length > 0) {
            return {
                succeed:true,
                memberNum:result.rows[0][1],
                memberId:result.rows[0][0],
                memberName:result.rows[0][2],
                memberRole:result.rows[0][3],
                error:null
            };
        } else {
            return {
                succeed:false,
                memberNum:null,
                memberId:null,
                memberName:null,
                memberRole:null,
                error:'일치하는 ID/PW 없음'
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
            error: error
        };
    } finally {
        // DB 연결 해제(try에서 return 하면, finally에 있는 코드 수행 후 return 됨)
        if (connection) {
            await connection.close();
        }
    }
}


module.exports = db_userLogin;