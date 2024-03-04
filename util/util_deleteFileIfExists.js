const fs = require('fs');
const path = require('path');

/**
 * 지정된 경로의 파일이 존재하는지 확인하고, 존재한다면 삭제합니다.
 * @author wbpark
 * @param {string} filePath - 삭제하려는 파일의 경로.
 * @returns {boolean} 파일 삭제 성공 여부. 파일이 존재하지 않는 경우도 true를 반환합니다.
 */
const deleteFileIfExists = (filePath) => {
    try {
        // 파일 경로가 유효한지 확인
        if (fs.existsSync(filePath)) {
            // 파일이 존재하면 삭제
            fs.unlinkSync(filePath);
            console.log(`파일 삭제 성공 : ${filePath}`);
        } else {
            console.log(`파일 존재하지 않음 : ${filePath}`);
        }
        return true;
    } catch (error) {
        console.error(`파일 삭제 실패: ${error}`);
        return false;
    }
}

module.exports = deleteFileIfExists