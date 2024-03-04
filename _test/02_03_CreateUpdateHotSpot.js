// 파일명 : 코드번호_테스트명
// 코드번호 : 업무번호(00)_테스트번호(00)
// 화면번호 : 00:예시템플릿, 01:user 관련, 02:map 관련, 03:board 관련

// 환경변수 불러오고 출력해보기
require('dotenv').config({path: '../.env'})
console.log("IP : " + process.env.DB_CONNECT_STRING)
console.log("ID : " + process.env.DB_USER)

// oracledb 환경설정하기
const oracledb = require('oracledb');
oracledb.initOracleClient({libDir: process.env.ORACLEDB_INITORACLECLIENT});
oracledb.autoCommit = true;
///////////////////////////////////

const path = require("path");
const imgUploadDir = path.join(__dirname, '../resources/map/images/upload');

const db_mapCreateHotspot = require("../db/db_mapCreateHotspot");
const db_mapUpdateHotspotPos =  require("../db/db_mapUpdateHotspotPos")
const saveBase64AndReturnFileNameByCurrentTime = require("../util/util_saveBase64AndReturnFileNameByCurrentTime");

// 무명함수를 이용하여 비동기함수 실행 예시
(async () => {
    const sportName = 'test'
    const base64Data = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAVCAIAAABkNkFWAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAE9SURBVEhL7ZbbEYQgDEWti4Koh2pohmLc4Ea4hCTq6Dj7secTYnJ4hHFZf5VuVlIMTMw89gZWXTQLC/OymV73b2bjmuXIUwMhlS0EKLleCp6niBBTnoIYEasFu3UvmOUIdZA428FGCDDrI2Z2qYpYhJ5vpwcfm2249wxz7FtUcBPxkx4c2vnR2erB/j3b8MxA7DirlYgWwkTjNK6b2VN9pp8RRNPwdu9BZOKWmX9vmP7RoNYxOvlNM8LsYxIUrfyQmWhClyJftMaQ5ZaZM3WSkqsl5xjVbpnhcY5zVHFnr2XGGlt/zSyVCk9U8Ka1R4oeNB7CWpCn1mpZcBwVrLqq2RfrNmgMq8VlqAzRVt1uNoUMZoTZbzKQUnm9KaONumBWoXZKkVEeH2q3+pBzCkri/Wuc+NloKHWF2c+wrh+XAAnZ7FGq7AAAAABJRU5ErkJggg=='
    const top = 30
    const left = 20

    // 2. 이미지 저장 시도
    const saveFile = saveBase64AndReturnFileNameByCurrentTime(base64Data, imgUploadDir);
    console.log(`이미지 저장 : ${saveFile.succeed? "성공" : "실패"}`)
    console.log(`이미지 저장 : ${JSON.stringify(saveFile,null,2)}`)

    // 3. db 등록
    const CreateHotspot = await db_mapCreateHotspot(saveFile.fileName, sportName, top, left);
    console.log(`이미지 등록 : ${CreateHotspot.succeed? "성공" : "실패"}`)
    console.log(`이미지 등록 : ${JSON.stringify(CreateHotspot,null,2)}`)

    // 4. 이미지 이동 시도
    const NewTop = top + 10
    const NewLeft = left + 10
    console.log(`이미지 이동 : spotId${CreateHotspot.spotId} NewTop:${NewTop}, NewLeft:${NewLeft}`)
    const mapdateHotspotPos = await db_mapUpdateHotspotPos(CreateHotspot.spotId,NewLeft,top);
    console.log(`이미지 이동 : ${mapdateHotspotPos.succeed? "성공" : "실패"}`)
    console.log(`이미지 이동 : ${JSON.stringify(CreateHotspot,null,2)}`)
})()