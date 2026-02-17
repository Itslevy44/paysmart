const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const projectController = require('../controllers/projectController');

// All project routes are protected
router.use(authorize);

router.post('/', projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.delete('/:id', projectController.deleteProject);

module.exports = router;
