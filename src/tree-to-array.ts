interface treeToArrayOpt {
  onlyLeavesReturn: boolean;
}
const defaultTreeToArrayOpt = {
  onlyLeavesReturn: false,
};

/**
 * treeToArray
 * @param {array} arr
 * @param {object} option
 */

type treeNode<T> = {
  id: string | number;
  children?: treeNode<T>[];
} & T;

export function treeToArray<T extends treeNode<unknown>>(
  arr: T[],
  option: treeToArrayOpt = defaultTreeToArrayOpt,
): (Pick<T, Exclude<keyof T, 'children'>> & { parentId?: string | number })[] {
  let result = [...arr];

  for (let i = 0; i < result.length; i++) {
    const current = result[i];
    const children = current.children as T[];
    if (Array.isArray(children)) {
      result = result.concat(
        children.map((n) => ({
          ...n,
          parentId: current.id,
        })),
      );
    }
  }

  if (option.onlyLeavesReturn) {
    return (
      result
        .filter((n) => {
          const children = n.children;
          return !children || (Array.isArray(children) && children.length === 0);
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(({ children, ...rest }) => rest)
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return result.map(({ children, ...rest }) => rest);
}

// const bb = treeToArray([{ id: '3', test: 3, children: [{ id: '5' }] }]);
