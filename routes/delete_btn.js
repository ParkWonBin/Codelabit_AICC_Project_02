const express = require('express');
const path = require('path')
const oracledb = require('oracledb');
const dbConfig = require('../_dbConfig');

const router = express.Router();


router.get('/:img_name', async (req, res) => {
    // 로그인 여부 확인
    if (!req.session.loggedIn) {
        return res.redirect('/login'); // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    }
    const image_name = req.params.img_name;
    try {
        await customFunc(image_name, req, res); // customFunc 호출
    } catch (err) {
        console.error('오류 발생:', err);
        res.status(500).send('오류가 발생했습니다.');
    }
});
async function customFunc(){
    let  conn ;
    try {
        conn  = await oracledb.getConnection(dbConfig);

        // 게시글 삭제
        await conn.execute(
            `DELETE FROM imagedata WHERE image_name = :image_name`,
            [image_name]
        );

        // 변경 사항 커밋
        await conn.commit();

        // 삭제 후 게시판 메인 페이지로 리다이렉트
        const userId = req.session.userId; // 예시로 사용된 변수
        const userName = req.session.userName; // 예시로 사용된 변수
        res.redirect(`/map?id=${userId}&username=${userName}`);
    } catch (err) {
        console.error('게시글 삭제 중 오류 발생:', err);
        res.status(500).send('게시글 삭제 중 오류가 발생했습니다.');
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.error('오라클 연결 종료 중 오류 발생:', err);
            }
        }
    }
}





module.exports = router;