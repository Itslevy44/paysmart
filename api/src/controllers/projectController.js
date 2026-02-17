const pool = require('../config/db');

// Create a new project
exports.createProject = async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name) {
        return res.status(400).json({ message: 'Project name is required' });
    }

    try {
        const newProject = await pool.query(
            'INSERT INTO projects (user_id, name, description) VALUES ($1, $2, $3) RETURNING *',
            [userId, name, description]
        );
        res.status(201).json(newProject.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get all projects for a user
exports.getProjects = async (req, res) => {
    const userId = req.user.id;
    try {
        const projects = await pool.query(
            'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(projects.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get a single project
exports.getProjectById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const project = await pool.query(
            'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (project.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(project.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Delete a project
exports.deleteProject = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const deleteProject = await pool.query(
            'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        if (deleteProject.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
