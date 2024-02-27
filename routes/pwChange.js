const express = require('express');
const path = require('path')
const oracledb = require("oracledb");
const dbConfig = require("../_dbConfig");

const router = express.Router();

// http://localhost:3000/userCreate/
router.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '/../resources/pwChange.html'))
});

router.post('/', async (req, res, next) => {
    // 1. post 로 요청받으면, 데이터를 가져오는게 시작.
    const userId = req.session.userId;
    const { userPw, newPw, pwConfirm} = req.body;

    // 여기에서 newPw, pwConfirm 가 서로 같지 않으면, 실패했던 상황과 같이 처리해버리기.
    if (newPw === pwConfirm) {

        //console.log(req.body)

        // 2. DB 연결과 관련된 부분은 다른 함수랑 연결해서 처리
        // 계정 생성 정보를 입력하면, 가입 처리를 하는 함수.
        // 계정 생성이 성공하면 "성공" 를 보내주고, 실패하면 "중복" / "네트워크오류" 를 돌려주는 함수.
        const result = await pwChange(userId, userPw, newPw, pwConfirm);

        // 3. DB 요청 결과를 통해 어떤 화면과 연결시킬지 판단 및 결정.
        if (result === "성공") {
            // 가입된 계정으로 로그인한 화면으로 이동시키기
            console.log("비밀번호가 변경되었습니다... 자동으로 로그아웃 합니다.");
            res.redirect('/');
        } else if (result === '해당ID/PW가 없음') {
            console.log('해당ID/PW가 없음');
            res.render('login', {'userId': userId})
        } else if (result === "실패") {
            // 아이디 혹은 이름 중복됐다고 알려주기
            console.log("비밀번호가 변경되지 않았습니다.");
            res.render('login', {'userId': userId});
        } else {
            // DB 네트워크 오류로 작업 수행이 안된 경우 처리하기
            console.log("아마도 db 네트워크 상태가 안좋을지도..?")
            //TODO : 네트워크가 안좋은 경우 여기로 옵니다. 추후에 안내 화면으로 이동시켜주세요.
        }
    } else {
        // 비밀번호 확인 이랑 비밀번호랑 서로 다릅니다.
        res.render('login', {'userId': userId})
    }
})

// 4. DB 연결과 관련된 부분은 함수로 분리해서 따로 관리합니다.
async function pwChange(userId, userPw, newPw){
    let connection;
    try {
        // DB 네트워크 상태가 안좋으면 connection 만들 때부터 에러 발생하므로 Try 내부에 넣음.

        // 4.1. DB에 연결합니다. (연결정보는 dbConfig 사용)
        connection = await oracledb.getConnection(dbConfig);

        // 4.2. DB에 어떤 명령을 내릴지 SQL을 작성합니다.
        const sql_query = 'update users set user_pw = :newPw WHERE user_id = :userId AND user_pw = :userPw';
        const result =  await connection.execute(sql_query, {
            'userId':userId,
            'userPw':userPw,
            'newPw':newPw,
        });

        // 4.3. DB에서 응답받은 내용을 바탕으로 어떤 값을 return 할 지 결정.
        console.log(result)

        if(result.rowsAffected !== null && result.rowsAffected > 0) {
            return "성공";
        }
        else{
            return "해당ID/PW가 없음";
        }
    } catch (error) {

        // 4.4. 에러가 발생하면 어떤 에러인지 서버에 기록.
        console.error('오류 발생:', error.message);

        // 4.5. 에러 메시지를 통해 어떤 상황에서 어떻게 대처할지를 판단.
        if(error.message.includes("unique constraint")){
            // 2.1. 제약조건 때문에 에러가 난 케이스
            // 아이디나 닉네임 중복이 돼서 가입이 실패한 경우
            return "실패"
        }else {
            // 2.2. DB 연결 접속이 안되면 여기로 들어오게 됍니다.
            // console.log("아마도 db 네트워크 상태가 안좋을지도..?")
            // //TODO : 네트워크가 안좋은 경우 여기로 옵니다. 추후에 안내 화면으로 이동시켜주세요.
            return "DB 네트워크 상태 불량"
        }

    } finally {
        // DB 연결 해제(try에서 return 하면, finally에 있는 코드 수행 후 return 됨)
        if (connection) {
            await connection.close();
        }
    }
}

module.exports = router;