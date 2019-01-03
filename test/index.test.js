const {
    treeFromArray,
    findChildren,
    treeToArray,
    findLeavesFromTree,
} = require('../src/index');

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
    console.log(JSON.stringify(result, null, 2));

    expect(data.length).toBe(10);
    expect(result.length).toBe(2);
    expect(result.find((n) => n.children).children.length > 0).toBe(true);
    expect(
        result
            .find((n) => n.id === '1')
            .children.find((n) => n.id === '1-1')
            .children.find((n) => n.id === '1-1-1').test === '111',
    ).toBe(true);

    const data2 = [{ id2: '1' }, { id2: '2' }, { id2: '1-2', pid: '1' }];
    const result2 = treeFromArray(data2, {
        parentIdKey: 'pid',
        idKey: 'id2',
        childrenKey: 'cd',
    });
    console.log(JSON.stringify(result2, null, 2));
    expect(result2.length).toBe(2);
    expect(result2.find((n) => n.cd && n.cd.length > 0).id2 === '1').toBe(true);
});

test('treeToArray', () => {
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
        },
    ];

    const result = treeToArray(tree);
    console.log(result);
    expect(result.length).toBe(10);
    expect(result.find((n) => n.id === '1-1-1').test === '1-1-1').toBe(true);
    expect(result.find((n) => n.id === '2').parentId).toBe(undefined);
    expect(result.find((n) => n.id === '1-1').parentId).toBe('1');
});

test('findLeavesFromTree', () => {
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
        },
    ];

    const result = findLeavesFromTree(tree);
    console.log(result);
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
    console.log(result);
    expect(result.length).toBe(6);
    expect(result.find((n) => n.id === '1-1-1').test).toBe('111');
});
