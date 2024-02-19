const express = require('express');
const path = require('path')
// const oracledb = require('oracledb');
// const dbConfig = require('../_dbConfig');

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'/../resources/login.html'))
});

router.post('/', async (req, res) => {

});

module.exports = router;