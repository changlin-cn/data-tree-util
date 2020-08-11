'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPathFromTree = exports.findAncestors = exports.findLeavesFromTree = exports.treeToArray = exports.findChildren = exports.treeFromArray = exports.treeFromArraySlow = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultTreeFromArrayOpt = {
    childrenKey: 'children',
    parentIdKey: 'parentId',
    idKey: 'id',
    hasParent: function hasParent(item, parentIdKey) {
        return item[parentIdKey];
    },

    lostError: true
};
var defaultTreeToArrayOpt = {
    childrenKey: 'children',
    parentIdKey: 'parentId',
    idKey: 'id',
    onlyLeavesReturn: false
};
var defaultFindChildrenOpt = {
    childrenKey: 'children',
    parentIdKey: 'parentId',
    idKey: 'id',
    recursion: true
};
var defaultFindAncestorsOpt = {
    parentIdKey: 'parentId',
    idKey: 'id',
    resultIncludeSelf: true
};
var defaultGetPathFromTreeOpt = {
    childrenKey: 'children',
    isIt: function isIt(item, id) {
        return item.id === id;
    }
};

function treeFromArraySlow(arr, option) {
    var opt = (0, _extends4.default)({}, defaultTreeFromArrayOpt, option);
    var temp = arr.map(function (n) {
        return (0, _extends4.default)({}, n);
    });

    var _loop = function _loop(i) {
        var item = temp[i];
        if (opt.hasParent(item, opt.parentIdKey)) {
            var parent = temp.find(function (n) {
                return n[opt.idKey] === item[opt.parentIdKey];
            });
            try {
                if (!Array.isArray(parent[opt.childrenKey])) {
                    parent[opt.childrenKey] = [];
                }
            } catch (e) {
                // debugger
                throw new Error(e.message + '. item.id:' + item[opt.idKey] + ';item.parentId:' + item[opt.parentIdKey]);
            }
            parent[opt.childrenKey].push(item);
        }
    };

    for (var i = 0; i < temp.length; i++) {
        _loop(i);
    }

    return temp.filter(function (n) {
        return !opt.hasParent(n, opt.parentIdKey);
    });
}

// 时间复杂度（treeFromArraySlow）：最好：O(3n)     最遭：O((n+1)*n)
//  时间复杂度(treeFromArray)：O(n)
/**
 * treeFromArray
 * @param {array} arr
 * @param {object} opt
 */
