const express = require('express');
const path = require('path')
const oracledb = require("oracledb");
const dbConfig = require("../_dbConfig");
// const oracledb = require('oracledb');
// const dbConfig = require('../_dbConfig');

const router = express.Router();

// http://localhost:3000/userCreate/
router.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '/../resources/userCreate.html'))
});

router.post('/', async (req, res) => {
    const {userId, userPw, userName} = req.body
    console.log(req.body)
    let connection;
    try{
        connection = await oracledb.getConnection(dbConfig);
        const sql_query = 'INSERT INTO users (user_id, user_pw, user_name) VALUES (:userId, :userPw, :userName)'
        const result =  await connection.execute(sql_query, {userId, userPw, userName});

        console.log(result)
        console.log("가입이 완료 됐습니다. 자동으로 로그인 합니다.")
        res.render('login',{userId:userId})
    }catch (e){
        console.log("오류발생 ㅠㅠ" + e)

        if(e.message.includes("unique constraint")){
            console.log("아이디 혹은 닉네임이 중복된 경우입니다.")
            res.render('userCreate',{userId, userName})

        }else {
            console.log("아마도 db 네트워크 상태가 안좋을지도..?")
           //TODO : 네트워크가 안좋은 경우 여기로 옵니다. 추후에 안내 화면으로 이동시켜주세요.
        }

    }finally {
    }
});

module.exports = router;