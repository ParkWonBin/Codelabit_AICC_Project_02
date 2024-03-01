const oracledb = require('oracledb');
const dbConfig = require('../_dbConfig');

/**
 * 함수 정의 윗부분에 주석을 만들 수 있습니다.
 * @author 함수 실명제
 * @param {string} a 이렇게 인수에 주석을 남길 수 있으며
 * @param {number} b 해당 인수의 타입을 지정할 수 있습니다.
 * @param {object} c 타입을 지정하면 메소드 자동완성 쓸 수 있습니다.
 */
async function customFunc(a,b,c){
    let connection;
    // DB 네트워크 상태가 안좋으면 connection 만들 때부터 에러 발생하므로 Try 내부에 넣음.
    try {

        // 1. DB에 연결합니다. (연결정보는 dbConfig 사용)
        connection = await oracledb.getConnection(dbConfig);

        // 2. DB에 어떤 명령을 내릴지 SQL을 작성합니다.
        const sqlString =  '';
        const bindData = {}
        const result = await connection.execute( sqlString, bindData );

        // 3. DB에서 응답받은 내용을 바탕으로 어떤 값을 return 할 지 결정.
        // 가령 성공 여부 등
        if(result){
            return result;
        }else{
            return null;
        }
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


module.exports = customFunc;