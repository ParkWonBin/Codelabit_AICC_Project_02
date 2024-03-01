const express = require('express');
// const path = require('path')

/**
 * main 페이지의 get 요청 담당합니다.
 * db연결이 불필요한 화면요청은 main에서 일괄적으로 관리합니다.
 * db연결이 필요한 요청은 user, map, board 등에서 관리합니다.
 * main에서 관리하는 페이지는 ejs 탬플릿 2개를 최대한 재사용합니다.
 *
 * 위와 같은 패턴으로 화면을 생성하는 이유는
 * 1. router 파일에서 일괄적으로 요청 경로 및 변수를 제어하기 위함.
 * 2. ejs에서 a태그, form태그로 요청경로 및 방식을 설정하는 부분을 배제하기 위함.
 * 3. 중복된 코드를 제거하고 재사용성을 높히기 위함.
 * */
const router = express.Router();

// http://localhost:3000/main
router.get('/', (req, res) => {
    // 메인페이지 진입할 때 팝업 띄울거 있으면 띄우기
    const alertMsg = (req.query.alertMsg)? req.query.alertMsg : null

    // 로그인 여부에 따라 페이지 보여주기
    if(req.session.userId){
        //로그인인 된 상태
        res.render('mainLayout', {
            alertMsg : alertMsg,
            title: `${req.session.userId}님 환영합니다.`,
            data: [
                {href: '/map', text: '둘러보기'},
                {href: '/main/mypage', text: '마이페이지'},
                {href: '/board', text: '게시판'}
            ]
        })
    }else{
        // 로그인 안된 상태
        res.render('mainLayout', {
            alertMsg : alertMsg,
            title: '메인페이지 입니다.',
            data: [
                {href: '/map', text: '둘러보기'},
                {href: '/main/login', text: '로그인'},
                {href: '/board', text: '게시판'}
            ]
        })
    }
});

// http://localhost:3000/main/mypage
router.get('/mypage', (req, res) => {
    res.render('mainLayout', {
        alertMsg : null,
        title: '회원정보 페이지 입니다.',
        data: [
            {href: '/', text: '처음으로'},
            {href: '/main/UpdateUser', text: '비밀번호변경'},
            {href: '/main/DeleteUser', text: '회원탈퇴'}
        ]
    })
});

// http://localhost:3000/main/login
router.get('/login',(req,res)=>{
    const alertMsg = (req.query.alertMsg)? req.query.alertMsg : null

    // url 쿼리로 로그인 실패 여부를 전달해주면 로그인 실패 페이지 띄워주기
    res.render('mainForm', {
        alertMsg: alertMsg,
        title: '로그인 페이지 입니다',
        action: '/user',
        method: 'post',
        inputs:[
            {name:'userId', text:'아이디', required:true},
            {name:'userPw', text:'비밀번호', required:true}
        ],
        buttons:[
            {tagName:'a', attr:`href=/main/CreateUser`, text:'회원가입'},
            {tagName:'button', attr:`type='submit'`, text:'로그인'}
        ]
    })
})

// http://localhost:3000/main/CreateUser
router.get('/CreateUser',(req,res)=>{
    const alertMsg = (req.query.alertMsg)? req.query.alertMsg : null

    res.render('mainForm', {
        alertMsg: alertMsg,
        title: '회원가입 페이지 입니다',
        action: '/user',
        method: 'PUT',
        inputs:[
            {name:'userName', text:'이름', required:true},
            {name:'userId', text:'아이디', required:true},
            {name:'userPw', text:'비밀번호', required:true},
            {name:'userPwConform', text:'비밀번호확인', required:true}
        ],
        buttons:[
            {tagName:'button', attr:`type='submit'`, text:'회원등록'},
            {tagName:'a', attr:`href=/main style=background-color:crimson`, text:'취소'}
        ]
    })
})

// http://localhost:3000/main/UpdateUser
router.get('/UpdateUser',(req,res)=>{
    const alertMsg = (req.query.alertMsg)? req.query.alertMsg : null

    res.render('mainForm', {
        alertMsg: alertMsg,
        title: '비밀번호를 변경합니다',
        action: '/user',
        method: 'PATCH',
        inputs:[
            {name:'userPwPrev', text:'현재 비밀번호', required:true},
            {name:'userPwNew', text:'새 비밀번호', required:true},
            {name:'userPwNewConform', text:'새 비밀번호 확인', required:true}
        ],
        buttons:[
            {tagName:'a', attr:`href=/main`, text:'취소'},
            {tagName:'button', attr:`type='submit' style=background-color:limegreen`, text:'변경'}
        ]
    })
})

// http://localhost:3000/main/DeleteUser
router.get('/DeleteUser',(req,res)=>{
    const alertMsg = (req.query.alertMsg)? req.query.alertMsg : null

    res.render('mainForm', {
        alertMsg: alertMsg,
        title: '회원탈퇴 페이지 입니다',
        action: '/user',
        method: 'DELETE',
        inputs:[
            {name:'userPw', text:'비밀번호', required:true},
            {name:'userPwConform', text:'비밀번호확인', required:true}
        ],
        buttons:[
            {tagName:'a', attr:`href=/main`, text:'취소'},
            {tagName:'button', attr:`type='submit' style=background-color:crimson`, text:'탈퇴'}
        ]
    })
})

module.exports = router;