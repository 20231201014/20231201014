# 百度贴吧毕业设计项目 - GitHub推送完整指南

## 目录
1. [Git安装步骤](#git安装步骤)
2. [手动命令推送代码](#手动命令推送代码)
3. [创建GitHub个人访问令牌](#创建github个人访问令牌)
4. [常见问题解决](#常见问题解决)
5. [项目结构说明](#项目结构说明)

## Git安装步骤

### 1. 下载Git安装包

访问 [Git官方网站](https://git-scm.com/download/win) 下载最新版本的Git for Windows。

### 2. 运行安装程序

1. 找到下载的安装包（通常在`下载`文件夹中，文件名类似`Git-2.43.0-64-bit.exe`）
2. 双击运行安装程序

### 3. 安装配置（使用默认选项）

按照安装向导的提示，以下是关键步骤的截图说明：

| 步骤 | 配置选项 | 截图参考 |
|------|---------|----------|
| 选择安装路径 | 默认：`C:\Program Files\Git` | [安装路径截图](https://git-scm.com/download/win/images/install-path.png) |
| 选择组件 | 保持所有默认选项选中 | [组件选择截图](https://git-scm.com/download/win/images/select-components.png) |
| 选择开始菜单文件夹 | 保持默认值 | [开始菜单截图](https://git-scm.com/download/win/images/start-menu.png) |
| 选择编辑器 | 推荐：Visual Studio Code（如果已安装） | [编辑器选择截图](https://git-scm.com/download/win/images/editor-selection.png) |
| PATH环境变量 | 选择："Git from the command line and also from 3rd-party software" | [PATH配置截图](https://git-scm.com/download/win/images/path-setup.png) |
| HTTPS传输后端 | 选择："Use the OpenSSL library" | [HTTPS配置截图](https://git-scm.com/download/win/images/ssl-setup.png) |
| 行尾符号转换 | 选择："Checkout Windows-style, commit Unix-style line endings" | [行尾符号截图](https://git-scm.com/download/win/images/line-endings.png) |
| 终端模拟器 | 选择："Use Windows' default console window" | [终端选择截图](https://git-scm.com/download/win/images/terminal-setup.png) |

**重要**：安装完成后，请重启电脑以确保Git正确配置到系统PATH中。

## 手动命令推送代码

### 1. 打开命令提示符

按下 `Win + R` 键，输入 `cmd`，然后按 Enter 打开命令提示符。

### 2. 切换到项目目录

```cmd
cd c:\Users\35793\Desktop\新建文件夹\20231201014--
```

### 3. 检查Git是否安装成功

```cmd
git --version
```

如果安装成功，将显示类似 `git version 2.43.0.windows.1` 的输出。

### 4. 配置Git用户信息

请将下面的命令中的用户名和邮箱替换为您的GitHub账号信息：

```cmd
git config --global user.name "您的GitHub用户名"
git config --global user.email "您的GitHub邮箱"
```

### 5. 初始化Git仓库

```cmd
git init
```

### 6. 添加所有文件到暂存区

```cmd
git add .
```

### 7. 提交更改

```cmd
git commit -m "初始化百度贴吧毕业设计项目"
```

### 8. 添加GitHub远程仓库

```cmd
git remote add origin https://github.com/20231201014/20231201014--.git
```

### 9. 推送到GitHub

```cmd
git push -u origin master
```

**注意**：首次推送时，会弹出身份验证窗口。请输入您的GitHub用户名，然后对于密码，请使用您的GitHub个人访问令牌（见下方说明）。

## 创建GitHub个人访问令牌

由于GitHub不再支持使用密码进行身份验证，您需要创建个人访问令牌：

### 1. 登录GitHub

访问 [GitHub官网](https://github.com) 并登录您的账号。

### 2. 进入设置页面

点击右上角的头像，然后选择 "Settings"。

### 3. 进入开发者设置

在左侧菜单中，滚动到底部，点击 "Developer settings"。

### 4. 生成个人访问令牌

1. 点击 "Personal access tokens"，然后选择 "Tokens (classic)"
2. 点击 "Generate new token"，然后选择 "Generate new token (classic)"
3. 为令牌添加描述（例如："百度贴吧项目推送"）
4. 设置令牌过期时间（可以选择 "No expiration"）
5. 在权限部分，至少勾选 `repo` 权限
6. 滚动到底部，点击 "Generate token"

### 5. 保存令牌

**重要**：生成的令牌只会显示一次，请立即复制并保存它。

## 常见问题解决

### 1. Git未找到错误

如果运行 `git --version` 时显示 "'git' 不是内部或外部命令"：

- 确保Git已正确安装
- 重启电脑以更新系统PATH
- 检查环境变量中是否包含Git的安装路径

### 2. 权限被拒绝错误

如果推送时显示 "remote: Permission to 20231201014/20231201014--.git denied"：

- 确保您使用的个人访问令牌包含 `repo` 权限
- 检查您是否拥有该GitHub仓库的写入权限
- 确认您的GitHub用户名输入正确

### 3. 远程仓库已经存在

如果运行 `git remote add origin` 时显示 "fatal: remote origin already exists"：

```cmd
git remote remove origin
git remote add origin https://github.com/20231201014/20231201014--.git
```

### 4. 网络连接问题

如果推送时遇到网络错误：

- 检查您的网络连接
- 尝试使用VPN
- 验证防火墙设置是否阻止了Git连接

## 项目结构说明

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
│   │   ├── App.vue        # 主应用组件
│   │   ├── components/    # 组件目录
│   │   ├── main.js        # 入口文件
│   │   ├── router/        # 路由配置
│   │   ├── services/      # API服务
│   │   ├── stores/        # 状态管理
│   │   ├── utils/         # 工具函数
│   │   └── views/         # 页面视图
│   └── vite.config.js     # Vite构建配置
├── 百度贴吧毕业设计项目文档.md   # 项目详细文档
└── 贴吧页面原型.html        # 页面原型设计
```

## 完成后操作

代码成功推送到GitHub后，您可以：

1. 在GitHub网站上查看您的代码库
2. 邀请其他协作者参与项目
3. 设置GitHub Pages来部署您的前端应用（如果需要）
4. 继续在本地开发，并使用以下命令管理代码：

```cmd
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

## 项目已实现功能

您的百度贴吧毕业设计前端项目已完整实现以下功能：

- 用户登录和注册系统
- 发布帖子功能
- 用户中心页面
- 响应式UI设计
- 完整的API服务配置
- 环境变量配置
- 组件化架构设计

祝您项目开发顺利！