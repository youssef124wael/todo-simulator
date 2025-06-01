import React, { useState } from 'react';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [daysLeft, setDaysLeft] = useState('');
  const [items, setItems] = useState([]);

  // Helper to get numeric value for priority
  const getPriorityValue = (priorityStr) => {
    if (priorityStr === 'Easy') return 1;
    if (priorityStr === 'Medium') return 2;
    if (priorityStr === 'Hard') return 3;
    return 1; // default to Medium
  };

  // Add new item
  const handleAdd = () => {
    if (inputValue.trim() === '') return;

    const priorityValue = getPriorityValue(priority);
    const days = daysLeft ? parseInt(daysLeft, 10) : 0;
    const priority_score = priorityValue * 20 + days * -10;

    const newItem = {
      text: inputValue,
      priority, // keep as string for display
      daysLeft: days,
      priority_score,
    };

    setItems([...items, newItem]);
    setInputValue('');
    setPriority('Medium');
    setDaysLeft('');
  };

  // Remove item
  const handleRemove = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // Sort and send to AI
  const SendToAI = () => {
    // Recalculate scores in case daysLeft or priorities changed
    const scoredItems = items.map(item => {
      const priorityValue = getPriorityValue(item.priority);
      const days = item.daysLeft;
      return {
        ...item,
        priority_score: priorityValue * 20 + days * -10,
      };
    });

    // Sort by priority_score descending
    const sortedItems = [...scoredItems].sort((a, b) => b.priority_score - a.priority_score);

    setItems(sortedItems);

    fetch('http://localhost:3000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: sortedItems }),
    });
  };

  return (
    <div className="p-4">
      <div className="input-group">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Task name..."
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Hard">Hard</option>
          <option value="Medium">Medium</option>
          <option value="Easy">Easy</option>
        </select>

        <input
          type="number"
          value={daysLeft}
          onChange={(e) => setDaysLeft(e.target.value)}
          placeholder="Days left"
          min="0"
        />

        <button onClick={handleAdd}>Add</button>
      </div>
      <button onClick={SendToAI} className="arrange">Arrange</button>

      <ul className="task-list">
        {items.map((item, index) => (
          <li key={index} className="list-item">
            <span>
              <strong>{item.text}</strong> | Priority: {item.priority} | Days left: {item.daysLeft} | Score: {item.priority_score}
            </span>
            <button onClick={() => handleRemove(index)} className="remove-button">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;