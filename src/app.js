const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');

// 导入路由
const tasksRouter = require('./routes/tasks');

// 创建 Express 应用
const app = express();

// 中间件配置
app.use(cors());  // 启用 CORS
app.use(express.json());  // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true }));  // 解析 URL 编码的请求体

// 测试数据库连接
testConnection();

// 基本路由
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to Checklist API',
        version: '1.0.0',
        endpoints: {
            tasks: '/api/tasks',
            stats: '/api/tasks/stats'
        }
    });
});

// 注册路由模块
app.use('/api/tasks', tasksRouter);

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: '服务器内部错误',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 处理 404 错误
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: '未找到请求的资源'
    });
});

module.exports = app;