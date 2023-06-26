// TodoList.js
import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import ReminderPopup from './ReminderPopup';
import './TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [showReminder, setShowReminder] = useState([]);
  const [reminderText, setReminderText] = useState('');
  const [reminderDateTime, setReminderDateTime] = useState('');
  const [snoozeInterval, setSnoozeInterval] = useState(null);
  const [currentReminderId, setCurrentReminderId] = useState(null);


  // Load todos from local Storage on initial render
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (task.trim() !== '' && dateTime !== '') {
      const newTodo = {
        id: Math.random().toString(),
        task: task,
        dateTime: dateTime,
      };

      setTodos([...todos, newTodo]);
      setTask('');
      setDateTime('');
      handleReminder(newTodo); // Call handleReminder with the new todo
    }
  };

  const removeTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const editTodo = (id, newTask, newDateTime) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          task: newTask,
          dateTime: newDateTime,
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const handleReminder = (todo) => {
    const reminderDateTime = new Date(todo.dateTime);
    const now = new Date();
  
    if (reminderDateTime > now) {
      const timeUntilReminder = reminderDateTime - now - 60000;
      const reminder = {
        id: todo.id,
        text: todo.task,
        dateTime: todo.dateTime,
      };
  
      setTimeout(() => {
        setShowReminder((prevReminders) => [...prevReminders, reminder]);
      }, timeUntilReminder);
    }
  };
  

  const snoozeReminder = (id) => {
    setShowReminder((prevReminders) =>
      prevReminders.filter((reminder) => reminder.id !== id)
    );
    clearInterval(snoozeInterval);
    const interval = setInterval(() => {
      setShowReminder((prevReminders) =>
        prevReminders.filter((reminder) => reminder.id !== id)
      );
    }, 300000); // Show reminder every 30 seconds
    setSnoozeInterval(interval);
  };
  
  

  const closeReminder = () => {
    setShowReminder(false);
    clearInterval(snoozeInterval);
    setSnoozeInterval(null);
  };

  useEffect(() => {
    todos.forEach((todo) => {
      handleReminder(todo); // Call handleReminder for each existing todo
    });
  }, [todos]);

  const formatDateTime = (dateTimeString) => {
    const dateTimeObject = new Date(dateTimeString);
    const options = {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return dateTimeObject.toLocaleString('en-US', options);
  };

  return (
    <div className="todo-list-container">
      <h1>To Do List</h1>
      <div className="input-container">
        <input
          className="task-input"
          type="text"
          placeholder="Enter a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <input
          className="datetime-input"
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />
        <button className="add-button" onClick={addTodo}>
          Add
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          editTodo={editTodo}
          formatDateTime={formatDateTime}
          handleReminder={() => handleReminder(todo.id)} // Pass the ID of the to-do item
        />
        
        ))}
      </ul>
      {showReminder.map((reminder) => (
  <ReminderPopup
    key={reminder.id}
    reminderText={reminder.text}
    snoozeReminder={() => snoozeReminder(reminder.id)}
    closeReminder={() => closeReminder(reminder.id)}
    reminderDateTime={reminder.dateTime}
  />
))}


    </div>
  );
};

export default TodoList;

