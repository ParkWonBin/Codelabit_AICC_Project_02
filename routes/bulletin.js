const express = require('express');
const db_bulletinGetTotalPostCount = require("../db/db_bulletinGetTotalPostCount");
const db_bulletinGetPostList = require("../db/db_bulletinGetPostList");
const transposObject = require("../util/util_transposObject");
// const path = require('path')

// 라우터의 엔드포인트 목록
// get : http://localhost:3000/bulletin
// get : http://localhost:3000/bulletin/Detail/:post_id
// get : http://localhost:3000/bulletin/write
// get : http://localhost:3000/bulletin/addComment
// post : http://localhost:3000/bulletin/write
// post : http://localhost:3000/bulletin/edit
// post : http://localhost:3000/bulletin/delete
// post : http://localhost:3000/bulletin/addComment
// post : http://localhost:3000/bulletin/deleteComment

const router = express.Router();

// http://localhost:3000/bulletin
router.get('/', async (req, res) => {
    // 사용자 설정 영역
    const currentPage = req.query.page || 1
    const postsPerPage = 8;
    const maxPageNumber = 5;

    // 전체 게시글 확인
    const bulletinGetTotalPostCount = await db_bulletinGetTotalPostCount();
    const totalPosts = bulletinGetTotalPostCount.totalCount;
    const totalPage = Math.ceil(totalPosts / postsPerPage);
    const startPage = (totalPage - currentPage) < maxPageNumber ? totalPage - maxPageNumber + 1 : currentPage;
    const endPage = Math.min(startPage + maxPageNumber - 1, totalPage);
    console.table(bulletinGetTotalPostCount);

    // 표시할 데이터 확인
    const startRow = (currentPage - 1) * postsPerPage + 1;
    const endRow = currentPage * postsPerPage;
    const bulletinGetPostList = await db_bulletinGetPostList(startRow,endRow)

    if(bulletinGetPostList.succeed){
        const {succeed,error, ...data} = bulletinGetPostList
        console.table(transposObject(data));
    }else {
        console.error("페이지 조회 실패")
    }

    res.render('bulletinBoard',{
        ...bulletinGetPostList,
        currentPage,
        totalPage,
        maxPageNumber,
        startPage,
        endPage
    })
});

// http://localhost:3000/bulletin/Detail/:post_id
router.get('/Detail/:post_id', async (req, res) => {

});

// http://localhost:3000/bulletin/write
router.get('/write', async (req, res) => {

});

// http://localhost:3000/bulletin/addComment
router.get('/addComment', async (req, res) => {

});



// http://localhost:3000/bulletin/write
router.post('/write', async (req, res) => {

});

// http://localhost:3000/bulletin/edit
router.post('/edit', async (req, res) => {

});

// http://localhost:3000/bulletin/delete
router.post('/delete', async (req, res) => {

});

// http://localhost:3000/bulletin/addComment
router.post('/addComment', async (req, res) => {

});

// http://localhost:3000/bulletin/deleteComment
router.post('/deleteComment', async (req, res) => {

});

module.exports = router;