const http = require('http');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const port = 5000;

const db = mysql.createConnection({
  host: 'localhost', // 데이터베이스 호스트
  user: 'root', // MySQL 사용자
  password: '', // MySQL 비밀번호
  database: 'tododb' // 사용할 데이터베이스 이름
});
db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});


app.get('/api/todo', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(results);
    }
  });
});

app.post('/api/todo', (req, res) => {
  const { title } = req.body;
  db.query('INSERT INTO todos (title) VALUES (?)', [title], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json({ no: result.insertId, title, done: false });
    }
  });
});
app.put('/api/todo/:no', (req, res) => {
  const { no } = req.params;
  const { done } = req.body;
  const {title} = req.body;
  db.query('UPDATE todos SET done = ?, title = ? WHERE no = ?', [done, title,no], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json({ no, title,done });
    }
  });
});

app.delete('/api/todo/:no', (req, res) => {
  const { no } = req.params;
  db.query('DELETE FROM todos WHERE no = ?', [no], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json({ message: 'Todo deleted' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
