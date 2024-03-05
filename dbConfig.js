//############################################################
// oracledb 접속정보입니다.
// DB 접속 및 계정 정보 매핑은 db 폴더에서 구현된 모델 함수들에서 수행합니다.
// DB와 관련된 직접적인 동작은 모두 db 폴더 내 함수에서 처리합니다.
// db 폴더 밖에서는 db 폴더 내에서 정의한 인터페이스만을 사용하여 DB에 접근합니다.

// dbConfig.js
module.exports = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,
    externalAuth: process.env.DB_EXTERNAL_AUTH === 'true'
};