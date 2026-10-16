# 使用说明

## 文件结构
- `index.html` 等 `.html` 文件：页面骨架，一般不用改
- `*_data.js`：页面上的所有文字内容，改内容只改这些文件
  - `sidebar_data.js` 左侧头像栏 · `home_data.js` 首页 · `pub_data.js` 研究/项目页
  - `news_data.js` 动态 · `aboutme_data.js` 关于我 · `contact_data.js` 联系方式
- `images/` 照片 · `pdf/` 简历
- `style.css` 顶部的 `--accent` 可以换主题色

## 发布到 GitHub Pages
1. 在 GitHub 新建一个仓库，名字写成 `你的用户名.github.io`（如果两个网站都要上线，第二个网站可以建一个普通仓库，比如 `cn`，网址会是 `你的用户名.github.io/cn`）
2. 把这个文件夹里的所有文件上传到仓库根目录（Add file → Upload files）
3. 仓库 Settings → Pages → Source 选 `main` 分支、`/ (root)`，保存
4. 等一两分钟，访问 `https://你的用户名.github.io`

## 本地预览
直接双击 `index.html` 就能在浏览器里打开。
