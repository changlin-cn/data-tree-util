# data-tree-util

## Usage
[source code](https://github.com/changlin-cn/data-tree-util/blob/master/src/index.js)
```javascript
npm install data-tree-util --save-dev

const {
    treeFromArray,
    findChildren,
    treeToArray,
    findLeavesFromTree,
    findAncestors,
} = require('data-tree-util');

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
    treeFromArray(data);
    /*
    =>
    [
      {
        "id": "1",
        "parentId": null,
        "children": [
          {
            "id": "1-1",
            "parentId": "1",
            "children": [
              {
                "id": "1-1-1",
                "test": "111",
                "parentId": "1-1"
              },
              {
                "id": "1-1-2",
                "parentId": "1-1"
              },
              {
                "id": "1-1-3",
                "parentId": "1-1"
              }
            ]
          },
          {
            "id": "1-2",
            "parentId": "1",
            "children": [
              {
                "id": "1-2-1",
                "parentId": "1-2"
              },
              {
                "id": "1-2-2",
                "parentId": "1-2"
              }
            ]
          },
          {
            "id": "1-3",
            "parentId": "1"
          }
        ]
      },
      {
        "id": "2",
        "parentId": null
      }
    ]
    */



   const data2 = [{ id2: '1' }, { id2: '2' }, { id2: '1-2', pid: '1' }];
    treeFromArray(data2, {
        parentIdKey: 'pid',
        idKey: 'id2',
        childrenKey: 'cd',
    });
    /*
    =>
    [
      {
        "id2": "1",
        "cd": [
          {
            "id2": "1-2",
            "pid": "1"
          }
        ]
      },
      {
        "id2": "2"
      }
    ]
    */



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

    treeToArray(tree)
    /*
    =>
    [ { id: '1' },
      { id: '2' },
      { id: '1-1', parentId: '1' },
      { id: '1-2', parentId: '1' },
      { id: '1-3', parentId: '1' },
      { id: '1-1-1', test: '1-1-1', parentId: '1-1' },
      { id: '1-1-2', test: '1-1-2', parentId: '1-1' },
      { id: '1-1-3', parentId: '1-1' },
      { id: '1-2-1', parentId: '1-2' },
      { id: '1-2-2', parentId: '1-2' } ]
    */






   const tree2 = [
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

    findLeavesFromTree(tree2);
    /*
    =>
    [ { id: '2' },
      { id: '1-3', parentId: '1' },
      { id: '1-1-1', test: '1-1-1', parentId: '1-1' },
      { id: '1-1-2', test: '1-1-2', parentId: '1-1' },
      { id: '1-1-3', parentId: '1-1' },
      { id: '1-2-1', parentId: '1-2' },
      { id: '1-2-2', parentId: '1-2' } ]
    
    */





   const data3 = [
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
findChildren(data3, '1');

/*
=>
[ { id: '1-2', parentId: '1' },
      { id: '1-1', parentId: '1' },
      { id: '1-2-1', parentId: '1-2' },
      { id: '1-1-1', test: '111', parentId: '1-1' },
      { id: '1-1-2', parentId: '1-1' },
      { id: '1-1-3', parentId: '1-1' } ]

*/
```
