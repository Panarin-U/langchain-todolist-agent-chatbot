import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const apiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:3001'
        : `http://${window.location.hostname}:3001`;
      const response = await fetch(`${apiUrl}/api/listAllTask`);
      const result = await response.json();

      if (result.success) {
        setTasks(result.data);
      } else {
        setError('Failed to fetch tasks');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.container}>Error: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Todo List</h1>
      <button onClick={fetchTasks} style={styles.refreshButton}>
        Refresh
      </button>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Task Name</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Created At</th>
            <th style={styles.th}>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.td}>No tasks found</td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task.id}>
                <td style={styles.td}>{task.id}</td>
                <td style={styles.td}>{task.task_name}</td>
                <td style={styles.td}>
                  <span style={getStatusStyle(task.task_status)}>
                    {task.task_status}
                  </span>
                </td>
                <td style={styles.td}>
                  {new Date(task.created_at).toLocaleString()}
                </td>
                <td style={styles.td}>
                  {new Date(task.updated_at).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div style={styles.footer}>Total: {tasks.length} tasks</div>
    </div>
  );
}

function getStatusStyle(status) {
  const baseStyle = {
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: 'bold'
  };

  console.log(status)

  if (status == 'completed') {
    return { ...baseStyle, backgroundColor: '#d4edda', color: '#155724' };
  } else if (status == 'in_progress') {
    return { ...baseStyle, backgroundColor: '#fff3cd', color: '#856404' };
  } else if (status == 'todo') {
    return { ...baseStyle, backgroundColor: '#cfe2ff', color: '#084298' };
  } else {
    return { ...baseStyle, backgroundColor: '#f8d7da', color: '#721c24' };
  }
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px'
  },
  refreshButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '14px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  th: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold'
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
    textAlign: 'left'
  },
  footer: {
    marginTop: '20px',
    textAlign: 'right',
    fontWeight: 'bold',
    color: '#666'
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<TaskList />);
