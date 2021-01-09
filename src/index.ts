export { treeFromArray } from './tree-from-array';
export { treeToArray } from './tree-to-array';
export { findLeavesFromTree } from './find-leaves-from-tree';
export { findChildren } from './find-children';
export { findAncestors } from './find-ancestors';

const defaultGetPathFromTreeOpt = {
  childrenKey: 'children',
  isIt: (item, id) => item.id === id,
};

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

export { getPathFromTree };
