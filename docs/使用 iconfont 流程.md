# 使用 iconfont 流程

在 iconfont 添加新图标后，想要在小程序中使用，需要进行资源替换，以下是操作流程：

第 1 步：从 iconfont 官网下载资源（压缩包）并解压至本地。

第 2 步：将资源目录中的以下文件复制至小程序的 `miniprogram/assets/styles/iconfont` 目录下

- `iconfont.woff2`
- `iconfont.ttf`
- `iconfont.svg`
- `iconfont.css`

实际上前 3 个资源只需要 1 个就可以了，为避免出现难以预料的兼容性问题，就全放上去了。

第 3 步：将复制后的 `iconfont.css` 文件改名为 `iconfont.wxss`，并在文件内的资源文件引用地址前加上 `/assets/styles/iconfont/`，最终变成形如 `/assets/styles/iconfont/iconfont.woff2?t=1660745166081` 的格式。

第 4 步：在 `app.scss` 中引入（该步已完成，后续迭代中无需操作）。

```scss
@import '/assets/styles/iconfont/iconfont.wxss';
```
