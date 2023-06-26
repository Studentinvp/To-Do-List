import React, { useState } from 'react';
import './TodoItem.css';

const TodoItem = ({ todo, removeTodo, editTodo, formatDateTime, handleReminder }) => {
  const [editing, setEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(todo.task);
  const [editedDateTime, setEditedDateTime] = useState(todo.dateTime);

  const handleEdit = () => {
    if (editing) {
      editTodo(todo.id, editedTask, editedDateTime);
      handleReminder(todo.id); // Pass the ID of the to-do item being edited
    }
    setEditing(!editing);
  };

  return (
    <li className="todo-item">
      {editing ? (
        <>
          <input
            className="edit-input"
            type="text"
            value={editedTask}
            onChange={(e) => setEditedTask(e.target.value)}
          />
          <input
            className="edit-datetime"
            type="datetime-local"
            value={editedDateTime}
            onChange={(e) => setEditedDateTime(e.target.value)}
          />
        </>
      ) : (
        <>
          <span>{todo.task}</span>
          <span>{formatDateTime(todo.dateTime)}</span>
        </>
      )}
      <div>
        {editing ? (
          <button className="save-button" onClick={handleEdit}>Save</button>
        ) : (
          <>
            <button className="edit-button" onClick={handleEdit}>Edit</button>
            <button className="remove-button" onClick={() => removeTodo(todo.id)}>Remove</button>
          </>
        )}
      </div>
    </li>
  );
};

export default TodoItem;
