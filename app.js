// .env 파일에서 환경변수 설정합니다.
require('dotenv').config();

// 세팅된 웹서버 가져오기
// 파일분리를 빡세게 했기 때문에 참조 보기(어디서 생성된 애인지) : Ctrl+B
const app = require('./initSetting')
const port = 3000;

// 라우팅 함수를 미들웨어(Middleware)로 처리
// NOTE: static 경로의 폴더 내 index.html이 있으면, 해당 폴더명으로 get 진입했을 때 index.html을 보내줍니다.
// WARN: 아래 라우터에서 get처리를 하고자 한다면, static 경로 내 index.html 파일과 엔드포인트가 겹치지 않게 주의합니다.
// Example : http://localhost:3000/chatbot의 경우 라우터 대신 static 경로 내 index파일로 처리합니다.
app.get('/',(req,res)=>{res.redirect('/main')})
app.use('/main', require('./routes/main'));
app.use('/user', require('./routes/user'));
app.use('/map', require('./routes/map'));
app.use('/bulletin', require('./routes/bulletin'));

// 게시판 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
