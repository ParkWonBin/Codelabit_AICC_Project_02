const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');

/**
 * 데이터베이스에 새로운 핫스팟을 생성합니다.
 *
 * 이 함수는 주어진 핫스팟 정보를 사용하여 데이터베이스에 새 핫스팟을 추가합니다.
 * 성공적으로 데이터가 추가되면, { succeed: true, error: null } 객체를 반환합니다.
 * 만약 작업 중 오류가 발생하면, { succeed: false, error: error } 객체를 반환하여,
 * 실패 여부와 오류 정보를 제공합니다.
 *
 * @author wbpark
 * @param {string} fileName - 핫스팟 이미지 파일의 이름입니다.
 * @param {string} sportName - 생성할 핫스팟의 이름입니다.
 * @param {number} top - 핫스팟의 상단 좌표(y_position)입니다.
 * @param {number} left - 핫스팟의 왼쪽 좌표(x_position)입니다.
 * @returns {{
 *   succeed: boolean,
 *   spotId: number
 *   error: string|Error
 * }}
 * .succeed - 이미지 등록 성공 여부
 * .spotId - 등록한 이미지의 id 가져오ㅛ기
 * .error - 에러 여부 혹은 에러 내역
 */
const db_mapCreateHotspot = async (fileName, sportName, top, left) => {
    let connection;
    // DB 네트워크 상태가 안좋으면 connection 만들 때부터 에러 발생하므로 Try 내부에 넣음.
    try {

        // 1. DB에 연결합니다. (연결정보는 dbConfig 사용)
        connection = await oracledb.getConnection(dbConfig);

        // 2. DB에 어떤 명령을 내릴지 SQL을 작성합니다.
        const sqlString = `
            INSERT INTO HOTSPOT (spot_idx, spot_name, image_path, x_position, y_position)
            VALUES (HOTSPOT_SEQ.NEXTVAL, :sportName, :fileName, :left, :top)
        `;
        const bindData = {fileName, sportName, top, left}
        const result = await connection.execute(sqlString, bindData);

        // 3. DB에서 응답받은 내용을 바탕으로 어떤 값을 return 할 지 결정.
        if (result.rowsAffected > 0) {
            // 방금 등록한 spot의 순번 가져오기
            const spotId = (await connection.execute(`
                                SELECT spot_idx
                                FROM HOTSPOT
                                WHERE image_path = :fileName`,
                    {fileName})
            ).rows[0][0]

            return {
                succeed: true,
                spotId:spotId,
                error: null
            };
        }else {
            return {
                succeed: false,
                spotId:null,
                error: null
            };
        }
    } catch (error) {
        // 4. 에러가 발생하면 어떤 에러인지 서버에 기록.
        console.error('오류 발생:', error);
        return {
            succeed: false,
            spotId:null,
            error: error
        };
    } finally {
        // DB 연결 해제(try에서 return 하면, finally에 있는 코드 수행 후 return 됨)
        if (connection) {
            await connection.close();
        }
    }
}


module.exports = db_mapCreateHotspot;