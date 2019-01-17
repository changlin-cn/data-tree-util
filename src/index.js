const defaultTreeFromArrayOpt = {
    childrenKey: 'children',
    parentIdKey: 'parentId',
    idKey: 'id',
    hasParent(item, parentIdKey) {
        return item[parentIdKey];
    },
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
    hasParent(item, parentIdKey) {
        return item[parentIdKey];
    },
};

/**
 * treeFromArray
 * @param {array} arr
 * @param {object} opt
 */
function treeFromArray(arr, option) {
    const opt = { ...defaultTreeFromArrayOpt, ...option };
    const temp = arr.map((n) => ({ ...n }));

    for (let i = 0; i < temp.length; i++) {
        const item = temp[i];
        if (opt.hasParent(item, opt.parentIdKey)) {
            const parent = temp.find(
                (n) => n[opt.idKey] === item[opt.parentIdKey],
            );
            if (!Array.isArray(parent[opt.childrenKey])) {
                parent[opt.childrenKey] = [];
            }
            parent[opt.childrenKey].push(item);
        }
    }

    return temp.filter((n) => !opt.hasParent(n, opt.parentIdKey));
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

export { treeFromArray, findChildren, treeToArray, findLeavesFromTree };
