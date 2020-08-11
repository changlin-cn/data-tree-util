const data = require('./big.js').data;

const { treeFromArraySlow, treeFromArray } = require('../dist/index.js');

console.time(`优化前${data.length}条数据`);
const r1= treeFromArraySlow(data, {
    hasParent(item, parentIdKey) {
        return item.parentId !== '0';
    },
});
console.timeEnd(`优化前${data.length}条数据`);

console.time(`优化后${data.length}条数据`);
const r2 = treeFromArray(data, {
    hasParent(item, parentIdKey) {
        return item.parentId !== '0';
    },
});
// debugger;
console.timeEnd(`优化后${data.length}条数据`);
