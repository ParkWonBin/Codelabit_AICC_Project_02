const express = require('express');
const path = require('path');
const oracledb = require('oracledb');
const dbConfig = require('../_dbConfig');

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'/../resources/login.html'))
});

router.post('/', async (req, res) => {
    const { userId, userPw } = req.body;
    console.log('username '+userId)
    console.log('password '+userPw)

    let connection;
    try{
        connection = await oracledb.getConnection(dbConfig);
        const sql_query = 'select * from users where user_id = :userId and user_pw = :userPw';
        const result =  await connection.execute(sql_query, {userId, userPw});

       console.log(result.rows)
        if(result.rows.length > 0){
            console.log("로그인 성공")
            res.render('login',{userId:userId})
        }else {
            console.log("로그인 실패")
            res.render('loginFail',{})
        }

    }catch (e){
        console.log("오류발생 ㅠㅠ" + e)
    }finally {
    }

});

module.exports = router;