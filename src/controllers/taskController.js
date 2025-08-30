const Task = require('../models/Task');

/**
 * 任务控制器
 */
const taskController = {
    /**
     * 创建新任务
     * @param {Object} req - 请求对象
     * @param {Object} res - 响应对象
     */
    async createTask(req, res) {
        try {
            const { title, description, content, priority, due_date } = req.body;

            // 验证必填字段
            if (!title) {
                return res.status(400).json({
                    status: 'error',
                    message: '任务标题不能为空'
                });
            }

            const task = await Task.create({
                title,
                description,
                content,    // 添加 content 字段
                priority,
                due_date
            });

            res.status(201).json({
                status: 'success',
                data: task
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    /**
     * 获取所有任务
     * @param {Object} req - 请求对象
     * @param {Object} res - 响应对象
     */
    async getAllTasks(req, res) {
        try {
            const { status, priority, search } = req.query;
            const tasks = await Task.findAll({ status, priority, search });

            res.json({
                status: 'success',
                data: tasks
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    /**
     * 获取单个任务
     * @param {Object} req - 请求对象
     * @param {Object} res - 响应对象
     */
    async getTaskById(req, res) {
        try {
            const { id } = req.params;
            const task = await Task.findById(parseInt(id));

            if (!task) {
                return res.status(404).json({
                    status: 'error',
                    message: '任务不存在'
                });
            }

            res.json({
                status: 'success',
                data: task
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    /**
     * 更新任务
     * @param {Object} req - 请求对象
     * @param {Object} res - 响应对象
     */
    async updateTask(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // 验证任务是否存在
            const existingTask = await Task.findById(parseInt(id));
            if (!existingTask) {
                return res.status(404).json({
                    status: 'error',
                    message: '任务不存在'
                });
            }

            const updatedTask = await Task.update(parseInt(id), updateData);

            res.json({
                status: 'success',
                data: updatedTask
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    /**
     * 删除任务
     * @param {Object} req - 请求对象
     * @param {Object} res - 响应对象
     */
    async deleteTask(req, res) {
        try {
            const { id } = req.params;

            // 验证任务是否存在
            const existingTask = await Task.findById(parseInt(id));
            if (!existingTask) {
                return res.status(404).json({
                    status: 'error',
                    message: '任务不存在'
                });
            }

            await Task.delete(parseInt(id));

            res.json({
                status: 'success',
                message: '任务已删除'
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    /**
     * 更新任务状态
     * @param {Object} req - 请求对象
     * @param {Object} res - 响应对象
     */
    async updateTaskStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({
                    status: 'error',
                    message: '状态不能为空'
                });
            }

            // 验证任务是否存在
            const existingTask = await Task.findById(parseInt(id));
            if (!existingTask) {
                return res.status(404).json({
                    status: 'error',
                    message: '任务不存在'
                });
            }

            const updatedTask = await Task.updateStatus(parseInt(id), status);

            res.json({
                status: 'success',
                data: updatedTask
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    /**
     * 获取任务统计信息
     * @param {Object} req - 请求对象
     * @param {Object} res - 响应对象
     */
    async getTasksStats(req, res) {
        try {
            const stats = await Task.getTasksCount();

            res.json({
                status: 'success',
                data: stats
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
};

module.exports = taskController;