# Git安装与GitHub推送指南

本文档提供了在Windows系统上安装Git并将项目推送到GitHub的详细步骤。

## 一、安装Git

### 1. 下载Git安装包

1. 访问 [Git官网](https://git-scm.com/download/win) 下载最新版本的Git for Windows
2. 网站会根据您的操作系统自动推荐适合的版本，点击下载即可

### 2. 运行安装程序

1. 找到下载的安装包（通常在`下载`文件夹中，文件名类似`Git-2.43.0-64-bit.exe`）
2. 双击运行安装程序

### 3. 安装配置选项

在安装向导中，您可以保持默认选项，或根据需要进行自定义：

1. **选择安装路径**：默认通常是`C:\Program Files\Git`
2. **选择组件**：保持默认选择即可
3. **选择开始菜单文件夹**：保持默认
4. **选择Git默认编辑器**：推荐使用Visual Studio Code（如果已安装）
5. **调整PATH环境变量**：选择"Git from the command line and also from 3rd-party software"
6. **选择HTTPS传输后端**：选择"Use the OpenSSL library"
7. **配置行尾符号转换**：选择"Checkout Windows-style, commit Unix-style line endings"
8. **配置终端模拟器**：选择"Use Windows' default console window"
9. **配置额外选项**：保持默认选择
10. **配置实验性功能**：可以不选择

点击"Install"开始安装，安装完成后点击"Finish"。

## 二、验证Git安装

1. 按下`Win + R`键，输入`cmd`，然后按Enter打开命令提示符
2. 输入以下命令检查Git版本：

```bash
git --version
```

如果安装成功，您将看到类似以下输出：

```
git version 2.43.0.windows.1
```

## 三、配置Git用户信息

在使用Git之前，需要配置您的用户名和邮箱，这些信息将用于您的提交记录：

1. 在命令提示符中输入以下命令（替换为您的GitHub用户名）：

```bash
git config --global user.name "您的GitHub用户名"
```

2. 输入以下命令（替换为您的GitHub邮箱）：

```bash
git config --global user.email "您的GitHub邮箱"
```

## 四、将项目推送到GitHub

### 1. 进入项目目录

在命令提示符中，使用`cd`命令进入您的项目目录：

```bash
cd c:\Users\35793\Desktop\新建文件夹\20231201014--
```

### 2. 初始化Git仓库

输入以下命令初始化Git仓库：

```bash
git init
```

这将在当前目录创建一个`.git`文件夹，用于存储Git的版本控制信息。

### 3. 添加文件到暂存区

输入以下命令将所有文件添加到Git暂存区：

```bash
git add .
```

### 4. 提交更改

输入以下命令提交您的更改：

```bash
git commit -m "初始化百度贴吧毕业设计项目"
```

### 5. 关联GitHub仓库

输入以下命令将您的本地仓库与GitHub远程仓库关联：

```bash
git remote add origin https://github.com/20231201014/20231201014--.git
```

### 6. 推送代码到GitHub

输入以下命令将您的代码推送到GitHub：

```bash
git push -u origin master
```

首次推送时，您会看到一个身份验证提示。您需要：

1. 输入您的GitHub用户名
2. 对于密码，GitHub现在推荐使用个人访问令牌（Personal Access Token）

## 五、生成GitHub个人访问令牌（可选但推荐）

由于GitHub不再支持使用密码进行身份验证，您可以生成一个个人访问令牌：

1. 登录您的GitHub账号
2. 点击右上角的头像，选择"Settings"
3. 在左侧菜单中，选择"Developer settings"
4. 选择"Personal access tokens"，然后点击"Generate new token"
5. 为令牌添加描述（如"百度贴吧项目推送"）
6. 选择适当的权限（至少需要`repo`权限）
7. 滚动到底部，点击"Generate token"
8. **重要**：复制生成的令牌并保存，因为您只能看到它一次

推送代码时，当要求输入密码，粘贴您的个人访问令牌即可。

## 六、常见问题与解决方案

### 问题1：权限被拒绝

如果您收到类似"remote: Permission to 20231201014/20231201014--.git denied to [用户名]"的错误：

- 确保您拥有该GitHub仓库的写入权限
- 检查您的GitHub用户名和访问令牌是否正确

### 问题2：远程仓库已经存在

如果您收到类似"fatal: remote origin already exists"的错误：

```bash
git remote remove origin
git remote add origin https://github.com/20231201014/20231201014--.git
```

### 问题3：本地分支与远程分支不匹配

如果推送失败并提示分支不匹配：

```bash
git pull origin master --allow-unrelated-histories
git push -u origin master
```

## 七、项目结构说明

您的百度贴吧毕业设计项目结构如下：

```
20231201014--/
├── .gitignore             # Git忽略文件配置
├── README.md              # 项目说明文档
├── frontend/              # 前端项目目录
│   ├── .env.production    # 生产环境配置
│   ├── README.md          # 前端项目说明
│   ├── index.html         # HTML入口文件
│   ├── package.json       # 前端项目依赖配置
│   ├── src/               # 前端源代码
│   └── vite.config.js     # Vite构建配置
├── 百度贴吧毕业设计项目文档.md   # 项目详细文档
└── 贴吧页面原型.html        # 页面原型设计
```

## 八、完成后的操作

代码成功推送到GitHub后，您可以：

1. 在GitHub网站上查看您的代码库
2. 邀请其他协作者参与项目
3. 设置GitHub Pages来部署您的前端应用（如果需要）
4. 继续在本地开发，并使用`git push`命令将新的更改推送到GitHub

## 九、后续开发命令

在本地继续开发时，常用的Git命令：

```bash
# 查看当前状态
git status

# 添加修改的文件
git add .

# 提交更改
git commit -m "描述您的更改"

# 推送到GitHub
git push

# 从GitHub拉取最新代码
git pull
```

祝您项目开发顺利！