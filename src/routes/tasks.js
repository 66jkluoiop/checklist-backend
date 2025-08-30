const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: 获取所有任务
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: 按状态过滤（pending/in_progress/completed）
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *         description: 按优先级过滤（low/medium/high）
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索标题和描述
 */
router.get('/', taskController.getAllTasks);

/**
 * @swagger
 * /api/tasks/stats:
 *   get:
 *     summary: 获取任务统计信息
 */
router.get('/stats', taskController.getTasksStats);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: 创建新任务
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 description: 任务标题
 *               description:
 *                 type: string
 *                 description: 任务简短描述
 *               content:
 *                 type: string
 *                 description: 任务详细内容（支持富文本格式）
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 description: 任务优先级
 *               due_date:
 *                 type: string
 *                 format: date
 *                 description: 截止日期（YYYY-MM-DD）
 */
router.post('/', taskController.createTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: 获取单个任务
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get('/:id', taskController.getTaskById);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: 更新任务信息（支持更新所有字段）
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 任务标题
 *               description:
 *                 type: string
 *                 description: 任务简短描述
 *               content:
 *                 type: string
 *                 description: 任务详细内容（支持富文本格式）
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 description: 任务优先级
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *                 description: 任务状态
 *               due_date:
 *                 type: string
 *                 format: date
 *                 description: 截止日期（YYYY-MM-DD）
 */
router.put('/:id', taskController.updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: 删除任务
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.delete('/:id', taskController.deleteTask);

/**
 * @swagger
 * /api/tasks/{id}/status:
 *   patch:
 *     summary: 快速更新任务状态
 *     description: 仅更新任务状态的简化接口
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *                 description: 新的任务状态
 */
router.patch('/:id/status', taskController.updateTaskStatus);

module.exports = router;