
// app.js 실행했을 때, dotenv 파일을 수행하고 시작하기 떄문에.
// app.js 에서 다른 파일을 참조할 때, .env 환경변수에 접근할 수 있다.
// _initSetting 에서 oracledb 에 대한 환경설정을 했으므로.
// 다른 router 파일에서는 여기 계정 정보만 가지고 db 연결을 만들면 편함

// _dbConfig.js
module.exports = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,
    externalAuth: process.env.DB_EXTERNAL_AUTH === 'true'
};