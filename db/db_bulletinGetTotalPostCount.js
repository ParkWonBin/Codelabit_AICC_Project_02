const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');

/**
 * @summary 전체 게시글의 개수를 가져옵니다.
 * @author (개선) wbpark
 * @author (초안) 최원호
 * @returns {{
 * succeed:boolean,
 * totalCount:number,
 * error:string|error
 * }}
 * @description
 * .succeed: 성공 여부 <br>
 * .totalCount: 전체 포스트의 개수<br>
 * .error: 에러여부 혹은 에러내역
 */
const db_bulletinGetTotalPostCount = async () => {
    let connection;
    // DB 네트워크 상태가 안좋으면 connection 만들 때부터 에러 발생하므로 Try 내부에 넣음.
    try {

        // 1. DB에 연결합니다. (연결정보는 dbConfig 사용)
        connection = await oracledb.getConnection(dbConfig);

        // 2. DB에 어떤 명령을 내릴지 SQL을 작성합니다.
        const sqlString = 'SELECT COUNT(*) AS total FROM bulletin';
        const bindData = {}
        const result = await connection.execute(sqlString, bindData);

        // 3. DB에서 응답받은 내용을 바탕으로 어떤 값을 return 할 지 결정.
        // 가령 성공 여부 등
        return {
            succeed: true,
            totalCount:result.rows[0][0],
            error: null
        };
    } catch (error) {
        // 4. 에러가 발생하면 어떤 에러인지 서버에 기록.
        console.error('오류 발생:', error);
        return {
            succeed: null,
            totalCount:null,
            error: error
        };
    } finally {
        // DB 연결 해제(try에서 return 하면, finally에 있는 코드 수행 후 return 됨)
        if (connection) {
            await connection.close();
        }
    }
}


module.exports = db_bulletinGetTotalPostCount;