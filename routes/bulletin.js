const express = require('express');
const transposObject = require("../util/util_transposObject");
const db_bulletinGetTotalPostCount = require("../db/db_bulletinGetTotalPostCount");
const db_bulletinGetPostList = require("../db/db_bulletinGetPostList");
const db_bulletinUpdatePostViewByPostId = require("../db/db_bulletinUpdatePostViewByPostId");
const db_bulletinGetPostByPostId = require("../db/db_bulletinGetPostByPostId");
const db_bulletinGetCommentsByPostId = require("../db/db_bulletinGetCommentsByPostId");
const db_bulletinCreatePost = require("../db/db_bulletinCreatePost");
const db_bulletinUpdatePost = require('../db/db_bulletinUpdatePost')
const db_bulletinDeletePost = require('../db/db_bulletinDeletePost')

// 라우터의 엔드포인트 목록
// get : http://localhost:3000/bulletin
// get : http://localhost:3000/bulletin/Detail/:postId
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
    // 알림 표시할거 있으면 표시하도록
    const alertMsg = (req.query.alertMsg)? req.query.alertMsg : null

    // 사용자 설정 영역
    const currentPage = req.query.page || 1 // 쿼리에 없으면 기본값 1
    // TODO : 페이지당 표시할 게시글 및 페이지 개수 입력받는 란 만들기
    const postsPerPage = req.query.postPerPage || 8;
    const maxPageNumber =req.query.pageMaxCount || 5;

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

    // 데이터 가져오는 데 성공했다면 로그로 이쁘게 표시하기
    if(bulletinGetPostList.succeed){
        const {succeed,error, ...data} = bulletinGetPostList
        console.table(transposObject(data));
    }else {
        console.error("페이지 조회 실패")
    }

    // 요청한 데이터 보내주기
    const pageData = {currentPage, startPage, endPage, totalPage,maxPageNumber}
    return res.render('bulletinBoard',{
        ...bulletinGetPostList,
        ...pageData,
        alertMsg
    })
});

// http://localhost:3000/bulletin/Detail/:postId
router.get('/Detail/:postId', async (req, res) => {
    // 알림 표시할거 있으면 표시하도록
    const alertMsg = (req.query.alertMsg)? req.query.alertMsg : null

    // 데이터 가져오기
    const postId = req.params.postId;
    const userId = req.session.memberId; //본인이 작성한 글만 수정/ 삭제할 수 있게 하기 위함

    // 조회수 추가
    const bulletinUpdatePostViewByPostId = await db_bulletinUpdatePostViewByPostId(postId);
    console.log(bulletinUpdatePostViewByPostId);

    // 게시글 조회
    const bulletinGetPostByPostId = await db_bulletinGetPostByPostId(postId);
    console.log(bulletinGetPostByPostId);

    //해당 계시글의 댓글 조회
    const bulletinGetCommentsByPostId = await db_bulletinGetCommentsByPostId(postId);
    console.log((bulletinGetCommentsByPostId.commentTree))

    // 개행 문자가 결과 화면에 처리되지 않는 것 같아서 정규식으로 replace
    bulletinGetPostByPostId.content = bulletinGetPostByPostId.content.replace(/\r?\n/g, '<br>')

    // 페이지 표시
    return res.render('bulletinDetail', {
        ...bulletinGetPostByPostId,
        commentTree:bulletinGetCommentsByPostId.commentTree,
        userId, alertMsg
    })
});

// http://localhost:3000/bulletin/write
router.get('/write', async (req, res) => {
    // 데이터 가져오기
    const userId = req.session.memberId
    const userName = req.session.memberName

    // 로그인 된 상태가 아니라면 로그인하도록 하게 하기
    if(!userId){ return res.redirect('/main/login') }

    return res.render('bulletinWriteEdit',{
        formAction:'/bulletin/write',
        formMethod:'post',
        pageTitle:`글쓰기 - ${userName}(${userId})님 `,
        postId:null,
        postTitle: "",
        content: ""
    })
});

