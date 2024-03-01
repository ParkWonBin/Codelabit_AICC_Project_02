// .env 파일에서 환경변수 설정하기
require('dotenv').config();

// 세팅된 웹서버 가져오기
const app = require('./_initSetting')
const port = 3000;

// 라우팅 함수를 미들웨어(Middleware)로 처리
// app.use('/', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/userCreate', require('./routes/userCreate'));
app.use('/map', require('./routes/map'));
app.use('/mapImageUpload', require('./routes/mapImageUpload'));
app.use('/mapDelete', require('./routes/mapSpotDelete'));
// app.use('/userManage', require('./routes/userManage'));
app.use('/pwChange', require('./routes/pwChange'));
app.use('/userDelete', require('./routes/userDelete'));
app.use('/mapUpdate', require('./routes/mapSpotUpdate'));
// app.use('/mapImageUpload', require('./routes/mapImageUpload'));
app.use('/chatbot', require('./routes/chatbot'));
// app.use('/boardMain', require('./routes/boardMain'));
app.use('/logout', require('./routes/logout'));




app.get('/', async (req, res) => {
    let conn;
    try {
       conn = await oracledb.getConnection(dbConfig);
        let info_bulletin=await conn.execute(
           `SELECT  writer, title, to_char(created_at,'YYYY-MM-DD'), views
                FROM (
                    SELECT  b.title, b.writer_id AS writer, b.created_at, b.views,
                            ROW_NUMBER() OVER (ORDER BY p.created_at DESC) AS rn
                    FROM bulletin b
                    JOIN members m ON b.writer_id = m.member_id
                    )
             WHERE rn BETWEEN 1 AND 10`);

        res.render('index',{bulletin:info_bulletin.rows});

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

// 게시판 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
