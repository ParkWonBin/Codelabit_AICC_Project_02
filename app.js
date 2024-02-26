// .env 파일에서 환경변수 설정하기
require('dotenv').config();

// 세팅된 웹서버 가져오기
const app = require('./_initSetting')
const port = 3000;

// 라우팅 함수를 미들웨어(Middleware)로 처리
app.use('/', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/userCreate', require('./routes/userCreate'));
app.use('/map', require('./routes/map'));
// app.use('/mapImageUpload', require('./routes/mapImageUpload'));
// app.use('/boardMain', require('./routes/boardMain'));
// app.use('/logout', require('./routes/logout'));

// 게시판 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
