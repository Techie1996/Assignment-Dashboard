import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TaskEditing = ({ onTaskUpdated, tasks }) => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  // Initializing selectedTask with default values
  // eslint-disable-next-line
  const [selectedTask, setSelectedTask] = useState(null);

  // Initializing editedTask with default values
  const [editedTask, setEditedTask] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  useEffect(() => {
    const taskToEdit = tasks.find((task) => task._id === taskId);

    if (taskToEdit) {
      setSelectedTask(taskToEdit);
      setEditedTask(taskToEdit); // Set editedTask initially
    } else {
      console.error(`Task with ID ${taskId} not found`);
    }
  }, [tasks, taskId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    if (!editedTask.title || !editedTask.description || !editedTask.dueDate) {
      toast.error('Please fill in all fields');
      return false;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    if (editedTask.dueDate < currentDate) {
      toast.error('Due date cannot be in the past');
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!isFormValid()) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedTask), // Using editedTask instead of updatedTask
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      onTaskUpdated(editedTask);
      toast.success('Task updated successfully');
      navigate('/');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  return (
    <div className="dashboard-component">
      <div className="top-bar">
        <h2>Edit Task</h2>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
        <div className="task-card">
          <form>
            <label>Title:</label>
            <input type="text" name="title" value={editedTask.title} onChange={handleInputChange} />

            <label>Description:</label>
            <textarea name="description" value={editedTask.description} onChange={handleInputChange}></textarea>

            <label>Due Date:</label>
            <input type="date" name="dueDate" value={editedTask.dueDate} onChange={handleInputChange} />
            <button type="button" className="create-task-btn" onClick={handleUpdate}>
              Update Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskEditing;
