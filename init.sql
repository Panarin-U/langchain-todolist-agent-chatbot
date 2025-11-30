-- Create task table
CREATE TABLE IF NOT EXISTS task (
    id SERIAL PRIMARY KEY,
    task_name VARCHAR(255) NOT NULL,
    task_status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on task_status for better query performance
CREATE INDEX IF NOT EXISTS idx_task_status ON task(task_status);

-- Insert sample data (optional)
INSERT INTO task (task_name, task_status) VALUES
('Complete project documentation', 'todo'),
('Review pull requests', 'in_progress'),
('Deploy to production', 'completed');
