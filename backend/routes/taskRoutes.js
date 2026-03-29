const express = require('express');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getAllTasks,
  deleteAnyTask,
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Admin specific routes
router.route('/all')
  .get(authorize('admin'), getAllTasks);

router.route('/all/:id')
  .delete(authorize('admin'), deleteAnyTask);

// User task routes
router.route('/')
  .get(getTasks)
  .post(
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('deadline', 'Deadline is required').not().isEmpty(),
    ],
    createTask
  );

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
