const express = require('express');
const path = require('path')
const oracledb = require('oracledb');
const dbConfig = require('../_dbConfig');


// const multer  = require('multer'); // base64 처리로 바꾸면서 사용 안함.
const moment = require('moment');
const fs = require('fs');

// 라우팅 관련
const router = express.Router();
const imgUploadDir = path.join(__dirname, '../resources/map/images/upload');

const db_mapGetHotspotList = require('../db/db_mapGetHotspotList')
const db_mapCreateHotspot = require('../db/db_mapCreateHotspot')
const db_mapUpdateHotspotPos = require('../db/db_mapUpdateHotspotPos')
const db_mapDeleteHotspot = require('../db/db_mapDeleteHotspot')


// http://localhost:3000/map
router.get('/', async (req, res) => {
    // 브라우저 주소창으로 접근했을 때 어떤 페이지 보여줄지 쓰기
    const result = await db_mapGetHotspotList();

    // 예쁘게 로그 찍기
    console.table(result.srcPath.map((srcPath, index) => ({
        srcPath,
        pos_x: result.pos_x[index],
        pos_y: result.pos_y[index],
        spot_id: result.spot_id[index],
        spot_name: result.spot_name[index],
        spot_address: result.spot_address[index] || 'N/A', // 주소가 null인 경우 'N/A'로 표시
        region: result.region[index] || 'N/A' // 지역이 null인 경우 'N/A'로 표시
    })))

    // 화면 보여주기
    res.render('map', result)
});

// http://localhost:3000/map/create
router.post('/create', async (req, res) => {
    console.log('장소 등록 시도')
    console.log('req.body : ' + JSON.stringify(req.body, (key, value) => {
        return (typeof value === "string" && value.length > 30) ? value.substring(0, 30) + "..." : value;
    }, 2));

    // 1. req.query, req.params, req.body, req.session 등 데이터를 가져옵니다.
    // TODO : 클라이언트 코드 수정해서 장소명, 장소 주소, 지역 등 가져오도록, 세션을 통해 등록자 ID도 가져오도록.
    const sportName = 'test'
    const base64Data = req.body.base64Data
    const top = req.body.top.replace('vh', '')
    const left = req.body.left.replace('vw', '')

    // 2. 이미지 저장 시도
    const saveFile = saveBase64AndReturnFileNameByCurrentTime(base64Data, imgUploadDir)

    // 3. 응답 정의
    if (!saveFile.succeed) {
        // 파일 저장에 실패한 경우
        console.error(saveFile.error)
        res.json(saveFile)
    }else{
        // 파일 저장에 성공한 경우 db 등록 후 전달
        const result = await db_mapCreateHotspot(saveFile.fileName, sportName, top, left)
        console.log(result)
        res.json(result)
    }
});


// http://localhost:3000/map/update
router.post('/update', async (req, res) => {
    // 1. req.query, req.params, req.body, req.session 등 데이터를 가져옵니다.
    const {spotId, src, left, top} = req.body

    // 2. 처리
    // 2.1. 해당 spotid에 해당 파일명으로 데이터가 있는지 검증. (페이로드 변조 아닌지)
    // TODO : spotid, src 로 해당 데이터 존재하는지 확인

    // 2.2. 해당 spot 위치 변경
    const mapUpdateHotspotPos = await db_mapUpdateHotspotPos(spotId, newLeft, newTop);

    // 2.3. 실패시 로그 찍고
    if (!mapUpdateHotspotPos.succeed) { console.error(mapUpdateHotspotPos.error) }

    // 3. 응답 정의
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

/**
 * Base64 인코딩된 이미지 데이터를 파일로 저장하고 저장 결과를 반환합니다.
 * @author wbpark
 * @param {string} base64Data - Base64 인코딩된 이미지 데이터.
 * @param {string} uploadDir - 이미지를 저장할 디렉토리의 경로.
 * @returns {{
 *   succeed: boolean,
 *   fileName: string|null,
 *   error: Error|null
 * }} 저장 성공 시 `succeed`는 true, `filePath`에 저장된 파일의 경로를 반환하며, `error`는 null입니다.
 * 저장에 실패하면 `succeed`는 false, `filePath`는 null, `error`에는 에러 객체를 반환합니다.
 */
function saveBase64AndReturnFileNameByCurrentTime(base64Data, uploadDir) {
    // Base64 인코딩 데이터에서 실제 이미지 데이터와 MIME 타입을 분리합니다.
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        console.error('Invalid base64 data');
        return null;
    }

    // MIME 타입을 통해 파일 확장자를 결정합니다.
    const mimeType = matches[1];
    let extension = mimeType.split('/')[1];
    if (extension === 'jpeg') extension = 'jpg'; // 일반적으로 'jpeg' 대신 'jpg' 확장자를 사용합니다.

    // 파일명을 현재 시간을 기반으로 생성합니다. 필요에 따라 다른 네이밍 규칙을 적용할 수 있습니다.
    const filename = `image_${new Date().getTime()}.${extension}`;

    // 폴더가 없으면 생성합니다.
    fs.existsSync(uploadDir) || fs.mkdirSync(uploadDir, {recursive: true});

    // 파일을 저장할 경로를 설정합니다.
    const filePath = path.join(uploadDir, filename);

    try {
        // Base64 인코딩된 문자열을 바이너리 데이터로 변환합니다.
        const imageBuffer = Buffer.from(matches[2], 'base64');

        // 파일 시스템에 이미지 파일로 저장합니다.
        fs.writeFileSync(filePath, imageBuffer);
        console.log(`${filename} 파일 젖아 성공!`);
        // 저장에 성공하면 파일명(또는 경로)을 반환합니다.
        return {
            succeed: true,
            fileName: filename,
            error: null
        };
    } catch (error) {
        console.error('파일 저장 에러 발생 :', error);
        return {
            succeed: false,
            fileName: null,
            error: error
        };
        ;
    }
}

module.exports = router;