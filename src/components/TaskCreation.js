import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import { v4 as uuidv4 } from 'uuid';

const TaskCreation = ({ onTaskCreated }) => {
  const navigate = useNavigate();

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

//----------------///

  // Inside TaskCreation component


//----------------///

  // Dummy data for demonstration
  //const [tasks, setTasks] = useState([
  //  { id: 1, title: 'Task 1', description: 'Description 1', dueDate: '2023-12-01', status: 'Completed' },
    // Add more tasks as needed
  //]);

  // Function to handle input changes in the form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  // Function to handle task creation
 const handleCreateTask = async () => {
  // Adding validation logic
  if (newTask.title.trim() === '' || newTask.description.trim() === '') {
    // Shows an error toast notification for empty title or description
    toast.error('Title and description cannot be empty!', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
    });
    return;
  }

  if (!newTask.dueDate) {
    // Shows an error toast notification for a missing due date
    toast.error('Please provide a due date for the task!', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
    });
    return;
  }

  const currentDate = new Date();
  const dueDate = new Date(newTask.dueDate + 'T23:59:59');
  // Setting the time to the end of the day

  if (dueDate < currentDate) {
    // Shows an error toast notification for a past due date
    toast.error('Due date cannot be in the past!', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
    });
    return;
  }

  try {
    // Make a POST request to your server endpoint
    const response = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });

    if (!response.ok) {
      throw new Error('Error creating task');
    }

    const createdTask = await response.json();

    // Calls the function from App to update tasks list
    onTaskCreated(createdTask);

    // Resets form
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
    });

    // Shows success toast notification
    toast.success('Task created successfully!', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
    });

    // Navigates to Task Listing after creating the task
    navigate('/');
  } catch (error) {
    console.error('Error creating task:', error);

    // Shows an error toast notification
    toast.error('Error creating task. Please try again.', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
    });
  }
};



  return (
    <div className="dashboard-component">
      <div className='top-bar'>
        <h2>Create New Task</h2>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignContent: "center" }}>
        <div className='task-card' >
          <form>
            <label>Title:</label>
            <input type="text" name="title" value={newTask.title} onChange={handleInputChange} />

            <label>Description:</label>
            <textarea name="description" value={newTask.description} onChange={handleInputChange}></textarea>

            <label>Due Date:</label>
            <input type="date" name="dueDate" value={newTask.dueDate} onChange={handleInputChange} />

            <button type="button" className='create-task-btn' onClick={handleCreateTask}>Create Task</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskCreation;