function treeFromArray(arr, option) {
    var opt = (0, _extends4.default)({}, defaultTreeFromArrayOpt, option);
    var temp = arr.map(function (n) {
        return (0, _extends4.default)({}, n);
    });

    var groupsByParent = {};
    var itemsMap = {};
    var itemRecordHasChirdren = {};
    var itemsNoParent = [];
    var itemsLost = {};
    // 遍历所有节点，找出对应关系
    for (var i = 0; i < temp.length; i++) {
        var _item = temp[i];
        var hasParent = opt.hasParent(_item, opt.parentIdKey);
        var parentId = _item[opt.parentIdKey];
        var id = _item[opt.idKey];
        if (!itemsMap[id]) {
            itemsMap[id] = _item;
        }
        if (hasParent) {
            if (!groupsByParent[parentId]) {
                groupsByParent[parentId] = [];
                itemsLost[parentId] = true;
            }
            groupsByParent[parentId].push(_item);

            // 先遍历到了父节点，现在找到了子节点，建立关系
            var parent = itemsMap[parentId];
            if (parent) {
                if (!parent[opt.childrenKey]) {
                    parent[opt.childrenKey] = groupsByParent[parentId];
                    delete itemsLost[parentId];
                }
            } else {
                itemRecordHasChirdren[parentId] = true;
            }
        } else {
            itemsNoParent.push(_item);
        }
        // 先遍历到了子节点，现在找到了父节点，建立关系
        if (itemRecordHasChirdren[id]) {
            if (!_item[opt.childrenKey]) {
                _item[opt.childrenKey] = groupsByParent[id];
                delete itemsLost[id];
            }
        }
    }
    // 缺项抛出错误
    if (opt.lostError) {
        var ids = (0, _keys2.default)(itemsLost);
        if (ids.length) {
            throw new Error('Can\'t find items:[' + ids.join(',') + ']');
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
    var opt = (0, _extends4.default)({}, defaultTreeToArrayOpt, option);
    var result = [].concat((0, _toConsumableArray3.default)(arr));

    var _loop2 = function _loop2(i) {
        var current = result[i];
        var children = current[opt.childrenKey];
        if (Array.isArray(children)) {
            result = result.concat(children.map(function (n) {
                return (0, _extends4.default)({}, n, (0, _defineProperty3.default)({}, opt.parentIdKey, current[opt.idKey]));
            }));
        }
    };

    for (var i = 0; i < result.length; i++) {
        _loop2(i);
    }

    if (opt.onlyLeavesReturn) {
        return result.filter(function (n) {
            var children = n[opt.childrenKey];
            return !children || Array.isArray(children) && children.length === 0;
        }).map(function (_ref) {
            var children = _ref[opt.childrenKey],
                rest = (0, _objectWithoutProperties3.default)(_ref, [opt.childrenKey]);
            return rest;
        });
    }

    return result.map(function (_ref2) {
        var children = _ref2[opt.childrenKey],
            rest = (0, _objectWithoutProperties3.default)(_ref2, [opt.childrenKey]);
        return rest;
    });
}

/**
 * findLeavesFromTree
 * @param {array} arr
 * @param {object} option
 */
function findLeavesFromTree(arr, option) {
    return treeToArray(arr, (0, _extends4.default)({}, option, { onlyLeavesReturn: true }));
}

/**
 * findChildren
 * @param {array} arr
 * @param {string | number} id
 * @param {object} option
 */
function findChildren(arr, id, option) {
    var duplicate = [].concat((0, _toConsumableArray3.default)(arr));
    var opt = (0, _extends4.default)({}, defaultFindChildrenOpt, option);

    var result = [arr.find(function (n) {
        return n[opt.idKey] === id;
    })];
    for (var i = 0; i < (opt.recursion ? result.length : 1); i++) {
        var _current = result[i];
        for (var j = 0; j < duplicate.length; j++) {
            var _item2 = duplicate[j];
            if (_item2[opt.parentIdKey] === _current[opt.idKey]) {
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
    var opt = (0, _extends4.default)({}, defaultFindAncestorsOpt, option);
    var resultIncludeSelf = opt.resultIncludeSelf,
        idKey = opt.idKey,
        parentIdKey = opt.parentIdKey;

    var current = arr.find(function (n) {
        return n[idKey] === id;
    });
    var result = resultIncludeSelf ? current ? [current] : [] : [];

    var _loop3 = function _loop3(i) {
        var item = i === 0 ? current : result[i];
        var parent = arr.find(function (n) {
            return n[idKey] === item[parentIdKey];
        });
        if (parent) {
            result.push(parent);
            return 'continue';
        }
        return 'break';
    };

    _loop4: for (var i = 0; i <= result.length; i++) {
        var _ret3 = _loop3(i);

        switch (_ret3) {
            case 'continue':
                continue;

            case 'break':
                break _loop4;}
    }

    return result;
}

function getPathFromTree() {
    var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var id = arguments[1];
    var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultGetPathFromTreeOpt;
    var childrenKey = option.childrenKey,
        isIt = option.isIt;

    var queue = [{ item: (0, _defineProperty3.default)({}, childrenKey, arr), path: '' }];
    while (queue.length) {
        var _current2 = queue.shift();
        var _children = _current2.item[childrenKey],
            path = _current2.path;

        if (isIt(_current2.item, id) && path) {
            return path.split('-').map(function (v) {
                return Number(v);
            });
        }
        if (Array.isArray(_children) && _children.length) {
            for (var i = 0; i < _children.length; i++) {
                queue.push({
                    item: _children[i],
                    path: '' + (path ? path + '-' : '') + i
                });
            }
        }
    }
    throw new Error('Can not get path of ' + id);
}

exports.treeFromArraySlow = treeFromArraySlow;
exports.treeFromArray = treeFromArray;
exports.findChildren = findChildren;
exports.treeToArray = treeToArray;
exports.findLeavesFromTree = findLeavesFromTree;
exports.findAncestors = findAncestors;
exports.getPathFromTree = getPathFromTree;