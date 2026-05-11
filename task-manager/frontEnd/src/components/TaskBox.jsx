import React, { useState } from "react";
import "./TaskBox.css";
import taskService from '../services/tasks'

const TaskBox = ({ tasks, user, fetchData }) => {
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [confirmation, setConfirmation] = useState(false);

  const addTask = async () => {
    if (newTaskText.trim() === "") return;
    const newTask = {
      id: tasks.length + 1,
      text: newTaskText,
      done: false,
      description: newTaskDescription,
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
      user: user.id
    };

    console.log(newTask.id)

    await taskService.create(newTask)

    fetchData()

    setNewTaskText("");
    setNewTaskDescription("");
    setNewTaskDueDate("");
    setNewTaskPriority("Medium");

    setConfirmation(true);
    setTimeout(() => setConfirmation(false), 2000);
  };

  return (
    <div className="task-box">
      <h2>Add New Task</h2>

      {confirmation && (
        <p className="confirmation">✅ Task added successfully!</p>
      )}

      <input
        type="text"
        value={newTaskText}
        onChange={(e) => setNewTaskText(e.target.value)}
        placeholder="Enter a new task"
      />
      <input
        type="text"
        value={newTaskDescription}
        onChange={(e) => setNewTaskDescription(e.target.value)}
        placeholder="Task description"
      />
      <input
        type="date"
        value={newTaskDueDate}
        onChange={(e) => setNewTaskDueDate(e.target.value)}
      />
      <select
        value={newTaskPriority}
        onChange={(e) => setNewTaskPriority(e.target.value)}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button onClick={addTask}>Add Task</button>
    </div>
  );
};

export default TaskBox;