// 파일명 : 코드번호_테스트명
// 코드번호 : 업무번호(00)_테스트번호(00)
// 화면번호 : 00:예시템플릿, 01:user 관련, 02:map 관련, 03:board 관련

// 환경변수 불러오고 출력해보기
require('dotenv').config({ path: '../.env' })
console.log("IP : " + process.env.DB_CONNECT_STRING)
console.log("ID : " + process.env.DB_USER)

// oracledb 환경설정하기
const oracledb = require('oracledb');
oracledb.initOracleClient({ libDir: process.env.ORACLEDB_INITORACLECLIENT });
oracledb.autoCommit = true;
///////////////////////////////////

const db_mapGetHotspotList = require("../db/db_mapGetHotspotList");

// 무명함수를 이용하여 비동기함수 실행 예시
(async ()=>{
    const mapGetHotspotList = await db_mapGetHotspotList()
    // console.table(mapGetHotspotList)

    // 결과 데이터를 그대로 뽑으면 표가 별로 안예브게 나오는 관계로 traspos하여 표시
    // 결과 데이터를 변환합니다.
    const transformedData = mapGetHotspotList.srcPath.map((srcPath, index) => ({
        srcPath,
        pos_x: mapGetHotspotList.pos_x[index],
        pos_y: mapGetHotspotList.pos_y[index],
        spot_id: mapGetHotspotList.spot_id[index],
        spot_name: mapGetHotspotList.spot_name[index],
        spot_address: mapGetHotspotList.spot_address[index] || 'N/A', // 주소가 null인 경우 'N/A'로 표시
        region: mapGetHotspotList.region[index] || 'N/A' // 지역이 null인 경우 'N/A'로 표시
    }));

    // 변환된 데이터를 테이블로 출력합니다.
    console.table(transformedData);
})()