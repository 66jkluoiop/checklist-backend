-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS checklist_db
    DEFAULT CHARACTER SET utf8mb4 
    DEFAULT COLLATE utf8mb4_unicode_ci
    COMMENT '待办事项清单数据库';

-- 使用数据库
USE checklist_db;

-- 创建任务表
CREATE TABLE IF NOT EXISTS tasks (
    -- 主键和基本信息
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '任务ID，自增主键',
    title VARCHAR(255) NOT NULL COMMENT '任务标题，不能为空',
    description TEXT COMMENT '任务详细描述，可选',
    content LONGTEXT COMMENT '任务内容，支持富文本格式',
    
    -- 任务状态和优先级
    status ENUM('pending', 'in_progress', 'completed') 
        DEFAULT 'pending' 
        COMMENT '任务状态：pending-待处理，in_progress-进行中，completed-已完成',
    priority ENUM('low', 'medium', 'high') 
        DEFAULT 'medium' 
        COMMENT '任务优先级：low-低优先级，medium-中优先级，high-高优先级',
    
    -- 时间相关字段
    due_date DATE COMMENT '任务截止日期，可选',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间，自动设置',
    updated_at TIMESTAMP 
        DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP 
        COMMENT '更新时间，自动更新'
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci
  COMMENT '待办事项任务表';

-- 添加索引
CREATE INDEX idx_status ON tasks(status) COMMENT '任务状态索引，用于按状态查询和筛选';
CREATE INDEX idx_priority ON tasks(priority) COMMENT '任务优先级索引，用于按优先级查询和筛选';
CREATE INDEX idx_due_date ON tasks(due_date) COMMENT '截止日期索引，用于按日期查询和排序';