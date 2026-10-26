require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'college_events'
});
db.connect((err) => {
    if (err) {
        console.log('MySQL connection failed:', err.message);
        return;
    }
    console.log('Connected to MySQL successfully!');
});

app.get('/', (req, res) => {
    res.send('College Event Management API is running!');
});

app.get('/events', (req, res) => {
    db.query('SELECT * FROM events ORDER BY event_date', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/events', (req, res) => {
    const { title, description, event_date, venue } = req.body;
    db.query(
        'INSERT INTO events (title, description, event_date, venue) VALUES (?, ?, ?, ?)',
        [title, description, event_date, venue],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Event added successfully!', id: result.insertId });
        }
    );
});

app.put('/events/:id', (req, res) => {
    const { title, description, event_date, venue } = req.body;
    db.query(
        'UPDATE events SET title=?, description=?, event_date=?, venue=? WHERE id=?',
        [title, description, event_date, venue, req.params.id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Event updated successfully!', affectedRows: result.affectedRows });
        }
    );
});

app.delete('/events/:id', (req, res) => {
    db.query('DELETE FROM events WHERE id=?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Event deleted successfully!', affectedRows: result.affectedRows });
    });
});

app.get('/registrations', (req, res) => {
    db.query(
        `SELECT r.id, r.student_name, r.email, e.title AS event_title, r.registered_at
         FROM registrations r JOIN events e ON r.event_id=e.id
         ORDER BY r.registered_at DESC`,
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

app.post('/registrations', (req, res) => {
    const { student_name, email, event_id } = req.body;
    db.query(
        'INSERT INTO registrations (student_name, email, event_id) VALUES (?, ?, ?)',
        [student_name, email, event_id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Registration successful!', id: result.insertId });
        }
    );
});

app.listen(5000, () => {
    console.log('Server running at http://localhost:5000');
});
