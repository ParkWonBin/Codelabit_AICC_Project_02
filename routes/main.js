const express = require('express');
// const path = require('path')

/**
 * main 페이지의 get 요청 담당합니다.
 * */
const router = express.Router();

// http://localhost:3000/main
router.get('/', (req, res) => {
    // 로그인 여부에 따라 페이지 보여주기
    if(req.session.userId){
        //로그인인 된 상태
        res.render('mainLayout', {
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
    res.render('mainForm', {
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
    res.render('mainForm', {
        title: '회원가입 페이지 입니다',
        action: '/user',
        method: 'PUT',
        inputs:[
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
    res.render('mainForm', {
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
    res.render('mainForm', {
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