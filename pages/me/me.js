"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userinfo_service_1 = require("../../src/services/userinfo.service");
Page({
    data: {
        list1: [
            {
                name: '我的设备',
                url: '/pages/system/info/info',
                icon: 'https://img.lh.inlym.com/icon/keyboard.png',
            },
        ],
        list2: [
            {
                name: '关于',
                url: '/pages/about/about',
                icon: 'https://img.lh.inlym.com/icon/keyboard.png',
            },
        ],
    },
    requested: {
        userInfo: {
            url: '/userinfo',
        },
    },
    debug: {
        configuration: true,
        setData: true,
        request: true,
    },
    config: {},
    onLoad() { },
    onReady() { },
    onShow() { },
    onHide() { },
    onUnload() { },
    onPullDownRefresh() { },
    onReachBottom() { },
    onShareAppMessage() { },
    init() { },
    onUpdateButtonTap() {
        userinfo_service_1.updateUserInfo();
    },
});
