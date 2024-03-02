const oracledb = require('oracledb');
const dbConfig = require('../_dbConfig');

/**
 * 오라클 DB에서 핫스팟 리스트를 조회하여 반환합니다.
 *
 * 이 함수는 오라클 데이터베이스에 연결하여 'HOTSPOT' 테이블에서 핫스팟의 정보를 조회합니다.
 * 조회된 정보는 이미지 경로, X 좌표, Y 좌표, 핫스팟 ID, 핫스팟 이름, 핫스팟 주소, 지역 정보를 포함합니다.
 * 조회 결과가 있으면 해당 정보를 객체로 포맷하여 반환하고, 조회 결과가 없거나 오류가 발생한 경우,
 * 적절한 기본값 또는 오류 정보를 포함한 객체를 반환합니다.
 *
 * @author wbpark
 * @returns {{
 *   succeed: boolean,
 *   srcPath: string[],
 *   pos_x: number[],
 *   pos_y: number[],
 *   spot_id: number[],
 *   spot_name: string[],
 *   spot_address: string[],
 *   region: string[],
 *   error: string|Error
 * }}
 * .succeed - 로그인 성공 여부
 * .srcPath - 이미지 파일 경로 배열
 * .pos_x - 핫스팟의 X 좌표 배열
 * .pos_y - 핫스팟의 Y 좌표 배열
 * .spot_id - 핫스팟의 고유 ID 배열
 * .spot_name - 핫스팟의 이름 배열
 * .spot_address - 핫스팟의 주소 배열
 * .region - 핫스팟이 위치한 지역 배열
 * .error - 에러 여부 혹은 에러 내역
 */
const db_mapGetHotspotList = async () => {
    let connection;
    // DB 네트워크 상태가 안좋으면 connection 만들 때부터 에러 발생하므로 Try 내부에 넣음.
    try {

        // 1. DB에 연결합니다. (연결정보는 dbConfig 사용)
        connection = await oracledb.getConnection(dbConfig);

        // 2. DB에 어떤 명령을 내릴지 SQL을 작성합니다.
        const sqlString = 'SELECT image_path, x_position, y_position, spot_idx, spot_name ,spot_address, region from HOTSPOT';
        const bindData = {}
        const result = await connection.execute(sqlString, bindData);

        // 3. DB에서 응답받은 내용을 바탕으로 어떤 값을 return 할 지 결정.
        if (result.rows.length > 0) {
            const succeed = true
            const srcPath = result.rows.map(row => './images/upload/' + row[0]);
            const pos_x = result.rows.map(row => row[1]);
            const pos_y = result.rows.map(row => row[2]);
            const spot_id = result.rows.map(row => row[3]);
            const spot_name = result.rows.map(row => row[4]);
            const spot_address = result.rows.map(row => row[5]);
            const region = result.rows.map(row => row[6]);
            const error = null
            return {srcPath, pos_x, pos_y, spot_id, spot_name, spot_address, region, error}
        } else {
            return {
                succeed: true,
                srcPath: [],
                pos_x: [],
                pos_y: [],
                spot_id: [],
                spot_name: [],
                spot_address: [],
                region: [],
                error: null
            }
        }
    } catch (error) {
        // 4. 에러가 발생하면 어떤 에러인지 서버에 기록.
        console.error('오류 발생:', error);
        return {
            succeed: false,
            srcPath: [],
            pos_x: [],
            pos_y: [],
            spot_id: [],
            spot_name: [],
            spot_address: [],
            region: [],
            error: error
        }
    } finally {
        // DB 연결 해제(try에서 return 하면, finally에 있는 코드 수행 후 return 됨)
        if (connection) {
            await connection.close();
        }
    }
}


module.exports = db_mapGetHotspotList;