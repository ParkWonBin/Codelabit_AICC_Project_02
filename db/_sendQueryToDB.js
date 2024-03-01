const oracledb = require('oracledb');
const dbConfig = require('../_dbConfig');

// DB 연결과 관련된 부분은 함수로 분리해서 따로 관리합니다.
/**
 * db연결 및 예외처리를 간소화 하기 위해 만든 함수 예시입니다.
 * @author wbpark
 * @param {string} sqlString 문자열로 SQL 쿼리를 입력합니다.
 */
async function sendQueryToDB(sqlString) {
    let connection;
    // DB 네트워크 상태가 안좋으면 connection 만들 때부터 에러 발생하므로 Try 내부에 넣음.
    try {

        // 1. DB에 연결합니다. (연결정보는 dbConfig 사용)
        connection = await oracledb.getConnection(dbConfig);

        // 2. DB에 어떤 명령을 내릴지 SQL을 작성합니다.
        return await connection.execute(sqlString);

    } catch (error) {

        // 4. 에러가 발생하면 어떤 에러인지 서버에 기록.
        console.error('오류 발생:', error);
        return null;

    } finally {

        // DB 연결 해제(try에서 return 하면, finally에 있는 코드 수행 후 return 됨)
        if (connection) {
            await connection.close();
        }
    }
}

module.exports = sendQueryToDB;