// http://localhost:3000/bulletin/write
router.post('/write', async (req, res) => {
    // 변수 가져오기
    const writerId = req.session.memberId
    const postTitle = req.body.title
    const postContent = req.body.content.trim()

    // 글 작성 시도
    const createPost = await db_bulletinCreatePost(writerId, postTitle, postContent)

    // 글 완성되면 이동
    const alertMsg = createPost.succeed? '게시글이 생성되었습니다.' : '게시글 생성에 실패했습니다.'
    return res.redirect(`/bulletin/Detail/${createPost.postId}?alertMsg=${alertMsg}`)
});

// http://localhost:3000/bulletin/edit
router.get('/edit', async (req, res) => {
    const userName = req.session.memberName
    const userId = req.session.memberId
    const postId = req.query.postId

    // 본인이 작성한 글이 아니면 팅겨내기
    const bulletinGetPostByPostId = await db_bulletinGetPostByPostId(postId);
    if(bulletinGetPostByPostId.writerId !== userId){
        const alertMsg = '해당 게시글에 수정 권한이 없습니다.'
        return res.redirect(`/bulletin/Detail/${postId}?alertMsg=${alertMsg}`)
    }

    // 게시글 내용대로 글 작성 내용을 체워줍니다.
    return res.render('bulletinWriteEdit',{
        formAction:`/bulletin/edit/${postId}`,
        formMethod:'post',
        pageTitle:`글수정 - ${userName}(${userId})님 `,
        postTitle: bulletinGetPostByPostId.title,
        content: bulletinGetPostByPostId.content
    })
});

router.post('/edit/:postId', async (req, res) => {
    // 변수 가져오기
    const postId = req.params.postId
    const userId = req.session.memberId
    const postTitleNew = req.body.title
    const postContentNew = req.body.content.trim()

    // 본인이 작성한 글이 아니면 팅겨내기
    const bulletinGetPostByPostId = await db_bulletinGetPostByPostId(postId);
    if(bulletinGetPostByPostId.writerId !== userId){
        const alertMsg = '해당 게시글에 수정 권한이 없습니다.'
        return res.redirect(`/bulletin/Detail/${postId}?alertMsg=${alertMsg}`)
    }

    // postId를 기준으로 게시글 수정
    const updatePost = await db_bulletinUpdatePost(postId, postTitleNew, postContentNew)

    // 글 완성되면 이동
    const alertMsg = updatePost.succeed? "게시글이 수정되었습니다." : "게시글 수정에 실패했습니다."
    return res.redirect(`/bulletin/Detail/${postId}?alertMsg=${alertMsg}`)
});


// http://localhost:3000/bulletin/delete
router.post('/delete/:postId', async (req, res) => {
    const postId = req.params.postId
    const userId = req.session.memberId

    // 본인이 작성한 글이 아니면 팅겨내기
    const bulletinGetPostByPostId = await db_bulletinGetPostByPostId(postId);
    if(bulletinGetPostByPostId.writerId !== userId){
        const alertMsg = '해당 게시글에 삭제 권한이 없습니다.'
        return res.redirect(`/bulletin/Detail/${postId}?alertMsg=${alertMsg}`)
    }

    // 해당 게시글의 댓글을 모두 삭제합니다.

    // 게시글 삭제를 시도합니다.
    const deletePost = await db_bulletinDeletePost(postId);
    const alertMsg = deletePost.succeed? "게시글이 삭제되었습니다." : "게시글 삭제에 실패했습니다."
    return res.redirect(`/bulletin?alertMsg=${alertMsg}`)
});

// http://localhost:3000/bulletin/addComment
router.post('/addComment/:commentId', async (req, res) => {

});

// http://localhost:3000/bulletin/deleteComment
router.post('/deleteComment/:postId/:commentId', async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    return res.redirect(`/bulletin/Detail/${postId}?alertMsg=댓글이 삭제되었습니다.`)
});

module.exports = router;