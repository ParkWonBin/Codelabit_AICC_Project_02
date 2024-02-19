// .env 파일에서 환경변수 설정하기
require('dotenv').config();

// 세팅된 웹서버 가져오기
const app = require('./_initSetting')
const port = 3000;

// 라우팅 함수를 미들웨어로 처리
// 미들웨어 (Middleware)는 Express 애플리케이션에서 요청(request)과 응답(response) 사이에 위치하여
// 요청에 대한 처리를 수행하고 응답을 생성하는 함수
app.use('/', require('./routes/index'));
// app.use('/addComment', require('./routes/addComment'));
// app.use('/boardMain', require('./routes/boardMain'));
// app.use('/create', require('./routes/create'));
// app.use('/deletePost', require('./routes/deletePost'));
// app.use('/detailPost', require('./routes/detailPost'));
// app.use('/editPost', require('./routes/editPost'));
// app.use('/login', require('./routes/login'));
// app.use('/loginFail', require('./routes/loginFail'));
// app.use('/logout', require('./routes/logout'));

// 게시판 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
