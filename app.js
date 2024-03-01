// .env 파일에서 환경변수 설정하기
require('dotenv').config();

// 세팅된 웹서버 가져오기
const app = require('./_initSetting')
const port = 3000;

// 라우팅 함수를 미들웨어(Middleware)로 처리
// 메인 경로는 static 폴더 내 index.html을 사용하므로 별도 라우팅 안함.
app.use('/main', require('./routes/main'));
// app.use('/login', require('./routes/login'));
// app.use('/userCreate', require('./routes/userCreate'));
// app.use('/map', require('./routes/map'));
// app.use('/mapImageUpload', require('./routes/mapImageUpload'));
// app.use('/mapDelete', require('./routes/mapSpotDelete'));
// app.use('/userManage', require('./routes/userManage'));
// app.use('/pwChange', require('./routes/pwChange'));
// app.use('/userDelete', require('./routes/userDelete'));
// app.use('/mapUpdate', require('./routes/mapSpotUpdate'));
// app.use('/mapImageUpload', require('./routes/mapImageUpload'));
// app.use('/chatbot', require('./routes/chatbot'));
// app.use('/boardMain', require('./routes/boardMain'));
// app.use('/logout', require('./routes/logout'));



// 게시판 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/main`);
});
