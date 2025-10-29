# 百度贴吧毕业设计项目

## 项目概述
这是一个基于Veaury框架（Vue + React混合）开发的百度贴吧类似应用。

## 技术栈
- 前端：Veaury (Vue 3 + React) + Vite
- 后端：Django + Django REST Framework
- 数据库：MySQL 8.0
- 缓存：Redis
- 部署：Docker

## 快速开始

### 前置要求
- Node.js 16+
- Python 3.9+
- MySQL 8.0+
- Redis 6.0+

### 前端安装
```bash
cd frontend
npm install
npm run dev
```

### 后端安装
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## 项目结构
- `frontend/` - 前端代码（Vue + React混合）
- `backend/` - 后端API服务
- `docs/` - 项目文档
- `scripts/` - 部署和开发脚本