const express = require('express');
const transposObject = require("../util/util_transposObject");
const extractNumFromAtChar = require('../util/util_extractNumFromAtChar')
const db_bulletinGetTotalPostCount = require("../db/db_bulletinGetTotalPostCount");
const db_bulletinGetPostList = require("../db/db_bulletinGetPostList");
const db_bulletinUpdatePostViewByPostId = require("../db/db_bulletinUpdatePostViewByPostId");
const db_bulletinGetPostByPostId = require("../db/db_bulletinGetPostByPostId");
const db_bulletinGetCommentsByPostId = require("../db/db_bulletinGetCommentsByPostId");
const db_bulletinCreatePost = require("../db/db_bulletinCreatePost");
const db_bulletinUpdateCommentContentNull = require('../db/db_bulletinUpdateCommentContent');
const db_bulletinUpdatePost = require('../db/db_bulletinUpdatePost');
const db_bulletinDeletePost = require('../db/db_bulletinDeletePost');
const db_bulletinCreateComments = require('../db/db_bulletinCreateComments');
const db_bulletinDeleteComments = require('../db/db_bulletinDeleteComments')
const db_bulletinDeleteCommentsByPostId = require('../db/db_bulletinDeleteCommentsByPostId')

// 라우터의 엔드포인트 목록
// get : http://localhost:3000/bulletin
// get : http://localhost:3000/bulletin/Detail/:postId
// get : http://localhost:3000/bulletin/write
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

    // 전체 게시글 개수 확인
    const bulletinGetTotalPostCount = await db_bulletinGetTotalPostCount();
    console.table(bulletinGetTotalPostCount);

    // 화면 아래 표시할 <이전페이지 > 숫자(data)... <다음페이지> 들어갈 data 계산
    const totalPosts = bulletinGetTotalPostCount.totalCount;
    const totalPage = Math.ceil(totalPosts / postsPerPage);
    const stertPagetmp = totalPage - maxPageNumber + 1
    const startPage =
        (totalPage >= currentPage + maxPageNumber) ? currentPage:
            // 전체가 100페이지고, 내가 50번쨰 페이지고, 한번에 5페이지씩 보여주는 상황이라면, startPage를 현재페이지로 설정
            (stertPagetmp > 0)? stertPagetmp :
                // 위에서 계산한 시작 페이지(stertPagetmp)가 0보다 큰 경우, 해당 계산 결과 보여주기
                '1';
                // 위에서 계산한 시작 페이지(stertPagetmp)가 0이하로 찍힌다면, 시작페이지를 1로 설정

    const endPage = Math.min(startPage + maxPageNumber - 1, totalPage);

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

    // 로그인 안한 유저 팅겨내기
    if(!userId){
        return res.redirect(`/main/login`)
    }

    // 게시글 번호가 입력되지 않은 경우  게시판으로 이동
    if(!postId){
        return res.redirect(`/bulletin?alertMsg=게시물을 찾을 수 없습니다.`)
    }

    // 조회수 추가
    const bulletinUpdatePostViewByPostId = await db_bulletinUpdatePostViewByPostId(postId);
    console.log(bulletinUpdatePostViewByPostId);

    // 게시글 조회
    const bulletinGetPostByPostId = await db_bulletinGetPostByPostId(postId);
    if(!bulletinGetPostByPostId.succeed){
        // 게시글이 찾아지지 않는 경우
        return res.redirect(`/bulletin?alertMsg=게시물을 찾을 수 없습니다.`)
    }
    console.log(bulletinGetPostByPostId);

    // 해당 계시글의 댓글 조회
    // 추후에 댓글 트리관계 테스팅을 위해 db함수 안에 트리 전처리 로직을 넣었습니다.
    // 아루엍에서 트리 전처리를 수행할 경우, 기능 테스트가 어려울 수 있기 때문에, 테스트 가능한 영역에 구현을 했고,
    // 라우터는 최대한 간결한 형태를 유지하여 전체적인 연결정보와 맥락을 알 수 있게 관리하는 게 목표입니다.
    const bulletinGetCommentsByPostId = await db_bulletinGetCommentsByPostId(postId);
    console.log((bulletinGetCommentsByPostId.commentTree))

    // 개행 문자 처리를 위해 정규식으로 <br> replace
    if(bulletinGetPostByPostId.succeed){
        bulletinGetPostByPostId.content = bulletinGetPostByPostId.content.replace(/\r?\n/g, '<br>')
    }

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
    const delteCommentsByPostId = await db_bulletinDeleteCommentsByPostId(postId)

    // 게시글 삭제를 시도합니다.
    const deletePost = await db_bulletinDeletePost(postId);
    const alertMsg = deletePost.succeed? "게시글이 삭제되었습니다." : "게시글 삭제에 실패했습니다."
    return res.redirect(`/bulletin?alertMsg=${alertMsg}`)
});

// http://localhost:3000/bulletin/addComment
router.post('/addComment', async (req, res) => {
    const userId = req.session.memberId;
    const postId = req.body.postId;
    const commentContent = req.body.comment
    console.log({postId,commentContent})

    // @ 표시뒤에 문자열을 추출합니다.
    const parentId = extractNumFromAtChar(commentContent)
    console.log({userId,postId,commentContent,parentId})
    const addComment = await db_bulletinCreateComments(userId,postId,commentContent,parentId);
    console.log(addComment)

    return res.redirect(`/bulletin/Detail/${postId}`)
});

// http://localhost:3000/bulletin/deleteComment
router.post('/deleteComment', async (req, res) => {
    const {postId, commentId, commentWriterId, childrenCount} = req.body
    console.log({postId, commentId, commentWriterId, childrenCount})

    // 대댓글이 있다면 삭제 안하고 사용자명이랑 내용만 지우도록
    let result = {succeed:false}
    if(childrenCount && parseInt(childrenCount) === 0){
        console.log('대댓글이 없으므로 해당 댓글을 삭제합니다.');
        result = db_bulletinDeleteComments(postId,commentId,commentWriterId);

    }else {
        console.log('대댓글이 있으므로 댓글의 내용만 제거합니다.');
        result = db_bulletinUpdateCommentContentNull(postId,commentId,commentWriterId,'삭제된 댓글입니다.');
    }

    const alertMsg = result.succeed? "댓글이 삭제되었습니다." : "댓글 삭제에 실패했습니다.";
    return res.redirect(`/bulletin/Detail/${postId}?alertMsg=${alertMsg}`);
});

// TODO : 댓글 수정 기능 개발중
// http://localhost:3000/bulletin/deleteComment
router.post('/UdateComment', async (req, res) => {
    const {postId, commentId, commentWriterId} = req.body
    console.log({postId, commentId, commentWriterId})

    // 대댓글이 없다면 바로 해당 댓글 삭제
    return res.redirect(`/bulletin/Detail/${postId}?alertMsg=댓글 수정 기능은 아직 개발중입니다.`)
});


module.exports = router;