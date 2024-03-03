const express = require('express');
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