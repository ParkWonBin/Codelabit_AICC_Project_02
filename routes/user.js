const express = require('express');
// const path = require('path')

const router = express.Router();

const db_userLogin = async ()=>{};
const db_userCreateMember = async ()=>{};
const db_userCheckMemberIdExist = async ()=>{};
const db_userCheckMemberNameExist = async ()=>{};
const db_userUpdateMemberPasword = async ()=>{};
const db_userDeleteMember = async ()=>{};
const db_setDataNull = async ()=>{};


router.get('/',  (req, res) => {
    // user로 진입할 일이 없을건데, 누가 호기심에 들어오면 main으로 넘겨버리기.
    res.redirect('/main')
});

// http://localhost:3000/user/logout
router.get('/logout',  (req, res) => {
    // 로그아웃 처리
    req.session.memberId = null
    req.session.memberNum = null
    req.session.memberName = null
    req.session.memberRole = null
    res.redirect('/main')
});

// 아래 화면에서 [로그인 버튼] 클릭 시 여기로 요청이 전달됩니다.
// 버튼 있는 곳 : http://localhost:3000/main/login
router.post('/', async (req, res) => {
    // 1. req.query, req.params, req.body, req.session 등 데이터를 가져옵니다.
    const{ userId,userPw } = req.body

    // 2. DB 연결과 관련된 부분은 다른 함수랑 연결해서 처리
    const userLogin = await db_userLogin(userId,userPw)
    const isLoginSucceed = userLogin.succeed

    // 3. DB 요청 결과를 통해 어떤 화면과 연결시킬지 판단 및 결정.
    if(isLoginSucceed){
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
router.put('/', async (req, res) => {
    // 1. req.query, req.params, req.body, req.session 등 데이터를 가져옵니다.
    const{ userName, userId,userPw, userPwConform } = req.body
    // 1.1. [새 비밀번호]와 [새 비밀번호 확인]이 일치하지 않는 경우
    if(userPw !== userPwConform){
        return res.redirect('/CreateUser?alertMsg=[새 비밀번호 확인]이 일치하지 않습니다.')
    }

    // 2. DB 연결과 관련된 부분은 다른 함수랑 연결해서 처리
    // 2.1. 이미 존재하는 ID 인지 확인하기
    const checkId = await db_userCheckMemberIdExist(userId)
    if(checkId.memberExist){
        return res.redirect(`/CreateUser?alertMsg=이미 존재하는 아이디(${userId})입니다.`)
    }

    // 2.2. 이미 존재하는 Name 인지 확인하기
    const checkName = await db_userCheckMemberNameExist(userName)
    if(checkName.memberExist){
        return res.redirect(`/CreateUser?alertMsg=이미 존재하는 이름(${userName})입니다.`)
    }

    // 2.3. 계정 생성 시도
    const userCreateMember = await db_userCreateMember(userId,userPw)
    const isRegisterSucceed = userCreateMember.Succeed
    if(isRegisterSucceed){
        req.session.memberId = userCreateMember.memberId
        req.session.memberNum = userCreateMember.memberNum
        req.session.memberName = userCreateMember.memberName
        req.session.memberRole = userCreateMember.memberRole
        return res.redirect('/main?alertMsg=회원가입이 완료되었습니다.')
    }else{
        return res.redirect('/CreateUser?알 수 없는 오류로 회원가입에 실패했습니다.')
    }
});


// 아래 화면에서 [비밀번호 변경] 버튼 클릭 시 여기로 요청이 전달됩니다.
// 버튼 있는 곳 : http://localhost:3000/main/UpdateUser
router.patch('/', async (req, res) => {
    // 1. req.query, req.params, req.body, req.session 등 데이터를 가져옵니다.
    const {userPw, userPwNew, userPwNewConform} = req.body
    const userId = req.session.memberId

    // 1.1. [새 비밀번호]와 [새 비밀번호 확인]이 일치하지 않는 경우
    if(userPwNew !== userPwNewConform){
        return res.redirect('/UpdateUser?alertMsg=[새 비밀번호 확인]이 일치하지 않습니다.')
    }

    // 2. DB 연결과 관련된 부분은 다른 함수랑 연결해서 처리
    // 2.1. 비밀번호가 틀렸는지 확인(세션의 id와 집력한 pw로 로그인 요청을 보내서 성공하는지 확인)
    const userLogin = await db_userLogin(userId,userPw)
    const isWrongPassword = !userLogin.succeed
    if(isWrongPassword){
        return res.redirect('/UpdateUser?alertMsg=[현재 비밀번호]가 틀렸습니다.')
    }

    // 2.2. 비밀번호 변경 시도
    const userUpdateMemberPasword = await db_userUpdateMemberPasword(userId,userPw)
    const isUpdateSucceed = userUpdateMemberPasword.succeed
    if(isUpdateSucceed){
        return res.redirect('/main?alertMsg=비밀번호가 변경되었습니다.')
    }else{
        return res.redirect('/UpdateUser?알 수 없는 오류로 [비밀번호 변경]에 실패했습니다.')
    }
});

// 아래 화면에서 [회원탈퇴 버튼] 클릭 시 여기로 요청이 전달됩니다.
// 버튼 있는 곳 : http://localhost:3000/main/DeleteUser
router.delete('/', async (req, res) => {
    // 1. req.query, req.params, req.body, req.session 등 데이터를 가져옵니다.
    const userId = req.session.memberId
    const userPw  = req.body.userPw

    // 2. DB 연결과 관련된 부분은 다른 함수랑 연결해서 처리
    // 2.1. 비밀번호가 틀렸는지 확인(세션의 id와 집력한 pw로 로그인 요청을 보내서 성공하는지 확인)
    const userLogin = await db_userLogin(userId,userPw)
    const isWrongPassword = !userLogin.succeed
    if(isWrongPassword){
        return res.redirect('/UpdateUser?alertMsg=[현재 비밀번호]가 틀렸습니다.')
    }

    // 2.2. 관련된 테이블에서 행에 작업 시도
    // 맴버 삭제를 위해 관련된 테이블에서 종속성 제거 작업을 진행합니다.
    // 모든 테이블에서 삭제 작업을 진행하면 서버에 과부하가 걸릴 수 있으니
    // 해당 맴버를 참조하는 레코드를 외래키로 사용하는 다른 테이블의 레코드 데이터를 null로 바꿉니다.
    const relatedData = [
        {tableName:'comments', columnName:'writer_id'},
        {tableName:'bulletin', columnName:'writer_id'},
        {tableName:'hotspot', columnName:'writer_id'}
    ]
    relatedData.forEach(async (data) => {
        const setDataNull = await db_setDataNull(data.tableName,data.columnName)
        console.log(setDataNull)
    })

    // 2.3. 맴버 삭제 시도
    const userDeleteMember = await db_userDeleteMember(userId)
    const isDeleteMemberSucceed = userDeleteMember.succeed
    if(isDeleteMemberSucceed){
        res.redirect(`/main?alertMsg=계정(${userId})을 삭재했습니다.`)
    }else{
        res.redirect(`/DeleteUser?alertMsg=계정삭제에 실패했습니다.`)
    }
});


module.exports = router;