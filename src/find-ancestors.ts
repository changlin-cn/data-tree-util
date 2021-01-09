import { treeNodeSource } from './tree-from-array';

/**
 * findChildren
 * @param {array} arr
 * @param {string | number} id
 * @param {object} option
 */

export function findAncestors<T extends treeNodeSource>(
  arr: T[],
  id: string | number,
  option: { resultIncludeSelf: boolean } = { resultIncludeSelf: true },
): T[] {
  const { resultIncludeSelf } = option;

  const current = arr.find((n) => n.id === id);
  if (!current) {
    return [];
  }

  const result = resultIncludeSelf ? (current ? [current] : []) : [];
  for (let i = 0; i <= result.length; i++) {
    const item = i === 0 ? current : result[i];
    const parent = arr.find((n) => n.id === item.parentId);
    if (parent) {
      result.push(parent);
      continue;
    }
    break;
  }
  return result;
}
