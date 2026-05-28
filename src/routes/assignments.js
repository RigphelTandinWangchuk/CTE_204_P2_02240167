const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

// HTTP Endpoints routing map
router.get('/', assignmentController.getAllAssignments);
router.post('/', assignmentController.createAssignment);
router.patch('/:id/toggle', assignmentController.toggleAssignment);
router.delete('/:id', assignmentController.deleteAssignment);

module.exports = router;