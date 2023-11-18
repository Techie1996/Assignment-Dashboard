require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Task = require('./models/Task');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://govindayadav962:Starboy2233@cluster0.opjds7q.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// API endpoints
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();

    // Fetches the newly created task from the database (including the ID)
    const createdTask = await Task.findById(newTask._id);

    res.json(createdTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/tasks/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  const updatedTaskData = req.body; 

  try {
    // Using MongoDB's update method to update the task in the database
    const result = await TaskModel.updateOne({ _id: taskId }, { $set: updatedTaskData });

    if (result.nModified === 1) {
      res.status(200).json({ message: 'Task updated successfully' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.delete('/tasks/:taskId', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});






