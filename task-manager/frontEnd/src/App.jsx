// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import AddTask from './pages/AddTask';
import Header from './components/Header';
import './App.css';
import taskService from './services/tasks'
import LoginSignup from "./components/LoginSignup";
import { Navigate } from "react-router-dom";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [user, setUser] = useState(null);


  const fetchData = async () => {
      if (user) {
        const loadedTasks = await taskService.getAll()
        const returnedTasks = loadedTasks.filter(task => task.user == user.id)
        const updatedTasks = returnedTasks.map(task => ({
          ...task,
          dueDate: task.dueDate ? task.dueDate.slice(0, 10) : task.dueDate
        }))
        setTasks(updatedTasks)
      }
    }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedTaskappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      taskService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    fetchData()
  },[user])

  const deleteTask = async (id) => {
    await taskService.deleteTask(id)
    setTasks(tasks.filter(task => task.id !== id))
  }

  const toggleDone = async (id) => {
    const taskToEdit = tasks.find(task => task.id === id)
    const updatedTask = {...taskToEdit, done: !taskToEdit.done}
    try {
      const savedTask = await taskService.changeTask(id, updatedTask);
      setTasks(tasks.map(task => task.id === id ? savedTask : task));
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  }

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditedText(task.text);
  };
  const saveEditedTask = async (id) => {
    const taskToEdit = tasks.find(task => task.id === id)
    const updatedTask = {...taskToEdit, text:editedText}
    try {
      const savedTask = await taskService.changeTask(id, updatedTask);
      setTasks(tasks.map(task => task.id === id ? savedTask : task));
      setEditingTaskId(null);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  return (
    <Router>
      <Header user={user} setUser={setUser} />
      <Routes>
        {!user ? (
          <>
            <Route path="*" element={<LoginSignup setUser={setUser} />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route
              path="/tasks"
              element={
                <Tasks
                  tasks={tasks}
                  setTasks={setTasks}
                  toggleDone={toggleDone}
                  deleteTask={deleteTask}
                  startEditing={startEditing}
                  editingTaskId={editingTaskId}
                  editedText={editedText}
                  setEditedText={setEditedText}
                  saveEditedTask={saveEditedTask}
                />
              }
            />
            <Route
              path="/add-task"
              element={
                <AddTask
                  tasks={tasks}
                  setTasks={setTasks}
                  newTaskText={newTaskText}
                  setNewTaskText={setNewTaskText}
                  newTaskDescription={newTaskDescription}
                  setNewTaskDescription={setNewTaskDescription}
                  newTaskDueDate={newTaskDueDate}
                  setNewTaskDueDate={setNewTaskDueDate}
                  newTaskPriority={newTaskPriority}
                  setNewTaskPriority={setNewTaskPriority}
                  user={user}
                  fetchData={fetchData}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
