const express = require('express');
// const path = require('path')

const logData = true
const router = express.Router();

// 해당 라우터에서 사용하는 db관련 함수 모두 가져오기
const db_userLogin = require('../db/db_userLogin')
const db_userCreateMember = require('../db/db_userCreateMember')
const db_userCheckMemberExistById = require('../db/db_userCheckMemberExistById')
const db_userCheckMemberExistByName =require('../db/db_userCheckMemberExistByName')
const db_userUpdateMemberPasword = require('../db/db_userUpdateMemberPasword')
const db_userDeleteMember = require('../db/db_userDeleteMember')
const db_setDataNull= require('../db/db_setDataNull')

router.get('/',  (req, res) => {
    // user로 진입할 일이 없을건데, 누가 호기심에 들어오면 main으로 넘겨버리기.
    if(logData){console.log('왜 /user 로 get 한거지?')}
    res.redirect('/main')
});

// http://localhost:3000/user/logout
router.get('/logout',  (req, res) => {
    // 로그아웃 시도할 때, alert등
    const queryString = Object.keys(req.query)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(req.query[key])}`)
        .join('&');

    if(logData){console.log('로그아웃 시도')}
    // 로그아웃 처리
    req.session.memberId = null
    req.session.memberNum = null
    req.session.memberName = null
    req.session.memberRole = null
    res.redirect(`/main?${queryString}`)
});

// 아래 화면에서 [로그인 버튼] 클릭 시 여기로 요청이 전달됩니다.
// 버튼 있는 곳 : http://localhost:3000/main/login
router.post('/', async (req, res) => {
    if(logData){console.log('로그인 시도')}
    // 1. req.query, req.params, req.body, req.session 등 데이터를 가져옵니다.
    const{ userId,userPw } = req.body

    // 2. DB 연결과 관련된 부분은 다른 함수랑 연결해서 처리
    const userLogin = await db_userLogin(userId,userPw)
    if(logData){console.table(userLogin)}

    // 3. DB 요청 결과를 통해 어떤 화면과 연결시킬지 판단 및 결정.
    if(userLogin.succeed){
        req.session.memberId = userLogin.memberId
        req.session.memberNum = userLogin.memberNum
        req.session.memberName = userLogin.memberName
        req.session.memberRole = userLogin.memberRole
        return res.redirect('/main')
    }else{
        return res.redirect('/main/login?alertMsg=아이디 혹은 비밀번호가 없습니다.')
    }
});


// 아래 화면에서 [회원등록 버튼] 클릭 시 여기로 요청이 전달됩니다.
// 버튼 있는 곳 :  http://localhost:3000/main/CreateUser
// endpoint : http://localhost:3000/user/create
router.post('/create', async (req, res) => {
    if(logData){console.log('회원가입 시도')}

    // 1. req.query, req.params, req.body, req.session 등 데이터를 가져옵니다.
    const { userName, userId, userPw, userPwConform } = req.body
    // if(logData){console.log(JSON.stringify({userName, userId, userPw, userPwConform },null, 2))}

    // 1.1. [새 비밀번호]와 [새 비밀번호 확인]이 일치하지 않는 경우
    if(userPw !== userPwConform){
        return res.redirect('/main/CreateUser?alertMsg=[새 비밀번호 확인]이 일치하지 않습니다.')
    }

    // 2. DB 연결과 관련된 부분은 다른 함수랑 연결해서 처리
    // 2.1. 이미 존재하는 ID 인지 확인하기
    const checkId = await db_userCheckMemberExistById(userId)
    if(checkId.memberExist){
        return res.redirect(`/main/CreateUser?alertMsg=이미 존재하는 아이디(${userId})입니다.`)
    }else if(checkId.error){
        return res.redirect('/main/CreateUser?알 수 없는 오류로 [아이디 중복검사]에 실패했습니다.')
    }

    // 2.2. 이미 존재하는 Name 인지 확인하기
    const checkName = await db_userCheckMemberExistByName(userName)
    if(checkName.memberExist){
        return res.redirect(`/main/CreateUser?alertMsg=이미 존재하는 이름(${userName})입니다.`)
    }else if(checkName.error){
        return res.redirect('/main/CreateUser?알 수 없는 오류로 [이름 중복검사]에 실패했습니다.')
    }

    // 2.3. 계정 생성 시도
    const userCreateMember = await db_userCreateMember(userId,userPw,userName)
    if(logData){console.table(userCreateMember)}

    if(userCreateMember.succeed){
        req.session.memberId = userCreateMember.memberId
        req.session.memberNum = userCreateMember.memberNum
        req.session.memberName = userCreateMember.memberName
        req.session.memberRole = userCreateMember.memberRole
        return res.redirect('/main?alertMsg=회원가입이 완료되었습니다.')
    }else{
        if(userCreateMember.error){console.error(userCreateMember.error)}
        return res.redirect('/main/CreateUser?알 수 없는 오류로 회원가입에 실패했습니다.')
    }
});


// 아래 화면에서 [비밀번호 변경] 버튼 클릭 시 여기로 요청이 전달됩니다.
// 버튼 있는 곳 : http://localhost:3000/main/UpdateUser
// endpoint : http://localhost:3000/user/update
router.post('/update', async (req, res) => {
    if(logData){console.log('비밀번호 변경 시도')}

    // 1. req.query, req.params, req.body, req.session 등 데이터를 가져옵니다.
    const {userPwPrev, userPwNew, userPwNewConform} = req.body
    const userId = req.session.memberId

    // 1.1. [새 비밀번호]와 [새 비밀번호 확인]이 일치하지 않는 경우
    // NOTE : 페이로드 변조에 대비해 서버 사이드에서도 검증
    // TODO : 클라이언트 사이드에서도 검증하기
    if(userPwNew !== userPwNewConform){
        return res.redirect('/main/UpdateUser?alertMsg=[새 비밀번호 확인]이 일치하지 않습니다.')
    }

    // 2. DB 연결과 관련된 부분은 다른 함수랑 연결해서 처리
    // 2.1. 비밀번호가 틀렸는지 확인(세션의 id와 집력한 pw로 로그인 요청을 보내서 성공하는지 확인)
    const userLogin = await db_userLogin(userId,userPwPrev)
    if(!userLogin.succeed){
        return res.redirect('/main/UpdateUser?alertMsg=[현재 비밀번호]가 틀렸습니다.')
    }

    // 2.2. 비밀번호 변경 시도
    const userUpdateMemberPasword = await db_userUpdateMemberPasword(userId,userPwPrev, userPwNew)
    if(userUpdateMemberPasword.succeed){
        return res.redirect('/main?alertMsg=비밀번호가 변경되었습니다.')
    }else{
        return res.redirect('/main/UpdateUser?알 수 없는 오류로 [비밀번호 변경]에 실패했습니다.')
    }
});

// 아래 화면에서 [회원탈퇴 버튼] 클릭 시 여기로 요청이 전달됩니다.
// 버튼 있는 곳 : http://localhost:3000/main/DeleteUser
// endpoint : http://localhost:3000/user/delete
router.post('/delete', async (req, res) => {
    if(logData){console.log('회원탈퇴 시도')}

    // 1. req.query, req.params, req.body, req.session 등 데이터를 가져옵니다.
    const userId = req.session.memberId
    const userPw  = req.body.userPw

    // 2. DB 연결과 관련된 부분은 다른 함수랑 연결해서 처리
    // 2.1. 비밀번호가 틀렸는지 확인(세션의 id와 집력한 pw로 로그인 요청을 보내서 성공하는지 확인)
    const userLogin = await db_userLogin(userId,userPw)
    if(!userLogin.succeed){
        return res.redirect('/main/DeleteUser/delete?alertMsg=[현재 비밀번호]가 틀렸습니다.')
    }

    // 2.2. 관련된 테이블에서 행에 작업 시도
    // 맴버 삭제를 위해 관련된 테이블에서 종속성 제거 작업을 진행합니다.
    // 모든 테이블에서 삭제 작업을 진행하면 서버에 과부하가 걸릴 수 있으니
    // 해당 맴버를 참조하는 레코드를 외래키로 사용하는 다른 테이블의 레코드 데이터를 null로 바꿉니다.
    const relatedData = [
        {tableName:'comments', columnName:'writer_id'},
        {tableName:'bulletin', columnName:'writer_id'},
        {tableName:'hotspot', columnName:'Auther_id'}
    ]

    // 비동기 함수들이 모두 수행될 때까지 기다렸다가 합치는 함수.
    // 여러개의 비동기 함수를 동시실행 후 리턴값을 수집하려면 promise all
    console.log('user 테이블을 참조하는 테이블들에서, 해당 레코드의 참조 제거 시도')
    const deleteDatalog = await Promise.all(
        relatedData.map(data =>
            db_setDataNull(data.tableName, data.columnName, userId)
                .then(result => {
                    return {...data, userId, ...result}
                })
        )
    );
    if(logData){console.table(deleteDatalog)}


    // 2.3. 맴버 삭제 시도
    if(logData){console.table('회원 삭제 시도 : '+userId)}
    const userDeleteMember = await db_userDeleteMember(userId,userPw)
    if(logData){console.table(userDeleteMember)}
    if(userDeleteMember.succeed){
        res.redirect(`/user/logout?alertMsg=계정(${userId})을 삭재했습니다.`)
    }else{
        res.redirect(`/main/DeleteUser?alertMsg=계정삭제에 실패했습니다.`)
    }
});


module.exports = router;