const express = require('express');
const path = require('path');
const oracledb = require('oracledb');
const dbconfig = require('../_dbConfig');

const router = express.Router();

router.get('/', async(req, res) => {
    res.sendFile(path.join(__dirname, '/../resources/userCreate.html'));
});

router.post('/', async(req, res) =>{
    const {userId, userPw, userName} = req.body;
    const result = await createUser(userId, userPw, userName);

    if(result === "성공"){
        console.log("가입이 완료 됐습니다. 자동으로 로그인 합니다.");
        res.render('login', {userId: userId});
    }

    else if(result === "실패"){
        res.render('userCreate', {userId, userName});
    }

    else{

    }
});

async function createUser(userId, userPw, userName){
    let connection;
    try{
        connection = await oracledb.getConnection(dbconfig);

        const sql_query = 'insert into users (user_id, user_pw, user_name) values (:userId, :userPw, :userName)';
        const reuslt = await connection.execute(sql_query, {userId, userPw, userName});

        return "성공";
    }

    catch(error){
        if(error.message.includes("unique constraint")){
            return "실패";
        }

        else{
            return "DB 네트워크 상태 불량";
        }
    }

    finally{
        if(connection){
            await connection.close();
        }
    }
}

module.exports = router;