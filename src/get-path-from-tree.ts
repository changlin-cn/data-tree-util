import { treeNode } from './tree-to-array';

export function getPathFromTree<T>(arr: treeNode<T>[], id: string | number): number[] {
  const queue: { item: treeNode<T>; path: string }[] = arr.map((n, i) => ({ item: n, path: `${i}` }));

  while (queue.length) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const current = queue.shift()!;
    const {
      item: { children },
      path,
    } = current;
    if (current.item.id === id && path) {
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

console.log(getPathFromTree([{ id: 3, parentId: undefined, children: [{ id: 31, parentId: 3 }] }], 31));
