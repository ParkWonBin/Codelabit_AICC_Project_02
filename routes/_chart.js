const express = require('express');
const _db_chart_bulletinUpdatePostViewByPostId = require("../db/_db_chart_bulletinUpdatePostViewByPostId");
const router = express.Router();
router.get('/', async (req, res) => {
//:post_Id/:views
    try {
        // URL의 파라미터에서 post_Id와 views를 가져옵니다.
        const chartIdViews = await _db_chart_bulletinUpdatePostViewByPostId(post_Id,views);

        // 2. 계산식 사용
        // DB에서 데이터를 생성/조회/수정/삭제 하거나 화면을 구성하는데 필요한 데이터를 구성합니다.


        // 3. 응답 지정
        // 서버에서 클라이언트에게 어떤 화면을 보여줄지 결정합니다.
        // res.send, res.sendFile, res.render, res.redirect 등 결과 화면을 지정합니다.
        // 응답 예시
        // res.send("html형식으로 문자열을 만들어 내보냅니다.")
        // res.sendFile(path.join(__dirname,'/../resources/xxx.html'))
        res.render('bulletinBoard', { post_Id, views });
    } catch (error) {
        console.error(error);
        // 오류 처리
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', async (req, res) => {

    // 1. post 로 요청받으면, 데이터를 가져오는게 시작. (아래는 예시)
    // req.query, req.params, req.body, req.session 등 데이터를 가져옵니다.
    // const{ a,b,c } = req.body

    // 2. DB 연결과 관련된 부분은 다른 함수랑 연결해서 처리
    // const result = await customFunc()

    // 3. DB 요청 결과를 통해 어떤 화면과 연결시킬지 판단 및 결정.
    // res.render('', {})
});

module.exports = router;