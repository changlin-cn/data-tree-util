import {
  findChildren,
  treeToArray,
  treeFromArray,
  findLeavesFromTree,
  findAncestors,
  getPathFromTree,
} from '../src/index';

interface treeNode {
  id: string | number;
  children?: treeNode[];
  test?: string | number;
}

test('treeFromArray', () => {
  const data = [
    {
      id: '1',
      parentId: null,
    },

    {
      id: '1-1-1',
      test: '111',
      parentId: '1-1',
    },
    {
      id: '1-2-1',
      parentId: '1-2',
    },
    {
      id: '1-1-2',
      parentId: '1-1',
    },
    {
      id: '1-1-3',
      parentId: '1-1',
    },
    {
      id: '1-1',
      parentId: '1',
    },
    {
      id: '1-2',
      parentId: '1',
    },

    {
      id: '1-2-2',
      parentId: '1-2',
    },
    {
      id: '1-3',
      parentId: '1',
    },
    {
      id: '2',
      parentId: null,
    },
  ];
  const result = treeFromArray(data);
  // console.log(JSON.stringify(result, null, 2));

  expect(data.length).toBe(10);
  expect(result.length).toBe(2);
  expect(result.find((n) => n.children).children.length > 0).toBe(true);
  expect(
    result
      .find((n) => n.id === '1')
      .children.find((n) => n.id === '1-1')
      .children.find((n) => n.id === '1-1-1').test === '111',
  ).toBe(true);

  // 某些项丢失报错
  expect(() => {
    treeFromArray([{ id: '2', parentId: '1' }]);
  }).toThrow(new Error(`Can't find items:[1]`));

  expect(() => {
    treeFromArray([
      { id: '2', parentId: '1' },
      { id: '3', parentId: 'p3' },
    ]);
  }).toThrow(new Error(`Can't find items:[1,p3]`));
  // 忽略项丢失报错
  expect(
    treeFromArray([{ id: '5' }, { id: '2', parentId: '1' }, { id: '3', parentId: 'p3' }], { lostError: false }),
  ).toEqual([{ id: '5' }]);
});

test('treeFromArray: has children', () => {
  const data = [
    {
      id: '1',
      parentId: null,
      children: [],
    },

    {
      id: '1-1-1',
      test: '111',
      parentId: '1-1',
    },
    {
      id: '1-2-1',
      parentId: '1-2',
    },
    {
      id: '1-1-2',
      parentId: '1-1',
    },
    {
      id: '1-1-3',
      parentId: '1-1',
    },
    {
      id: '1-1',
      parentId: '1',
    },
    {
      id: '1-2',
      parentId: '1',
    },

    {
      id: '1-2-2',
      parentId: '1-2',
    },
    {
      id: '1-3',
      parentId: '1',
    },
    {
      id: '2',
      parentId: null,
    },
  ];
  const result = treeFromArray(data);
  // console.log(JSON.stringify(result, null, 2));

  expect(data.length).toBe(10);
  expect(result.length).toBe(2);
});

test('treeToArray', () => {
  const tree: treeNode[] = [
    {
      id: '1',
      children: [
        {
          id: '1-1',
          children: [
            {
              id: '1-1-1',
              test: '1-1-1',
            },
            {
              id: '1-1-2',
              test: '1-1-2',
            },
            {
              id: '1-1-3',
            },
          ],
        },
        {
          id: '1-2',

          children: [
            {
              id: '1-2-1',
            },
            {
              id: '1-2-2',
            },
          ],
        },
        {
          id: '1-3',
        },
      ],
    },
    {
      id: '2',
    },
  ];

  const result = treeToArray(tree);

  // console.log(result);
  expect(result.length).toBe(10);
  expect(result.find((n) => n.id === '1-1-1').test === '1-1-1').toBe(true);
  expect(result.find((n) => n.id === '2').parentId).toBe(undefined);
  expect(result.find((n) => n.id === '1-1').parentId).toBe('1');
});

test('findLeavesFromTree', () => {
  const tree: treeNode[] = [
    {
      id: '1',
      children: [
        {
          id: '1-1',
          children: [
            {
              id: '1-1-1',
              test: '1-1-1',
            },
            {
              id: '1-1-2',
              test: '1-1-2',
            },
            {
              id: '1-1-3',
            },
          ],
        },
        {
          id: '1-2',

          children: [
            {
              id: '1-2-1',
            },
            {
              id: '1-2-2',
            },
          ],
        },
        {
          id: '1-3',
        },
      ],
    },
    {
      id: '2',
    },
  ];

  const result = findLeavesFromTree(tree);
  // console.log(result);
  expect(result.length).toBe(7);
  expect(result.find((n) => n.id === '1-1-1').test).toBe('1-1-1');
  expect(result.find((n) => n.id === '2').parentId).toBe(undefined);
  expect(result.find((n) => n.id === '1-1')).toBe(undefined);
});

test('findChildren', () => {
  const data = [
    {
      id: '1',
      parentId: null,
    },

    {
      id: '1-1-1',
      test: '111',
      parentId: '1-1',
    },
    {
      id: '1-2',
      parentId: '1',
    },
    {
      id: '1-2-1',
      parentId: '1-2',
    },
    {
      id: '1-1-2',
      parentId: '1-1',
    },
    {
      id: '1-1-3',
      parentId: '1-1',
    },
    {
      id: '1-1',
      parentId: '1',
    },
  ];

  const result = findChildren(data, '1');
  // console.log(result);
  expect(result.length).toBe(6);
  expect(result.find((n) => n.id === '1-1-1').test).toBe('111');
});

test('findAncestors', () => {
  const data = [
    {
      id: '1',
      parentId: null,
    },

    {
      id: '1-1-1',
      test: '111',
      parentId: '1-1',
    },
    {
      id: '1-2',
      parentId: '1',
    },
    {
      id: '1-2-1',
      parentId: '1-2',
    },
    {
      id: '1-1-2',
      parentId: '1-1',
    },
    {
      id: '1-1-3',
      parentId: '1-1',
    },
    {
      id: '1-1',
      parentId: '1',
    },
  ];

  const result = findAncestors(data, '1-1-1');
  // console.log(result);
  expect(result.length).toBe(3);
  expect(result.find((n) => n.id === '1-1-1').test).toBe('111');
});

test('getPathFromTree', () => {
  const tree = [
    {
      id: '1',
      children: [
        {
          id: '1-1',
          children: [
            {
              id: '1-1-1',
              test: '1-1-1',
            },
            {
              id: '1-1-2',
              test: '1-1-2',
            },
            {
              id: '1-1-3',
            },
          ],
        },
        {
          id: '1-2',

          children: [
            {
              id: '1-2-1',
            },
            {
              id: '1-2-2',
            },
          ],
        },
        {
          id: '1-3',
        },
      ],
    },
    {
      id: '2',
      children: [
        {
          id: '2-1',
        },
        {
          id: '2-2',
        },
      ],
    },
  ];
  expect(getPathFromTree(tree, '1')).toEqual([0]);

  expect(getPathFromTree(tree, '1-1-3')).toEqual([0, 0, 2]);
  expect(getPathFromTree(tree, '1-2-2')).toEqual([0, 1, 1]);
  expect(getPathFromTree(tree, '2-2')).toEqual([1, 1]);
  expect(() => getPathFromTree(tree, '5-3')).toThrowError();
});
