"use client";
import styles from "./page.module.css";
import { useState } from "react";

// Modern arrow function component for TodoApp
const TodoApp = () => {
  const [todos, setTodos] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");

  const addTodo = () => {
    if (!inputValue.trim()) return;
    setTodos([...todos, inputValue.trim()]);
    setInputValue("");
  };

  const removeTodo = (index: number) => setTodos(todos.filter((_, i) => i !== index));

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setInputValue(todos[index]);
  };

  const saveEdit = (index: number) => {
    const updated = [...todos];
    updated[index] = inputValue;
    setTodos(updated);
    setEditingIndex(null);
    setInputValue("");
  };

  return (
    <div className={styles.todoContainer}>
      <h2>Todo List</h2>
      <input
        value={editingIndex === null ? inputValue : ""}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a new todo..."
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>
            {editingIndex === i ? (
              <input
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={() => saveEdit(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit(i);
                }}
              />
            ) : (
              <span onClick={() => startEditing(i)}>{todo}</span>
            )}
            <button onClick={() => removeTodo(i)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Modern arrow function component for Page
const Page = () => (
  <div className={styles.page}>
    <main className={styles.main}>
      <TodoApp />
    </main>
  </div>
);

export default Page;
