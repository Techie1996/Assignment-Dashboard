import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TaskListing = ({ tasks, setTasks, onNewTask, onTaskCreated, onTaskDeleted, onTaskStatusChanged }) => {
  console.log('Rendering TaskListing component');

  useEffect(() => {
    fetch('http://localhost:5000/tasks')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched tasks:', data);
        setTasks(data);
      })
      .catch((error) => console.error('Error fetching tasks:', error));
  }, [setTasks]); // Including setTasks in the dependency array

  useEffect(() => {
    console.log('Tasks updated:', tasks);
  }, [tasks]); 

  const navigate = useNavigate();

  const handleEdit = (taskId) => {
    console.log(`Editing task with ID ${taskId}`);
    // Editing page using React Router
    navigate(`/taskEditing/${taskId}`);
  };

  const handleNewTask = () => {
    navigate('/taskCreation');
  };

const handleDelete = async (taskId) => {
  try {
    const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    onTaskDeleted(tasks.filter((task) => task._id !== taskId));
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};


  const handleToggleStatus = (taskId) => {
    // Calling the function to toggle the status
    onTaskStatusChanged(taskId);
  };

  return (
    <div className="dashboard-component">
      <div className="top-bar">
        <h2>Task Listing</h2>
        <button onClick={handleNewTask} className="create-task-btn">
          Create New Task
        </button>
      </div>
      <div className="task-list">
        {tasks.map((task) => (
          <div key={task._id} className={`task-card ${task.status ? task.status.toLowerCase().replace(" ", "") : ''}`}>
            <div className="task-details">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>
                <strong>Due Date:</strong> {task.dueDate}
              </p>
            </div>
            <div className="task-actions">
              <button className='create-task-btns' onClick={() => handleEdit(task._id)}>
                Edit  
              </button>
              <button className='create-task-btns' onClick={() => handleDelete(task._id)}>
                Delete
              </button>
              <h3>Status</h3>
              <label>:</label>
              <div className={`status-indicator ${task.status ? task.status.toLowerCase().replace(" ", "") : ''}`} onClick={() => handleToggleStatus(task._id)}></div>
              {console.log('Rendering task:', task)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskListing;
