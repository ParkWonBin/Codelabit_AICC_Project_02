// 환경변수 불러오고 출력해보기
require('dotenv').config({ path: '../.env' })

const test_app = require('../_initSetting');
const port = 3000;

test_app.use('/userCreate', require('./test_userCreate'));

test_app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}/userCreate`);
})