# 使用 iconfont 流程

在 iconfont 添加新图标后，想要在小程序中使用，需要进行资源替换，以下是操作流程：

第 1 步：从 iconfont 官网下载资源（压缩包）并解压至本地。

第 2 步：将资源目录中的 `iconfont.css` 复制至小程序的 `miniprogram/assets/styles/iconfont` 目录下。

第 3 步：将复制后的 `iconfont.css` 文件改名为 `iconfont.wxss`，并在文件内的资源文件引用地址前加上 `/assets/styles/iconfont/`，最终变成形如 `/assets/styles/iconfont/iconfont.woff2?t=1660745166081` 的格式。

第 4 步：打开网站 [transfonter](https://transfonter.org/)，点击 _Add fonts_ 按钮，然后选中资源目录中的 `iconfont.woff2` 文件，并在下方选项中开启 _Base64 encode_ ，然后点击 _Convert_ 按钮。

第 5 步：下载第 4 步产生的文件并解压，打开 `stylesheet.css` 文件，复制 `src` 这一行然后替换 `iconfont.wxss` 的对应行。

第 4 步：在 `app.scss` 中引入（该步已完成，后续迭代中无需操作）。

```scss
@import '/assets/styles/iconfont/iconfont.wxss';
```
