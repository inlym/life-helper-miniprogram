"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jshttp_1 = __importDefault(require("jshttp"));
Page({
    onLoad() {
        jshttp_1.default({
            url: 'https://debug.inlym.com/request',
        }).then((res) => {
            console.log(res);
        });
    },
});
