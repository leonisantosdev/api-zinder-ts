"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformName = void 0;
var transformName = function (name) {
    return name.trim().toLowerCase().split(' ').map(function (word) {
        return word[0].toLocaleUpperCase().concat(word.substring(1));
    }).join(' ');
};
exports.transformName = transformName;
