const express = require('express');
const path = require('path');
const oracledb = require('oracledb');
const dbConfig = require('../_dbConfig');

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'/../resources/login.html'))
});

router.post('/', async (req, res) => {
    // 요청온거 확인
    const { userId, userPw } = req.body;
    console.log('username '+userId)
    console.log('password '+userPw)

    // SQL 쿼리 실행하고 결과 가져오기
    const result = await varifyID(userId,userPw)
    console.log(result)

    // 결과에 따라서 어떤 응답 보내줄지 확인
    if(result !== null){
        console.log("로그인 성공")
        res.render('login',{userId:userId})
    }else {
        console.log("로그인 실패")
        res.render('loginFail')
    }

});

async function varifyID(userId,userPw){
    let connection;
    try {
        // DB 네트워크 상태가 안좋으면 connection 만드는 데부터 에러나므로 Try 내부에 넣음.
        connection = await oracledb.getConnection(dbConfig);

        // sql 쿼리 만들기
        connection = await oracledb.getConnection(dbConfig);
        const sql_query = 'select * from users where user_id = :userId and user_pw = :userPw';
        const result =  await connection.execute(sql_query, {userId, userPw});

        // 조회 결과에 행이 있으면 리턴하기
        if(result.rows.length > 0){
            return result.rows;
        }else{
            return null;
        }
    } catch (error) {
        console.error('오류 발생:', error);
        return null;
    } finally {
        // 연결정보 남아있으면 close
        if (connection) {
            await connection.close();
        }
    }
}

module.exports = router;