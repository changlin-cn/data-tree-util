interface treeFromArrayOpt<T> {
  hasParent: (item: T) => unknown;
  lostError: boolean;
}

export type treeNodeSource = {
  id: string | number;
  parentId: string | number;
};

type treeNodeRes<T> = treeNodeSource & {
  children?: treeNodeRes<T>[];
} & T;

/**
 * treeFromArray     时间复杂度(treeFromArray)：O(n)
 * @param {array} arr
 * @param {object} opt
 */
function treeFromArray<T extends treeNodeSource>(arr: T[], option?: Partial<treeFromArrayOpt<T>>): treeNodeRes<T>[] {
  const opt: treeFromArrayOpt<T> = {
    hasParent(item) {
      return item.parentId;
    },
    lostError: true,
    ...option,
  };
  const temp: treeNodeRes<T>[] = arr.map((n) => ({ ...n, children: undefined }));

  const groupsByParent: { [index: string]: treeNodeRes<T>[] } = {};
  const itemsMap: { [index: string]: treeNodeRes<T> } = {};
  const itemRecordHasChirdren: { [index: string]: boolean } = {};
  const itemsNoParent: treeNodeRes<T>[] = [];
  const itemsLost: { [index: string]: boolean } = {};
  // 遍历所有节点，找出对应关系
  for (let i = 0; i < temp.length; i++) {
    const item = temp[i];
    const hasParent = opt.hasParent(item);
    const parentId = item.parentId;
    const id = item.id;
    if (!itemsMap[id]) {
      itemsMap[id] = item;
    }
    if (hasParent) {
      if (!groupsByParent[parentId]) {
        groupsByParent[parentId] = [];
        itemsLost[parentId] = true;
      }
      groupsByParent[parentId].push(item);

      // 先遍历到了父节点，现在找到了子节点，建立关系
      const parent = itemsMap[parentId];
      if (parent) {
        if (!parent.children) {
          parent.children = groupsByParent[parentId];
          itemsLost[parentId] = false;
        }
      } else {
        itemRecordHasChirdren[parentId] = true;
      }
    } else {
      itemsNoParent.push(item);
    }
    // 先遍历到了子节点，现在找到了父节点，建立关系
    if (itemRecordHasChirdren[id]) {
      if (!item.children) {
        item.children = groupsByParent[id];
        itemsLost[id] = false;
      }
    }
  }
  // 缺项抛出错误
  if (opt.lostError) {
    const ids = Object.keys(itemsLost).filter((k) => itemsLost[k]);
    if (ids.length) {
      throw new Error(`Can't find items:[${ids.join(',')}]`);
    }
  }
  // 返回根节点元素
  return itemsNoParent;
}

export { treeFromArray };
