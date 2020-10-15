const defaultTreeFromArrayOpt = {
    childrenKey: 'children',
    parentIdKey: 'parentId',
    idKey: 'id',
    hasParent(item, parentIdKey) {
        return item[parentIdKey];
    },
    lostError: true,
};
const defaultTreeToArrayOpt = {
    childrenKey: 'children',
    parentIdKey: 'parentId',
    idKey: 'id',
    onlyLeavesReturn: false,
};
const defaultFindChildrenOpt = {
    childrenKey: 'children',
    parentIdKey: 'parentId',
    idKey: 'id',
    recursion: true,
};
const defaultFindAncestorsOpt = {
    parentIdKey: 'parentId',
    idKey: 'id',
    resultIncludeSelf: true,
};
const defaultGetPathFromTreeOpt = {
    childrenKey: 'children',
    isIt: (item, id) => item.id === id,
};

function treeFromArraySlow(arr, option) {
    const opt = { ...defaultTreeFromArrayOpt, ...option };
    const temp = arr.map((n) => ({ ...n }));

    for (let i = 0; i < temp.length; i++) {
        const item = temp[i];
        if (opt.hasParent(item, opt.parentIdKey)) {
            const parent = temp.find(
                (n) => n[opt.idKey] === item[opt.parentIdKey],
            );
            try {
                if (!Array.isArray(parent[opt.childrenKey])) {
                    parent[opt.childrenKey] = [];
                }
            } catch (e) {
                // debugger
                throw new Error(
                    `${e.message}. item.id:${item[opt.idKey]};item.parentId:${
                        item[opt.parentIdKey]
                    }`,
                );
            }
            parent[opt.childrenKey].push(item);
        }
    }

    return temp.filter((n) => !opt.hasParent(n, opt.parentIdKey));
}

// 时间复杂度（treeFromArraySlow）：最好：O(3n)     最遭：O((n+1)*n)
//  时间复杂度(treeFromArray)：O(n)
/**
 * treeFromArray
 * @param {array} arr
 * @param {object} opt
 */
function treeFromArray(arr, option) {
    const opt = { ...defaultTreeFromArrayOpt, ...option };
    const temp = arr.map((n) => ({ ...n, [opt.childrenKey]: undefined }));

    const groupsByParent = {};
    const itemsMap = {};
    const itemRecordHasChirdren = {};
    const itemsNoParent = [];
    const itemsLost = {};
    // 遍历所有节点，找出对应关系
    for (let i = 0; i < temp.length; i++) {
        const item = temp[i];
        const hasParent = opt.hasParent(item, opt.parentIdKey);
        const parentId = item[opt.parentIdKey];
        const id = item[opt.idKey];
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
                if (!parent[opt.childrenKey]) {
                    parent[opt.childrenKey] = groupsByParent[parentId];
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
            if (!item[opt.childrenKey]) {
                item[opt.childrenKey] = groupsByParent[id];
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

/**
 * treeToArray
 * @param {array} arr
 * @param {object} option
 */
function treeToArray(arr, option) {
    const opt = { ...defaultTreeToArrayOpt, ...option };
    let result = [...arr];

    for (let i = 0; i < result.length; i++) {
        const current = result[i];
        const children = current[opt.childrenKey];
        if (Array.isArray(children)) {
            result = result.concat(
                children.map((n) => ({
                    ...n,
                    [opt.parentIdKey]: current[opt.idKey],
                })),
            );
        }
    }

    if (opt.onlyLeavesReturn) {
        return result
            .filter((n) => {
                const children = n[opt.childrenKey];
                return (
                    !children ||
                    (Array.isArray(children) && children.length === 0)
                );
            })
            .map(({ [opt.childrenKey]: children, ...rest }) => rest);
    }

    return result.map(({ [opt.childrenKey]: children, ...rest }) => rest);
}

/**
 * findLeavesFromTree
 * @param {array} arr
 * @param {object} option
 */
function findLeavesFromTree(arr, option) {
    return treeToArray(arr, { ...option, onlyLeavesReturn: true });
}

/**
 * findChildren
 * @param {array} arr
 * @param {string | number} id
 * @param {object} option
 */
function findChildren(arr, id, option) {
    const duplicate = [...arr];
    const opt = { ...defaultFindChildrenOpt, ...option };

    const result = [arr.find((n) => n[opt.idKey] === id)];
    for (let i = 0; i < (opt.recursion ? result.length : 1); i++) {
        const current = result[i];
        for (let j = 0; j < duplicate.length; j++) {
            const item = duplicate[j];
            if (item[opt.parentIdKey] === current[opt.idKey]) {
                result.push(duplicate.splice(j, 1)[0]);
                j--;
            }
        }
        // result=arr.filter(n=>n)
    }
    result.shift();

    return result;
}

function findAncestors(arr, id, option) {
    const opt = { ...defaultFindAncestorsOpt, ...option };
    const { resultIncludeSelf, idKey, parentIdKey } = opt;
    const current = arr.find((n) => n[idKey] === id);
    const result = resultIncludeSelf ? (current ? [current] : []) : [];
    for (let i = 0; i <= result.length; i++) {
        const item = i === 0 ? current : result[i];
        const parent = arr.find((n) => n[idKey] === item[parentIdKey]);
        if (parent) {
            result.push(parent);
            continue;
        }
        break;
    }
    return result;
}

function getPathFromTree(arr = [], id, option = defaultGetPathFromTreeOpt) {
    const { childrenKey, isIt } = option;
    const queue = [{ item: { [childrenKey]: arr }, path: '' }];
    while (queue.length) {
        const current = queue.shift();
        const {
            item: { [childrenKey]: children },
            path,
        } = current;
        if (isIt(current.item, id) && path) {
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

export {
    treeFromArraySlow,
    treeFromArray,
    findChildren,
    treeToArray,
    findLeavesFromTree,
    findAncestors,
    getPathFromTree,
};
