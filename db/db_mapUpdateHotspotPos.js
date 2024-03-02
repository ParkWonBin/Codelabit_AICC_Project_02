const oracledb = require('oracledb');
const dbConfig = require('../_dbConfig');

/**
 * 오라클 데이터베이스에서 특정 핫스팟의 위치 정보를 업데이트합니다.
 *
 * 이 함수는 주어진 핫스팟 ID에 대해 새로운 왼쪽(x_position)과 상단(y_position) 위치를 업데이트합니다.
 * 업데이트가 성공적으로 이루어지면, 성공 여부와 영향 받은 행의 수를 반환합니다.
 * 오류가 발생한 경우, 오류 정보를 포함하는 객체를 반환합니다.
 *
 * @param {number} spotId - 업데이트할 핫스팟의 ID
 * @param {number} newLeft - 해당 장소의 새로운 x_position 값
 * @param {number} newTop - 해당 장소의 새로운 y_position 값
 * @returns {{
 *   succeed: boolean,
 *   rowsAffected: number,
 *   error: string|Error
 * }}
 * - .succeed: 비밀번호 변경 성공 여부
 * - .rowsAffected: 업데이트된 행의 수. 성공적으로 업데이트된 경우에만 설정됩니다.
 * - .error: 에러 발생 시 해당 에러의 내용. 에러가 없는 경우 null.
 */
async function db_mapUpdateHotspotPos(spotId, newLeft, newTop){
    let connection;
    // DB 네트워크 상태가 안좋으면 connection 만들 때부터 에러 발생하므로 Try 내부에 넣음.
    try {

        // 1. DB에 연결합니다. (연결정보는 dbConfig 사용)
        connection = await oracledb.getConnection(dbConfig);

        // 2. DB에 어떤 명령을 내릴지 SQL을 작성합니다.
        const sqlString = `
            UPDATE hotspot
            SET x_position = :newLeft,
                y_position = :newTop
            WHERE spot_idx = :spotId
        `;
        const bindData = {spotId, newLeft, newTop}
        const result = await connection.execute( sqlString, bindData );

        // 3. DB에서 응답받은 내용을 바탕으로 어떤 값을 return 할 지 결정.
        // 가령 성공 여부 등
        return {
            succeed:true,
            ...result,
            error:null
        };
    } catch (error) {
        // 4. 에러가 발생하면 어떤 에러인지 서버에 기록.
        console.error('오류 발생:', error);
        return {
            succeed:null,
            error:error
        };
    } finally {
        // DB 연결 해제(try에서 return 하면, finally에 있는 코드 수행 후 return 됨)
        if (connection) {
            await connection.close();
        }
    }
}


module.exports = db_mapUpdateHotspotPos;