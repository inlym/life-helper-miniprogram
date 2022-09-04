# 使用 iconfont 流程

在 iconfont 添加新图标后，想要在小程序中使用，需要进行资源替换，以下是操作流程：

第 1 步：将 iconfont 项目设置中，将字体格式勾选 `WOFF2` 和 `Base64`。（这一步已完成，后续无需操作）

第 2 步：从 iconfont 官网下载资源（压缩包）并解压至本地。

第 3 步：将资源目录中的 `iconfont.css` 复制至小程序的 `miniprogram/assets/styles/iconfont` 目录下。

第 4 步：将复制后的 `iconfont.css` 文件改名为 `iconfont.wxss`。

第 5 步：在 `app.scss` 中引入（该步已完成，后续迭代中无需操作）。

```scss
@import '/assets/styles/iconfont/iconfont.wxss';
```
