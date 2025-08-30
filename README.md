# Checklist Backend

这是一个基于 Node.js + Express + MySQL 的待办事项清单后端服务。

## 功能特性

- 任务的增删改查
- 任务状态管理（待处理/进行中/已完成）
- 任务优先级设置（低/中/高）
- 支持任务截止日期
- 支持按状态、优先级筛选
- 支持标题和描述搜索
- 提供任务统计信息

## API 接口

### 基础信息
- 基础URL：`http://localhost:3000/api`
- 所有接口都返回 JSON 格式数据

### 主要接口

1. 获取所有任务
   - GET `/api/tasks`
   - 支持过滤参数：status, priority, search

2. 创建任务
   - POST `/api/tasks`

3. 获取单个任务
   - GET `/api/tasks/:id`

4. 更新任务
   - PUT `/api/tasks/:id`

5. 删除任务
   - DELETE `/api/tasks/:id`

6. 更新任务状态
   - PATCH `/api/tasks/:id/status`

7. 获取任务统计
   - GET `/api/tasks/stats`

## 技术栈

- Node.js
- Express
- MySQL
- cors（跨域支持）
- dotenv（环境变量管理）

## 开发环境设置

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量：
创建 `.env` 文件并设置以下变量：
```
PORT=3000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=checklist_db
DB_PORT=3306
```

3. 初始化数据库：
```bash
node src/config/initDb.js
```

4. 启动服务器：
```bash
node index.js
```

## 项目结构

```
.
├── src/
│   ├── config/         # 配置文件
│   ├── controllers/    # 控制器
│   ├── models/        # 数据模型
│   ├── routes/        # 路由定义
│   └── app.js         # 应用主文件
├── .env               # 环境变量
├── index.js           # 入口文件
└── README.md          # 项目说明文档
```
