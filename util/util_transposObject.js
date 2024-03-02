/**
 * 주어진 객체 내 배열 값을 가진 속성들을 기반으로 객체 배열을 생성하여 반환합니다.
 * 각 객체는 원본 객체의 키를 필드로, 배열의 각 인덱스에 해당하는 값을 값으로 가집니다.
 * 배열의 길이가 서로 다른 경우, 가장 긴 배열의 길이를 기준으로 누락된 값은 'N/A'로 대체됩니다.
 *
 * @author wbpark
 * @param {Object} input - 배열 값을 포함한 속성들을 가진 객체.
 * @returns {Object[]} 변환된 객체 배열. 각 객체는 원본 객체의 배열 값을 가진 속성에 대응하는 키-값 쌍을 가집니다.
 *                      배열의 길이가 다른 경우 누락된 값은 'N/A'로 대체됩니다.
 *
 * @example
 * // 입력 예시:
 * const input = {
 *   names: ["Alice", "Bob"],
 *   ages: [25, 30],
 *   cities: ["New York"]
 * };
 * const output = transposeDynamicKeys(input);
 * console.log(output);
 * // 예시 출력:
 * // [
 * //   { names: "Alice", ages: 25, cities: "New York" },
 * //   { names: "Bob", ages: 30, cities: "N/A" }
 * // ]
 */
const transposeDynamicKeys = (input) => {
    const keys = Object.keys(input).filter(key => Array.isArray(input[key])); // 배열인 속성만 필터링
    const maxLength = Math.max(...keys.map(key => input[key].length)); // 가장 긴 배열의 길이 찾기

    return Array.from({ length: maxLength }, (_, index) => {
        return keys.reduce((acc, key) => {
            acc[key] = input[key][index] != null ? input[key][index] : 'N/A'; // `null`을 `'N/A'`로 대체
            return acc;
        }, {});
    });
}

module.exports = transposeDynamicKeys