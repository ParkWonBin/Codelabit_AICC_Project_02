const express = require('express');
const path = require('path');
const oracledb = require('oracledb');
const dbConfig = require('../_dbConfig');

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/../resources/login.html'));
});


router.post('/', async (req, res) => {
    // 요청온거 확인
    const { userId, userPw } = req.body;
    // const userId = req.body.userId;
    // const userPw = req.body.userPw;

    // console.log('username '+userId)
    // console.log('password '+userPw)

    // SQL 쿼리 실행하고 결과 가져오기
    const result = await varifyID(userId,userPw)
    console.log(result)

    // 결과에 따라서 어떤 응답 보내줄지 확인
    if(result !== null){
        console.log("로그인 성공")

        // 로그인 성공한 기념으로 session에 데이터를 저장해 놓기로 합니다.
        req.session.userNo = result.userNo
        req.session.userId = result.userId
        req.session.userName = result.userName

        res.render('login',{'userId':userId})
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
        const sql_query = 'SELECT user_id, user_name, user_no FROM users WHERE user_id = :userId AND user_pw = :userPw';
        const result =  await connection.execute(sql_query, {'userId':userId, 'userPw':userPw});

        // 조회 결과에 행이 있으면 리턴하기
        if(result.rows.length > 0){
            return {
                'userId' : result.rows[0][0],
                'userName' : result.rows[0][1],
                'userNo' : result.rows[0][2]
            };
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