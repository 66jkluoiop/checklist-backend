const { pool } = require('../config/database');

class Task {
    /**
     * 创建新任务
     * @param {Object} taskData - 任务数据
     * @param {string} taskData.title - 任务标题
     * @param {string} [taskData.description] - 任务描述（可选）
     * @param {string} [taskData.content] - 任务内容，支持富文本（可选）
     * @param {string} [taskData.priority='medium'] - 任务优先级（low/medium/high）
     * @param {string} [taskData.due_date] - 截止日期（YYYY-MM-DD格式）
     * @returns {Promise<Object>} 创建的任务对象
     */
    static async create(taskData) {
        try {
            // 处理日期格式
            let formattedDueDate = null;
            if (taskData.due_date) {
                // 将日期字符串转换为 YYYY-MM-DD 格式
                const date = new Date(taskData.due_date);
                formattedDueDate = date.toISOString().split('T')[0];
            }

            const [result] = await pool.query(
                'INSERT INTO tasks (title, description, content, priority, due_date) VALUES (?, ?, ?, ?, ?)',
                [
                    taskData.title,
                    taskData.description,
                    taskData.content,
                    taskData.priority || 'medium',
                    formattedDueDate
                ]
            );
            return this.findById(result.insertId);
        } catch (error) {
            throw new Error(`创建任务失败: ${error.message}`);
        }
    }

    /**
     * 根据ID查找任务
     * @param {number} id - 任务ID
     * @returns {Promise<Object>} 任务对象
     */
    static async findById(id) {
        try {
            const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
            return rows[0] || null;
        } catch (error) {
            throw new Error(`查找任务失败: ${error.message}`);
        }
    }

    /**
     * 获取所有任务
     * @param {Object} [filters] - 过滤条件
     * @param {string} [filters.status] - 按状态过滤
     * @param {string} [filters.priority] - 按优先级过滤
     * @param {string} [filters.search] - 搜索标题和描述
     * @returns {Promise<Array>} 任务列表
     */
    static async findAll(filters = {}) {
        try {
            let query = 'SELECT * FROM tasks';
            const params = [];
            const conditions = [];

            if (filters.status) {
                conditions.push('status = ?');
                params.push(filters.status);
            }

            if (filters.priority) {
                conditions.push('priority = ?');
                params.push(filters.priority);
            }

            if (filters.search) {
                conditions.push('(title LIKE ? OR description LIKE ?)');
                params.push(`%${filters.search}%`, `%${filters.search}%`);
            }

            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }

            query += ' ORDER BY created_at DESC';

            const [rows] = await pool.query(query, params);
            return rows;
        } catch (error) {
            throw new Error(`获取任务列表失败: ${error.message}`);
        }
    }

    /**
     * 更新任务
     * @param {number} id - 任务ID
     * @param {Object} updateData - 更新的数据
     * @returns {Promise<Object>} 更新后的任务对象
     */
    static async update(id, updateData) {
        try {
            const allowedFields = ['title', 'description', 'content', 'status', 'priority', 'due_date'];
            const updates = [];
            const values = [];

            // 处理日期格式
            if (updateData.due_date) {
                const date = new Date(updateData.due_date);
                updateData.due_date = date.toISOString().split('T')[0];
            }

            for (const [key, value] of Object.entries(updateData)) {
                if (allowedFields.includes(key) && value !== undefined) {
                    updates.push(`${key} = ?`);
                    values.push(value);
                }
            }

            if (updates.length === 0) {
                throw new Error('没有提供有效的更新字段');
            }

            values.push(id);
            const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
            await pool.query(query, values);

            return this.findById(id);
        } catch (error) {
            throw new Error(`更新任务失败: ${error.message}`);
        }
    }

    /**
     * 删除任务
     * @param {number} id - 任务ID
     * @returns {Promise<boolean>} 是否删除成功
     */
    static async delete(id) {
        try {
            const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`删除任务失败: ${error.message}`);
        }
    }

    /**
     * 更新任务状态
     * @param {number} id - 任务ID
     * @param {string} status - 新状态
     * @returns {Promise<Object>} 更新后的任务对象
     */
    static async updateStatus(id, status) {
        try {
            const validStatuses = ['pending', 'in_progress', 'completed'];
            if (!validStatuses.includes(status)) {
                throw new Error('无效的状态值');
            }
            return this.update(id, { status });
        } catch (error) {
            throw new Error(`更新任务状态失败: ${error.message}`);
        }
    }

    /**
     * 获取待处理任务数量
     * @returns {Promise<Object>} 各状态的任务数量
     */
    static async getTasksCount() {
        try {
            const [rows] = await pool.query(
                'SELECT status, COUNT(*) as count FROM tasks GROUP BY status'
            );
            const result = {
                pending: 0,
                in_progress: 0,
                completed: 0
            };
            rows.forEach(row => {
                result[row.status] = row.count;
            });
            return result;
        } catch (error) {
            throw new Error(`获取任务统计失败: ${error.message}`);
        }
    }
}

module.exports = Task;