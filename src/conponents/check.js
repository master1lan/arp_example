/**
 * @description 检查网段是否合理
 * @param {String} segement
 * @returns {Boolean}
 */
export const checkSegmentFormat = (segement) => {
  //minus segement 0.0.0.0
  if (typeof segement !== 'string' || segement.length < 7) {
    return false;
  }
  let ans = segement.split('.').map((item) => +item);
  if (ans.length < 4) {
    return false;
  }
  //3 or 4
  if (ans[3] != 1) return false;
  for (const i of ans) {
    if (isNaN(i) || i < 0 || i > 255) {
      return false;
    }
  }
  return true;
};

/**
 * @description 检查ip的合法性
 * @param {String} ipAddress
 * @returns {Boolean}
 */
export const checkIPFormat = (ipAddress) => {
  // minus ipAddress 0.0.0.0
  if (typeof ipAddress !== 'string' || ipAddress.length < 7) {
    return false;
  }
  let arr = ipAddress.split('.').map((item) => +item);
  if (arr.length != 4) {
    return false;
  }
  for (const i of arr) {
    if (isNaN(i) || i <= 0 || i >= 255) {
      return false;
    }
  }
  return true;
};
