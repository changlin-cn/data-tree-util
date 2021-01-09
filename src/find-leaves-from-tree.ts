import { treeToArray } from './tree-to-array';

type b = typeof treeToArray;
/**
 * findLeavesFromTree
 * @param {array} arr
 */
export const findLeavesFromTree: typeof treeToArray = function (arr) {
  return treeToArray(arr, { onlyLeavesReturn: true });
};
