const extractNumFromAtChar = (input) =>{
    // 정규표현식을 사용하여 @와 숫자 사이의 공백을 제거하고, 숫자를 추출합니다.
    const match = input.match(/@ *(\d+) /);
    // 매치가 되었다면 숫자를 반환하고, 매치가 되지 않았다면 null을 반환합니다.
    return match ? parseInt(match[1]) : null;
}
// console.log(extractNumber(" @ 123 ")); // 출력: 123
// console.log(extractNumber("이것은 숫자가 없는 문자열입니다.")); // 출력: null
// console.log(extractNumber(" @ 456 ")); // 출력: 456

module.exports = extractNumFromAtChar