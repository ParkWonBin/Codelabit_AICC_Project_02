const express = require('express');
// const path = require('path')
// const oracledb = require('oracledb');
// const dbConfig = require('../_dbConfig');

const router = express.Router();

// static 경로를 사용하고 있기 때문에,
// router.get('/', ...)보다 static 경로의 index.html 이 우선순위가 높습니다.

// post 로 특정 데이터와 함께 진입한 경우, ejs를 랜더링 합니다.
router.post('/',  (req, res) => {
    res.render('index',{})
});

module.exports = router;