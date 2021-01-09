const defaultFindAncestorsOpt = {
  parentIdKey: 'parentId',
  idKey: 'id',
  resultIncludeSelf: true,
};

/**
 * findChildren
 * @param {array} arr
 * @param {string | number} id
 * @param {object} option
 */

export function findAncestors(arr, id, option) {
  const opt = { ...defaultFindAncestorsOpt, ...option };
  const { resultIncludeSelf, idKey, parentIdKey } = opt;
  const current = arr.find((n) => n[idKey] === id);
  const result = resultIncludeSelf ? (current ? [current] : []) : [];
  for (let i = 0; i <= result.length; i++) {
    const item = i === 0 ? current : result[i];
    const parent = arr.find((n) => n[idKey] === item[parentIdKey]);
    if (parent) {
      result.push(parent);
      continue;
    }
    break;
  }
  return result;
}
