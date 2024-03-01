const express = require('express');
const path = require('path');
const oracledb = require('oracledb');
const dbConfig = require('../_dbConfig');

const router = express.Router();

router.get('/', (req, res) => {
    req.session.userNo = ''
    req.session.userId = ''
    req.session.userName = ''
    res.render('logout');
});


//

module.exports = router;