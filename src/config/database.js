const mysql = require('mysql2');
require('dotenv').config();

// 创建连接池
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 将连接池转换为 Promise 形式，以便使用 async/await
const promisePool = pool.promise();

// 测试数据库连接
async function testConnection() {
    try {
        const [rows] = await promisePool.query('SELECT 1');
        console.log('数据库连接成功！');
    } catch (error) {
        console.error('数据库连接失败：', error);
    }
}

// 导出连接池和测试函数
module.exports = {
    pool: promisePool,
    testConnection
};
