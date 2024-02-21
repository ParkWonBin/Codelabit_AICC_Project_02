require('dotenv').config({ path: '../.env' })
console.log("IP : " + process.env.DB_CONNECT_STRING)
console.log("ID : " + process.env.DB_USER)
console.log("연결예시 :")

const oracledb = require('oracledb');
oracledb.initOracleClient({ libDir: process.env.ORACLEDB_INITORACLECLIENT });
oracledb.autoCommit = true;

// db 정보 가져와서 쿼리 테스트 해보기
const dbConfig = require('../_dbConfig');
selectDatabase();

// DB Select
async function selectDatabase() {
    
    let connection = await oracledb.getConnection(dbConfig);
    let binds = {};
    let options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT   // query result format
    };
    
    let result = await connection.execute(
        "SELECT COUNT(*) FROM users", binds, options
        );
        
        console.log(result.rows[0]);
        await connection.close();
    }