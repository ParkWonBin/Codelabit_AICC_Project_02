const oracledb = require('oracledb');
const dbConfig = require('../_dbConfig');

/**
 * @summary 특정 게시글의 상세 정보를 조회합니다.
 * @author (개선) wbpark
 * @author (초안) 최원호
 * @param {number} postId - 조회할 게시글의 ID입니다.
 * @returns {{
 * succeed: boolean,
 * postId: number,
 * title: string,
 * writerId: number,
 * writerName: string,
 * content: string,
 * created_at: string,
 * views: number,
 * error: string|error
 * }}
 * @description
 * .succeed: 작업 성공 여부<br>
 * .postId: 게시글 ID<br>
 * .title: 게시글 제목<br>
 * .writerId: 작성자 ID<br>
 * .writerName: 작성자 이름<br>
 * .content: 게시글 내용<br>
 * .created_at: 게시글 작성 시간<br>
 * .views: 게시글 조회수<br>
 * .error: 에러 발생 시 에러 내용
 */
const db_bulletinGetPostByPostId = async (postId) => {
    let connection;
    // DB 네트워크 상태가 안좋으면 connection 만들 때부터 에러 발생하므로 Try 내부에 넣음.
    try {

        // 1. DB에 연결합니다. (연결정보는 dbConfig 사용)
        connection = await oracledb.getConnection(dbConfig);

        // 2. DB에 어떤 명령을 내릴지 SQL을 작성합니다.
        const sqlString =  `
            SELECT b.title,
                   b.writer_id                         AS writerId,
                   m.member_name                       AS writerName,
                   DBMS_LOB.SUBSTR(b.content, 4000, 1) AS content,
                   TO_CHAR(b.created_at, 'YYYY-MM-DD') AS created_at,
                   b.views
            FROM bulletin b
                     JOIN member m ON b.writer_id = m.member_id
            WHERE b.post_id = :postId`;
        const bindData = {postId}
        const options =  {fetchInfo:{content:{type:oracledb.STRING }}}

        const result = await connection.execute(sqlString, bindData, options);

        // 3. DB에서 응답받은 내용을 바탕으로 어떤 값을 return 할 지 결정.
        // 가령 성공 여부 등
        if(result.rows.length>0){
            return {
                succeed: true,
                postId: postId,
                title: result.rows[0][0],
                writerId: result.rows[0][1],
                writerName: result.rows[0][2],
                content: result.rows[0][3],
                created_at: result.rows[0][4],
                views: result.rows[0][5],
                error: null
            };
        }else{
            return {
                succeed: false,
                postId: postId,
                title: null,
                writerId: null,
                writerName: null,
                content: null,
                created_at: null,
                views: null,
                error: '조회되지 않습니다.'
            };
        }
    } catch (error) {
        // 4. 에러가 발생하면 어떤 에러인지 서버에 기록.
        console.error('오류 발생:', error);
        return {
            succeed: null,
            postId: postId,
            title: null,
            writerId: null,
            writerName: null,
            content: null,
            created_at: null,
            views: null,
            error: error
        };
    } finally {
        // DB 연결 해제(try에서 return 하면, finally에 있는 코드 수행 후 return 됨)
        if (connection) {
            await connection.close();
        }
    }
}


module.exports = db_bulletinGetPostByPostId;