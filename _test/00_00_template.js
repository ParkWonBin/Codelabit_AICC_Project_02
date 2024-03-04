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

// 무명함수를 이용하여 비동기함수 실행 예시
(async ()=>{
    // 내용 구현
})()

// function 키워드로 함수 정의
/**
 * function 은 옛날에 JS에 class 키워드도 없던 시절에, 함수겸 클래스 생성자겸 호이스팅되는 변수겸 기타등등으로 사용했기 때문에
 * 객체생성(new, prototype) 이나 this 바인딩 등 귀찮은 속성들이 다수 들어있고 사용법 또한 다양하다.
 * 일회적이거나 호출만을 위한 함수를 생성할 때는 무명함수(에로우 함수)를 사용하여 사용법을 제한하는 게 좋을 것 같다.
 * @author wbpark
 */
async function test() {
    // 내용구현
}
test()
