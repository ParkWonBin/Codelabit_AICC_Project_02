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
    }catch (e){
        console.log("오류발생 ㅠㅠ" + e)
    }finally {
    }
});

module.exports = router;