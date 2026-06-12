const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Cấu hình Pool kết nối database
const isLocal = !process.env.DATABASE_URL || 
               process.env.DATABASE_URL.includes('localhost') || 
               process.env.DATABASE_URL.includes('127.0.0.1') ||
               process.env.DATABASE_URL.includes('db');

const poolConfig = process.env.DATABASE_URL 
   ? { 
      connectionString: process.env.DATABASE_URL,
      ssl: isLocal ? false : { rejectUnauthorized: false } 
   }
   : {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'tododb',
      password: process.env.DB_PASSWORD || 'password',
      port: process.env.DB_PORT || 5432,
   };

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
   console.error('Unexpected error on idle client', err);
});

app.get('/health', (req, res) => {
   res.json({ status: 'healthy', version: '1.0.0' });
});

// GET todos
app.get('/api/todos', async (req, res) => {
   try {
      const result = await pool.query('SELECT * FROM todos ORDER BY id');
      res.json(result.rows);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// POST todos
app.post('/api/todos', async (req, res) => {
   try {
      const { title, completed = false } = req.body;

      // // FIX BUG #2: Kiểm tra title rỗng, trả về mã 400
      // if (!title || title.trim() === '') {
      //    return res.status(400).json({ error: 'Title is required' });
      // }

      const result = await pool.query(
         'INSERT INTO todos(title, completed) VALUES($1, $2) RETURNING *',
         [title, completed]
      );
      res.status(201).json(result.rows[0]);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// FIX BUG #3: Bổ sung endpoint DELETE
app.delete('/api/todos/:id', async (req, res) => {
   try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
         return res.status(404).json({ error: 'Todo not found' });
      }
      res.status(200).json({ message: 'Todo deleted successfully' });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// FIX BUG #4: Bổ sung endpoint PUT
app.put('/api/todos/:id', async (req, res) => {
   try {
      const { id } = req.params;
      const { title, completed } = req.body;

      if (!title || title.trim() === '') {
         return res.status(400).json({ error: 'Title is required' });
      }

      const result = await pool.query(
         'UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING *',
         [title, completed, id]
      );

      if (result.rows.length === 0) {
         return res.status(404).json({ error: 'Todo not found' });
      }
      res.status(200).json(result.rows[0]);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

const port = process.env.PORT || 8080;

// FIX BUG #5: Ngăn server chiếm port khi chạy test
if (process.env.NODE_ENV !== 'test') {
   app.listen(port, () => {
      console.log(`Backend running on port ${port}`);
   });
}

// FIX BUG #6: Export app để sử dụng trong các file test
module.exports = app;