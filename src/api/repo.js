import pg from 'pg';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const { Pool } = pg;

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'todo_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

// Get all tasks
export const getAllTasks = async () => {
  const query = 'SELECT * FROM task ORDER BY created_at DESC';
  const result = await pool.query(query);
  return result.rows;
};

// Get task by ID
export const getTaskById = async (id) => {
  const query = 'SELECT * FROM task WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Create a new task
export const createTask = async (title, description, status = 'pending') => {
  const query = 'INSERT INTO task (task_name, task_status) VALUES ($1, $2) RETURNING *';
  const result = await pool.query(query, [title, status]);
  return result.rows[0];
};

// Update a task
export const updateTask = async (id, title, description, status) => {
  const query = 'UPDATE task SET task_name = $1, task_status = $2, updated_at = NOW() WHERE id = $3 RETURNING *';
  const result = await pool.query(query, [title, status, id]);
  return result.rows[0];
};

// Delete a task
export const deleteTask = async (id) => {
  const query = 'DELETE FROM task WHERE id = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
