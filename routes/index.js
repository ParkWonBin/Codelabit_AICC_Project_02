const express = require('express');
// const path = require('path')

const router = express.Router();
router.get('/', async (req, res) => {
    res.render('mainLayout', {
        title: '메인페이지 입니다.',
        data: [
            {href: '/map', text: '둘러보기'},
            {href: '/login', text: '로그인'},
            {href: '/board', text: '게시판'}
        ]
    })
});

router.get('/mypage', async (req, res) => {
    res.render('mainLayout', {
        title: '메인페이지 입니다.',
        data: [
            {href: '/', text: '처음으로'},
            {href: '/login/Update', text: '비밀번호변경'},
            {href: '/login/Delete', text: '회원탈퇴'}
        ]
    })
});


module.exports = router;