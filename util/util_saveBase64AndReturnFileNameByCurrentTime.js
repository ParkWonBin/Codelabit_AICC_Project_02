const fs = require("fs");
const path = require("path");

/**
 * Base64 인코딩된 이미지 데이터를 파일로 저장하고 저장 결과를 반환합니다.
 * @author wbpark
 * @param {string} base64Data - Base64 인코딩된 이미지 데이터.
 * @param {string} uploadDir - 이미지를 저장할 디렉토리의 경로.
 * @returns {{
 *   succeed: boolean,
 *   fileName: string|null,
 *   error: Error|null
 * }}
 * - succeed 저장 성공 여부
 * - fileName 저장된 파일명
 * - error 에러발생 시 에러 반환
 */
const util_saveBase64AndReturnFileNameByCurrentTime = (base64Data, uploadDir) => {
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
    const filename = `${new Date().getTime()}.${extension}`;

    // 폴더가 없으면 생성합니다.
    fs.existsSync(uploadDir) || fs.mkdirSync(uploadDir, {recursive: true});

    // 파일을 저장할 경로를 설정합니다.
    const filePath = path.join(uploadDir, filename);

    try {
        // Base64 인코딩된 문자열을 바이너리 데이터로 변환합니다.
        const imageBuffer = Buffer.from(matches[2], 'base64');

        // 파일 시스템에 이미지 파일로 저장합니다.
        fs.writeFileSync(filePath, imageBuffer);
        console.log(`${filename} 파일 저장 성공!`);
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

module.exports = util_saveBase64AndReturnFileNameByCurrentTime