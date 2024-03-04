const oracledb = require('oracledb');
const dbConfig = require('../_dbConfig');

/**
 * 함수 정의 윗부분에 주석을 만들 수 있습니다.
 * @author (개선) wbpark
 * @author (초안) 이정훈
 * @param {string} memberId - 사용자 아이디
 * @param {string} memberPw - 사용자 비밀번호
 * @returns {{
 * succeed:boolean,
 * error:string|error
 * }}
 */
const db_userDeleteMember = async (memberId, memberPw) => {
    let connection;
    // DB 네트워크 상태가 안좋으면 connection 만들 때부터 에러 발생하므로 Try 내부에 넣음.
    try {

        // 1. DB에 연결합니다. (연결정보는 dbConfig 사용)
        connection = await oracledb.getConnection(dbConfig);

        // 2. DB에 어떤 명령을 내릴지 SQL을 작성합니다.
        const sqlString = 'DELETE FROM member WHERE member_id = :memberId AND member_pw = :memberPw';
        const bindData = {memberId, memberPw}
        const result = await connection.execute(sqlString, bindData);

        // 3. DB에서 응답받은 내용을 바탕으로 어떤 값을 return 할 지 결정.
        return {
            succeed: result.rowsAffected > 0,
            error: null
        };
    } catch (error) {
        // 4. 에러가 발생하면 어떤 에러인지 서버에 기록.
        console.error('오류 발생:', error);
        return {
            succeed: null,
            error: error
        };
    } finally {
        // DB 연결 해제(try에서 return 하면, finally에 있는 코드 수행 후 return 됨)
        if (connection) {
            await connection.close();
        }
    }
}


module.exports = db_userDeleteMember;