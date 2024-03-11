// 라우터 설정을 볼 떄 중점사항:
// 라우터에서 무엇을 참조하지 않았는가가 중요하다.
// 참조한 녀석은 대부분 ejs 관련이고. db연결 등은 라우터에서 접근을 하지 않는다.
// NOTE: 라우트는 DB와 관련된 내용을 모른다!! 모르게 설계하고 구현하고 만들어라..!


// NOTE : Main에서 main.ejs 하나로 모든 화면을 제작하는 이유와 의도:
// 의도 : 경로와 관련된 모든 설정은 라우터에서 하고 싶었습니다.
// 용어 : 엔드포인트란 : 라우터에서 요청을 처리할떄. 결국 어느 함수랑 연결되는지 최종 도착지를 의미한다. (url 구조)
// 이유 :
// ejs 안에 a테그나 버튼, 혹은 form action 에서 endpoint를 설정하는 부분이 있으면..
// 라우팅 관련 경로 에러가 생겼을떄 ejs 내부도 봐야하는 상황이 생기는게 싫었다.
// 그래서 라우팅 파일 안에서 전체적인 엔드포인트 설정을 하고자했다.
// a 테그 관련되 엔드포인트는 해당 a테그 만드는 부분의 herf 부분을 참고하고
// button 관련된 엔드포인트는 해당 render 하는 곳에 action, method 항목을 참고하자.
// 요약 : 라우팅 endbPoint에 대한 MasterFile 속성으로 현재 문서를 만든다.(의도/이유/목표)였던 것.

const express = require('express');

// 전체 코드 블록 숨기기 : Ctrl+Shift+'-'
// 전체 코드 블록 열기 : Ctrl+Shift+'+'
// 엔드포인트 바로 열기 단축키 : Ctrl+(URL주소)클릭

// 라우터에서 지원하는 앤드포인트
// get : http://localhost:3000/main
// get : http://localhost:3000/main/login
// get : http://localhost:3000/main/CreateUser
// get : http://localhost:3000/main/UpdateUser
// get : http://localhost:3000/main/DeleteUser

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

// NOTE :
// ejs rendering 할 때, tag 에 속성값 입력 시, = 옆에 쌍따옴표 넣지 말것.
// 이런 식으로 입력해야 정상작동하고 href=/main/CreateUser type=submit

// http://localhost:3000/main
router.get('/', (req, res) => {
    // 메인페이지 진입할 때 팝업 띄울거 있으면 띄우기
    const alertMsg = (req.query.alertMsg)? req.query.alertMsg : null
    const memberName = req.session.memberName

    // 로그인 여부에 따라 페이지 보여주기
    if(memberName){
        //로그인인 된 상태
        res.render('main', {
            alertMsg : alertMsg,
            title: `${memberName}님 환영합니다.`,
            buttons:[
                {tagName:'a', attr:`href=/map`, text:'둘러보기'},
                {tagName:'a', attr:`href=/main/mypage`, text:'마이페이지'},
                {tagName:'a', attr:`href=/bulletin`, text:'게시판'},
                {tagName:'a', attr:`href=/user/logout`, text:'로그아웃'}
            ]
        })
    }else{
        // 로그인 안된 상태
        res.render('main', {
            alertMsg : alertMsg,
            title: '메인페이지 입니다.',
            buttons:[
                {tagName:'a', attr:`href=/map`, text:'둘러보기'},
                {tagName:'a', attr:`href=/main/login`, text:'로그인'},
                {tagName:'a', attr:`href=/bulletin`, text:'게시판'}
            ]
        })
    }
});

// http://localhost:3000/main/mypage
router.get('/mypage', (req, res) => {
    res.render('main', {
        alertMsg : null,
        title: '회원정보 페이지 입니다.',
        buttons:[
            {tagName:'a', attr:`href=/main`, text:'처음으로'},
            {tagName:'a', attr:`href=/main/UpdateUser`, text:'비밀번호변경'},
            {tagName:'a', attr:`href=/main/DeleteUser`, text:'회원탈퇴'}
        ]
    })
});

// http://localhost:3000/main/login
router.get('/login',(req,res)=>{
    const alertMsg = (req.query.alertMsg)? req.query.alertMsg : null

    // url 쿼리로 로그인 실패 여부를 전달해주면 로그인 실패 페이지 띄워주기
    res.render('main', {
        alertMsg: alertMsg,
        title: '로그인 페이지 입니다',
        action: '/user/login',
        method: 'post',
        inputs:[
            {name:'userId', text:'아이디', required:true},
            {name:'userPw', text:'비밀번호', type:'password', required:true}
        ],
        buttons:[
            {tagName:'a', attr:`href=/main/CreateUser`, text:'회원가입'},
            {tagName:'button', attr:`type=submit`, text:'로그인'}
        ]
    })
})

// http://localhost:3000/main/CreateUser/
router.get('/CreateUser',(req,res)=>{
    const alertMsg = (req.query.alertMsg)? req.query.alertMsg : null

    res.render('main', {
        alertMsg: alertMsg,
        title: '회원가입 페이지 입니다',
        action: '/user/create',
        method: 'POST',
        inputs:[
            {name:'userName', text:'이름', required:true},
            {name:'userId', text:'아이디', required:true},
            {name:'userPw', text:'비밀번호',type:'password', required:true},
            {name:'userPwConform', text:'비밀번호확인',type:'password', required:true}
        ],
        buttons:[
            {tagName:'button', attr:`type=submit`, text:'회원등록'},
            {tagName:'a', attr:`href=/main style=background-color:crimson`, text:'취소'}
        ]
    })
})

// http://localhost:3000/main/UpdateUser
router.get('/UpdateUser',(req,res)=>{
    const alertMsg = (req.query.alertMsg)? req.query.alertMsg : null

    res.render('main', {
        alertMsg: alertMsg,
        title: '비밀번호를 변경합니다',
        action: '/user/update',
        method: 'POST',
        inputs:[
            {name:'userPwPrev', text:'현재 비밀번호',type:'password', required:true},
            {name:'userPwNew', text:'새 비밀번호',type:'password', required:true},
            {name:'userPwNewConform', text:'새 비밀번호 확인',type:'password', required:true}
        ],
        buttons:[
            {tagName:'a', attr:`href=/main`, text:'취소'},
            {tagName:'button', attr:`type=submit style=background-color:limegreen`, text:'변경'}
        ]
    })
})

// http://localhost:3000/main/DeleteUser
router.get('/DeleteUser',(req,res)=>{
    const alertMsg = (req.query.alertMsg)? req.query.alertMsg : null

    res.render('main', {
        alertMsg: alertMsg,
        title: '회원탈퇴 페이지 입니다',
        action: '/user/delete',
        method: 'post',
        inputs:[
            {name:'userPw', text:'비밀번호',type:'password', required:true},
        ],
        buttons:[
            {tagName:'a', attr:`href=/main`, text:'취소'},
            {tagName:'button', attr:`type=submit style=background-color:crimson`, text:'탈퇴'}
        ]
    })
})

module.exports = router;