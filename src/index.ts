export { treeFromArray } from './tree-from-array';
export { treeToArray } from './tree-to-array';
export { findLeavesFromTree } from './find-leaves-from-tree';

const defaultFindChildrenOpt = {
  childrenKey: 'children',
  parentIdKey: 'parentId',
  idKey: 'id',
  recursion: true,
};
const defaultFindAncestorsOpt = {
  parentIdKey: 'parentId',
  idKey: 'id',
  resultIncludeSelf: true,
};
const defaultGetPathFromTreeOpt = {
  childrenKey: 'children',
  isIt: (item, id) => item.id === id,
};

/**
 * findChildren
 * @param {array} arr
 * @param {string | number} id
 * @param {object} option
 */
function findChildren(arr, id, option) {
  const duplicate = [...arr];
  const opt = { ...defaultFindChildrenOpt, ...option };

  const result = [arr.find((n) => n[opt.idKey] === id)];
  for (let i = 0; i < (opt.recursion ? result.length : 1); i++) {
    const current = result[i];
    for (let j = 0; j < duplicate.length; j++) {
      const item = duplicate[j];
      if (item[opt.parentIdKey] === current[opt.idKey]) {
        result.push(duplicate.splice(j, 1)[0]);
        j--;
      }
    }
    // result=arr.filter(n=>n)
  }
  result.shift();

  return result;
}

function findAncestors(arr, id, option) {
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

function getPathFromTree(arr = [], id, option = defaultGetPathFromTreeOpt) {
  const { childrenKey, isIt } = option;
  const queue = [{ item: { [childrenKey]: arr }, path: '' }];
  while (queue.length) {
    const current = queue.shift();
    const {
      item: { [childrenKey]: children },
      path,
    } = current;
    if (isIt(current.item, id) && path) {
      return path.split('-').map((v) => Number(v));
    }
    if (Array.isArray(children) && children.length) {
      for (let i = 0; i < children.length; i++) {
        queue.push({
          item: children[i],
          path: `${path ? path + '-' : ''}${i}`,
        });
      }
    }
  }
  throw new Error(`Can not get path of ${id}`);
}

export { findChildren, findAncestors, getPathFromTree };
