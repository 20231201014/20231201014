# GitHub账户代码推送指南

## 重要提醒

系统中尚未安装Git，您需要先完成Git的安装，然后才能执行以下推送步骤。请参考我们创建的《Git手动安装指南.md》完成Git安装。

## 步骤1：在GitHub上创建仓库

在推送代码前，您需要在GitHub上创建一个仓库：

1. 访问 [GitHub网站](https://github.com) 并登录您的账号 `20231201014`
2. 点击右上角的「+」号，选择「New repository」
3. 仓库名称填写为 `20231201014--` （与本地文件夹名称一致）
4. 点击「Create repository」完成创建

## 步骤2：配置Git用户信息

安装完Git并重启计算机后，打开命令提示符（Win + R，输入cmd，按Enter）：

```cmd
cd c:\Users\35793\Desktop\新建文件夹\20231201014--
git config --global user.name "20231201014"
git config --global user.email "您的GitHub邮箱地址"
```

## 步骤3：初始化本地仓库并添加远程仓库

```cmd
cd c:\Users\35793\Desktop\新建文件夹\20231201014--
git init
git remote add origin https://github.com/20231201014/20231201014--.git
```

## 步骤4：添加文件并提交

```cmd
git add .
git commit -m "初始化百度贴吧毕业设计项目"
```

## 步骤5：推送到GitHub

```cmd
git push -u origin master
```

首次推送时，会弹出身份验证窗口，请使用您的GitHub用户名和个人访问令牌（而非密码）进行验证。

## 创建GitHub个人访问令牌

由于GitHub不再支持使用密码进行身份验证，您需要创建个人访问令牌：

1. 登录GitHub账户
2. 点击右上角头像 → Settings
3. 滚动到底部 → Developer settings
4. 点击 Personal access tokens → Tokens (classic)
5. 点击 Generate new token → Generate new token (classic)
6. 设置描述名称（如「百度贴吧项目推送」）
7. 选择过期时间（可选择 No expiration）
8. 选择权限：至少勾选 `repo`
9. 点击 Generate token
10. **重要**：复制并保存生成的令牌，它只会显示一次

## 常见问题解决

### Git未找到错误
- 确保Git已正确安装
- 重启计算机以更新系统PATH
- 检查环境变量中是否包含Git的安装路径

### 仓库不存在错误
- 确保已在GitHub上创建了名称为 `20231201014--` 的仓库
- 检查远程仓库URL是否正确：`https://github.com/20231201014/20231201014--.git`

### 权限被拒绝错误
- 确保使用个人访问令牌而非密码
- 验证令牌是否包含 `repo` 权限
- 确认您是该仓库的所有者

## 完整操作流程

如果Git已安装，您可以复制以下命令一次性执行：

```cmd
cd c:\Users\35793\Desktop\新建文件夹\20231201014--
git config --global user.name "20231201014"
git config --global user.email "您的GitHub邮箱地址"
git init
git add .
git commit -m "初始化百度贴吧毕业设计项目"
git remote add origin https://github.com/20231201014/20231201014--.git
git push -u origin master
```

请确保将 "您的GitHub邮箱地址" 替换为您在GitHub上注册的实际邮箱地址。

祝您操作顺利！如有任何问题，请随时参考我们提供的详细指南。