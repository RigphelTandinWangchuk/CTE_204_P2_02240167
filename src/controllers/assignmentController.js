const db = require('../models/db');

// Get all assignments sorted by completion status and due date
exports.getAllAssignments = (req, res, next) => {
  try {
    const stmt = db.prepare('SELECT * FROM assignments ORDER BY completed ASC, dueDate ASC');
    const assignments = stmt.all();
    
    // Map SQLite boolean integer values (0/1) back to boolean flags
    const formattedAssignments = assignments.map(a => ({
      ...a,
      completed: !!a.completed
    }));
    
    res.json(formattedAssignments);
  } catch (error) {
    next(error);
  }
};

// Create a new assignment row
exports.createAssignment = (req, res, next) => {
  try {
    const { moduleName, title, dueDate, priority } = req.body;
    
    if (!moduleName || !title || !dueDate || !priority) {
      return res.status(400).json({ error: 'All assignment fields are required.' });
    }

    const stmt = db.prepare(`
      INSERT INTO assignments (moduleName, title, dueDate, priority, completed)
      VALUES (?, ?, ?, ?, 0)
    `);
    
    const info = stmt.run(moduleName.trim(), title.trim(), dueDate, priority);
    
    res.status(201).json({
      id: info.lastInsertRowid,
      moduleName,
      title,
      dueDate,
      priority,
      completed: false
    });
  } catch (error) {
    next(error);
  }
};

// Toggle assignment completion status
exports.toggleAssignment = (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if the entry exists
    const assignment = db.prepare('SELECT completed FROM assignments WHERE id = ?').get(id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment row not found.' });
    }

    // Toggle logic
    const newStatus = assignment.completed === 1 ? 0 : 1;
    db.prepare('UPDATE assignments SET completed = ? WHERE id = ?').run(newStatus, id);

    res.json({ message: 'Assignment status toggled successfully.', completed: !!newStatus });
  } catch (error) {
    next(error);
  }
};

// Remove assignment record
exports.deleteAssignment = (req, res, next) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM assignments WHERE id = ?').run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Assignment row not found.' });
    }

    res.json({ message: 'Assignment row purged from database.' });
  } catch (error) {
    next(error);
  }
};