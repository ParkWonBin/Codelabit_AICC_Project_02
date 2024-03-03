
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
// oracledb 모듈에 대한 기본 설정을 수행합니다.
// DB 접속 및 계정 정보 매핑은 db 폴더에서 구현된 모델 함수들에서 수행합니다.
// DB와 관련된 직접적인 동작은 모두 db 폴더 내 함수에서 처리합니다.
// db 폴더 밖에서는 db 폴더 내에서 정의한 인터페이스만을 사용하여 DB에 접근합니다.
const oracledb = require('oracledb');
oracledb.initOracleClient({ libDir: process.env.ORACLEDB_INITORACLECLIENT });
oracledb.autoCommit = true;

//############################################################
// Express 웹서버를 생성하고 미들웨어를 장착합니다.
const express = require('express');
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session');

// 웹서버, Express 객체 생성합니다.
app = express();

// 유사한 패턴의 html을 재사용하기 위해 html과 유사한 ejs를 사용합니다.
// 라우터에서 res.render 사용 시, 해당 view engin 설정에 의해 ejs 파일을 렌더링 합니다.
// 라우터에서 res.render 사용 시, 파일을 탐색할 폴더를 설정합니다.
// views 폴더는 express 기본 설정된 폴더이나, 나중에 헷갈릴 것 같아 코드 내 명시해둡니다.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// 정적 파일 호스팅 경로를 지정합니다. 웹서버로 폴더경로/파일명 을 get으로 요청한 경우 해당 파일을 호스팅해줍니다.
// 클라이언트가 폴더명으로 경로로 get 요청한 경우, 해당 폴더에서 index.html 파일을 찾아 표시해줍니다.
app.use('/', express.static(path.join(__dirname, 'resources')));

// form 테그에서 input 데이터를 파싱해오기 위해 바디파서를 사용합니다.
// bodyParser는 해당 form에서 input의 name과 value로 req.body 객체를 설정해줍니다.
app.use(bodyParser.urlencoded({extended:false}));

// JSON 형태의 요청 본문을 파싱하기 위해 express.json() 미들웨어를 사용합니다.
// JSON 형태로 이미지 업로드 요청을 처리하기 위해 요청의 크기를 최대 50mb로 상향 조정합니다.
// 해당 설정은 현재 프로젝트의 map에서 파일 업로드를 위해 필요합니다.
app.use(express.json({ limit: '50mb' }));

// 로그인 중인 유저를 구분하기 위해 세션 정보를 사용합니다.
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
}));

module.exports = app