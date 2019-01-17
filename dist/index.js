'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.findLeavesFromTree = exports.treeToArray = exports.findChildren = exports.treeFromArray = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultTreeFromArrayOpt = {
    childrenKey: 'children',
    parentIdKey: 'parentId',
    idKey: 'id',
    hasParent: function hasParent(item, parentIdKey) {
        return item[parentIdKey];
    }
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
    recursion: true,
    hasParent: function hasParent(item, parentIdKey) {
        return item[parentIdKey];
    }
};

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

    var _loop = function _loop(i) {
        var item = temp[i];
        if (opt.hasParent(item, opt.parentIdKey)) {
            var parent = temp.find(function (n) {
                return n[opt.idKey] === item[opt.parentIdKey];
            });
            if (!Array.isArray(parent[opt.childrenKey])) {
                parent[opt.childrenKey] = [];
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
            var _item = duplicate[j];
            if (_item[opt.parentIdKey] === _current[opt.idKey]) {
                result.push(duplicate.splice(j, 1)[0]);
                j--;
            }
        }
        // result=arr.filter(n=>n)
    }
    result.shift();

    return result;
}

exports.treeFromArray = treeFromArray;
exports.findChildren = findChildren;
exports.treeToArray = treeToArray;
exports.findLeavesFromTree = findLeavesFromTree;