
// app.js 실행했을 때, dotenv 파일을 수행하고 시작하므로
// 이후 app.js 에서 다른 파일을 참조할 때, .env 환경변수에 접근할 수 있다.

// .env 파일 탬플릿 - 이런 느낌으로 작성합니다.
// # DB 연결
// DB_USER=hr
// DB_PASSWORD=hr
// DB_CONNECT_STRING=localhost:1521/xe
// DB_EXTERNAL_AUTH=false
//
// # DB 클라이언트
// ORACLEDB_INITORACLECLIENT=C:\wbpark\instantclient_21_13
//
// # 세션정보
// SESSION_SECRET_KEY=youMustChangeKeyDontUseThisString

//############################################################
// oracledb 모듈에 대한 기본 설정을 수행함.
const oracledb = require('oracledb');
oracledb.initOracleClient({ libDir: process.env.ORACLEDB_INITORACLECLIENT });
oracledb.autoCommit = true;

//############################################################
// app 초기설정
const express = require('express');
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session');

// express 객체 생성
app = express();

// 뷰엔진 적용 : html로 개발한 페이지는 ejs로 변환하기 쉬워서 ejs 사용.
app.set('view engine', 'ejs');

// 웬서버에서 root 폴더를 설정. 파일 리소스 라우팅 해주기
app.use('/', express.static(path.join(__dirname, 'resources')));

// bodyParser 없으면 req.body를 접근할 수 없다.
// 이후에 라우터에서 다음과 같은 방식으로 변수 받아오려고 미들웨어 사용
// const { title, content } = req.body;
app.use(bodyParser.urlencoded({extended:false}));

// JSON 형태의 요청 본문을 파싱하기 위해 express.json() 미들웨어를 사용합니다.
app.use(express.json());

// express-session 미들웨어 설정
app.use(session({
    secret: process.env.SESSION_SECRET_KEY, // 세션을 암호화하기 위한 임의의 키
    resave: false,
    saveUninitialized: true,
}));

module.exports = app