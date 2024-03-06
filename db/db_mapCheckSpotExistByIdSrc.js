const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');
const path = require('path');


/**
 * 지정된 spotId와 이미지 파일 경로를 기반으로 DB에서 해당 spot이 존재하는지 확인합니다.
 *
 * @author wbpark
 * @param {number} spotId
 * @param {string} src
 * @returns {{
 *   spotExist: boolean,
 *   error: string|Error
 * }} 반환 객체는 다음과 같은 속성을 포함합니다:
 * - spotExist: 데이터 존재 여부. true면 존재, false면 존재하지 않음.
 * - error: 에러 발생 시 에러 객체 또는 에러 메시지. 에러가 없으면 null.
 */
const db_mapCheckSpotExistByIdSrc = async (spotId, src) => {
    let connection;
    // DB 네트워크 상태가 안좋으면 connection 만들 때부터 에러 발생하므로 Try 내부에 넣음.
    try {

        // 1. DB에 연결합니다. (연결정보는 dbConfig 사용)
        connection = await oracledb.getConnection(dbConfig);

        // 2. DB에 어떤 명령을 내릴지 SQL을 작성합니다.
        const sqlString = 'SELECT spot_idx FROM hotspot WHERE spot_idx = :spotId AND image_path = :imagePath';
        const bindData = {
            spotId: spotId,
            imagePath: src
        }
        const result = await connection.execute(sqlString, bindData);

        // 3. DB에서 응답받은 내용을 바탕으로 어떤 값을 return 할 지 결정.
        return {
            spotExist: result.rows.length > 0,
            error: null
        };
    } catch (error) {
        // 4. 에러가 발생하면 어떤 에러인지 서버에 기록.
        console.error('오류 발생:', error);
        return {
            spotExist: null,
            error: error
        };
    } finally {
        // DB 연결 해제(try에서 return 하면, finally에 있는 코드 수행 후 return 됨)
        if (connection) {
            await connection.close();
        }
    }
}

module.exports = db_mapCheckSpotExistByIdSrc;