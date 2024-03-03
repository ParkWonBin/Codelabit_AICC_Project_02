const oracledb = require('oracledb');
const dbConfig = require('../_dbConfig');

/**
 * @summary 이 함수는 특정 범위 내의 게시글 목록 데이터를 조회합니다. 범위는 시작 행과 종료 행으로 지정됩니다.
 * @author (개선) wbpark
 * @author (초안) 최원호
 * @returns {{
 * succeed:boolean,
 * post_id: number[],
 * writer: string[],
 * member: string[],
 * title: string[],
 * created_at: timestamp[],
 * views: number[],
 * comments_count: number[],
 * error:string|error
 * }}
 * @description
 * .succeed: 작업의 성공 여부를 나타냅니다.<br>
 * .post_id: 조회된 게시글의 ID 배열입니다.<br>
 * .writer: 게시글 작성자의 ID 배열입니다.<br>
 * .member: 게시글 작성자의 이름 배열입니다.<br>
 * .title: 게시글 제목 배열입니다.<br>
 * .created_at: 게시글 생성 시간의 배열입니다.<br>
 * .views: 게시글 조회수 배열입니다.<br>
 * .comments_count: 각 게시글에 대한 댓글 수 배열입니다.<br>
 * .error: 오류 발생 시 오류 메시지 또는 오류 객체입니다.<br>
 */
const db_bulletinGetTotalPostCount = async (startRow,endRow) => {
    let connection;
    // DB 네트워크 상태가 안좋으면 connection 만들 때부터 에러 발생하므로 Try 내부에 넣음.
    try {

        // 1. DB에 연결합니다. (연결정보는 dbConfig 사용)
        connection = await oracledb.getConnection(dbConfig);

        // 2. DB에 어떤 명령을 내릴지 SQL을 작성합니다.
        const sqlString = `
            SELECT post_id,
                   writerId,
                   writerName,
                   title,
                   to_char(created_at, 'YYYY-MM-DD'),
                   views,
                   (select count(*) from comments c where c.post_id = b.post_id) as comments_count
            FROM (SELECT b.post_id,
                         b.title,
                         b.writer_id   AS writerId,
                         m.member_name AS writerName,
                         b.created_at,
                         b.views,
                         ROW_NUMBER() OVER (ORDER BY b.created_at DESC, b.post_id DESC) AS rn
                  FROM bulletin b
                           JOIN member m ON b.writer_id = m.member_id) b
            WHERE rn BETWEEN :startRow AND :endRow`;
        const bindData = {startRow,endRow}
        const result = await connection.execute(sqlString, bindData);

        // 3. DB에서 응답받은 내용을 바탕으로 어떤 값을 return 할 지 결정.
        // 가령 성공 여부 등
        return {
            succeed: true,
            postId: result.rows.map(row => row[0]),
            writerId : result.rows.map(row => row[1]),
            writerName: result.rows.map(row => row[2]),
            title: result.rows.map(row => row[3]),
            created_at: result.rows.map(row => row[4]),
            views: result.rows.map(row => row[5]),
            comments_count: result.rows.map(row => row[6]),
            error: null
        };
    } catch (error) {
        // 4. 에러가 발생하면 어떤 에러인지 서버에 기록.
        console.error('오류 발생:', error);
        return {
            succeed: null,
            postId: [],
            writerId: [],
            writerName: [],
            title: [],
            created_at: [],
            views: [],
            comments_count: [],
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