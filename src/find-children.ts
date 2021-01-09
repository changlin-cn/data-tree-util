import { treeNodeSource } from './tree-from-array';

/**
 * findChildren
 * @param {array} arr
 * @param {string | number} id
 * @param {object} option
 */
export function findChildren<T extends treeNodeSource>(
  arr: T[],
  id: string | number,
  option: { recursion: boolean } = { recursion: true },
): T[] {
  const duplicate = [...arr];
  const child = arr.find((n) => n.id === id);

  if (!child) {
    return [];
  }

  const result = [child];

  for (let i = 0; i < (option.recursion ? result.length : 1); i++) {
    const current = <T>result[i];
    for (let j = 0; j < duplicate.length; j++) {
      const item = duplicate[j];
      if (item.parentId === current.id) {
        result.push(duplicate.splice(j, 1)[0]);
        j--;
      }
    }
    // result=arr.filter(n=>n)
  }
  result.shift();

  return result;
}
