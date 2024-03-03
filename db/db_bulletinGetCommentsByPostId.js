const oracledb = require('oracledb');
const dbConfig = require('../_dbConfig');

/**
 * @author wbpark
 * @param {number} postId
 * @returns {
 *   succeed: boolean,
 *   commentTree: Array<{
 *     writer_id: number,
 *     writerName: string,
 *     created_at: string,
 *     content: string,
 *     parent_comment_id: number|null,
 *     children: Array<comments>
 *   }>,
 *   error: string|Error|null
 * }
 * @summary 특정 게시글의 댓글 정보를 계층적 구조로 조회하여 반환합니다.
 * @description 이 함수는 게시글 ID를 기반으로 해당 게시글의 모든 댓글을 조회합니다.<br>
 * 각 댓글은 작성자 ID, 작성자 이름, 생성 일시, 댓글 내용, 자식 댓글들을 포함합니다.<br>
 * 이 함수는 댓글들 사이의 부모-자식 관계를 반영하여 트리 구조를 생성하고, 최상위 댓글부터 시작하는 계층적 댓글 목록을 반환합니다.<br>
 * .succeed - 작업 성공 여부를 나타냅니다.<br>
 * .comments - 계층적 구조로 정렬된 댓글 목록입니다.<br>
 * .error - 오류 발생 시 오류 내용입니다.<br>
 */

const db_bulletinGetCommentsByPostId = async (postId) => {
    let connection;
    // DB 네트워크 상태가 안좋으면 connection 만들 때부터 에러 발생하므로 Try 내부에 넣음.
    try {

        // 1. DB에 연결합니다. (연결정보는 dbConfig 사용)
        connection = await oracledb.getConnection(dbConfig);

        // 2. DB에 어떤 명령을 내릴지 SQL을 작성합니다.
        const sqlString = `
            SELECT c.writer_id                         AS writerId,
                   m.member_name                       AS writerName,
                   TO_CHAR(c.created_at, 'YYYY-MM-DD') AS created_at,
                   c.content,
                   c.parent_comment_id
            FROM comments c
                     JOIN member m ON c.writer_id = m.member_id
            WHERE c.post_id = :postId
            ORDER BY c.created_at ASC
        `;
        const bindData = {postId};
        const options = {fetchInfo: {content: {type: oracledb.STRING}}};
        const result = await connection.execute(sqlString, bindData, options);

        // 트리구조로 변환하는 함수 생성
        const createCommentsTree = (rows) => {
            // 오브젝트 구조로 변환
            const comments = rows.map(([writerId, writerName, created_at, content, parent_comment_id]) => ({
                writerId,
                writerName,
                created_at,
                content,
                parent_comment_id,
                children: [],
            }));

            // 검색을 위한 매핑관계 생성
            const commentMap = {};
            comments.forEach(comment => {
                commentMap[comment.writerId] = comment;
            });

            // 노드 연결
            const rootComments = [];
            comments.forEach(comment => {
                if (comment.parent_comment_id) {
                    commentMap[comment.parent_comment_id].children.push(comment);
                } else {
                    rootComments.push(comment);
                }
            });
            // 결과 반환
            return rootComments
        }

        // 트리 생성
        const commentTree = createCommentsTree(result.rows)
        // 내용물은 대충 이론 모양으로 들어있습니다.
        // { 작성자id, 작성자이름, 생성일시, 댓글내용, cilderen:[
        //     { 작성자id, 작성자이름, 생성일시, 댓글내용, cilderen:[{...} ]},
        //     { 작성자id, 작성자이름, 생성일시, 댓글내용, cilderen:[{...} ]}]
        //    },
        // { 작성자id, 작성자이름, 생성일시, 댓글내용, cilderen:[{...} ]}
        //]

        // 3. DB에서 응답받은 내용을 바탕으로 어떤 값을 return 할 지 결정.
        return {
            succeed: true,
            commentTree,
            error: null
        };
    } catch (error) {
        // 4. 에러가 발생하면 어떤 에러인지 서버에 기록.
        console.error('오류 발생:', error);
        return {
            succeed: null,
            commentTree: null,
            error: error
        };
    } finally {
        // DB 연결 해제(try에서 return 하면, finally에 있는 코드 수행 후 return 됨)
        if (connection) {
            await connection.close();
        }
    }
}


module.exports = db_bulletinGetCommentsByPostId;