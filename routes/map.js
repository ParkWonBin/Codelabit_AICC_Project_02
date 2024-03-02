const express = require('express');
const path = require('path')

// 라우팅 관련
const router = express.Router();
const imgUploadDir = path.join(__dirname, '../resources/map/images/upload');

const db_mapGetHotspotList = require('../db/db_mapGetHotspotList')
const db_mapCreateHotspot = require('../db/db_mapCreateHotspot')
const db_mapUpdateHotspotPos = require('../db/db_mapUpdateHotspotPos')
const db_mapDeleteHotspot = require('../db/db_mapDeleteHotspot')
const saveBase64AndReturnFileNameByCurrentTime = require('../util/util_saveBase64AndReturnFileNameByCurrentTime');
const db_mapCheckSpotExistByIdSrc = require('../db/db_mapCheckSpotExistByIdSrc')

// http://localhost:3000/map
router.get('/', async (req, res) => {
    // 브라우저 주소창으로 접근했을 때 어떤 페이지 보여줄지 쓰기
    const result = await db_mapGetHotspotList();
    res.render('map', result)
});

// http://localhost:3000/map/create
router.post('/create', async (req, res) => {
    console.log('장소 등록 시도')
    console.log('req.body : ' + JSON.stringify(req.body, (key, value) => {
        return (typeof value === "string" && value.length > 30) ? value.substring(0, 30) + "..." : value;
    }, 2));

    // TODO : 클라이언트 코드 수정해서 장소명, 장소 주소, 지역 등 가져오도록, 세션을 통해 등록자 ID도 가져오도록.
    // 1. req.query, req.params, req.body, req.session 등 데이터를 가져옵니다.
    const sportName = 'test'
    const base64Data = req.body.base64Data
    const top = req.body.top.replace('vh', '')
    const left = req.body.left.replace('vw', '')

    // 2. 이미지 저장 시도
    const saveFile = saveBase64AndReturnFileNameByCurrentTime(base64Data, imgUploadDir)
    if (!saveFile.succeed) {
        // 2.1. 파일 저장에 실패한 경우 해당 내용 반환
        return res.json(saveFile)
    }

    // 3. db 등록 후 전달
    const CreateHotspot = await db_mapCreateHotspot(saveFile.fileName, sportName, top, left)
    return res.json(CreateHotspot)
});


// http://localhost:3000/map/update
router.post('/update', async (req, res) => {
    // 1. req.query, req.params, req.body, req.session 등 데이터를 가져옵니다.
    // const {spotId, src, newLeft, newTop} = req.body
    const src = path.basename(req.body.src)
    const spotId = parseInt(req.body.spotId)
    const newLeft = parseInt(req.body.newLeft)
    const newTop = parseInt(req.body.newTop)
    console.log({src,spotId,newTop,newLeft})



    // 2. 처리
    // 2.1. 해당 spotid에 해당 파일명으로 데이터가 있는지 검증. (페이로드 변조 아닌지)
    const mapCheckSpotExist = await db_mapCheckSpotExistByIdSrc(spotId, src)
    if(!mapCheckSpotExist.spotExist){
        // id 와 src(정확히는 파일명)이 일치하지 않는 경우, 파일 삭제를 시도하지 않고 배용 반환
        console.log(`해당 spotId(${spotId}), src(${src})의 파일명과 일치하는 데이터가 DB에 없습니다.`)
        res.json(mapCheckSpotExist)
    }

    // 2.2. 해당 spot 위치 변경
    const mapUpdateHotspotPos = await db_mapUpdateHotspotPos(spotId, newLeft, newTop);
    if (!mapUpdateHotspotPos.succeed) {
        console.error(mapUpdateHotspotPos.error)
    }
    console.log(JSON.stringify(mapUpdateHotspotPos))
    res.json(mapUpdateHotspotPos)
});

router.post('/delete', async (req, res) => {
    // 1. req.query, req.params, req.body, req.session 등 데이터를 가져옵니다.
    const {spotId, src} = req.body

    // 2.1. 해당 spotid에 해당 파일명으로 데이터가 있는지 검증. (페이로드 변조 아닌지)
    // TODO : spotid, src 로 해당 데이터 존재하는지 확인

    // 2.2. 해당 spot 삭제 시도
    const mapDeleteHotspot = await db_mapDeleteHotspot(spotId, newLeft, newTop);

    // 2.3. 실패시 로그 찍기
    if (!mapDeleteHotspot.succeed) { console.error(mapDeleteHotspot.error) }

    // 3. 응답 정의
    res.json(mapDeleteHotspot)
});

module.exports = router;