import { useState } from "react";

const KanbanBoard = () => {
  const [columns, setColumns] = useState([]);
  const [draggedCard, setDraggedCard] = useState(null);

  const addColumn = () => {
    setColumns([...columns, { id: Date.now(), title: "New Column", cards: [] }]);
  };

  const addCard = (columnId, text) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, cards: [...col.cards, { id: Date.now(), text }] } : col
    ));
  };

  const removeCard = (columnId, cardId) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, cards: col.cards.filter(card => card.id !== cardId) } : col
    ));
  };

  const handleDragStart = (e, card, columnId) => {
    setDraggedCard({ ...card, columnId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (columnId) => {
    if (!draggedCard) return;
    
    setColumns(columns.map(col => {
      if (col.id === draggedCard.columnId) {
        return { ...col, cards: col.cards.filter(card => card.id !== draggedCard.id) };
      }
      if (col.id === columnId) {
        return { ...col, cards: [...col.cards, draggedCard] };
      }
      return col;
    }));

    setDraggedCard(null);
  };

  return (
    <div className="kanban-container">
      <button onClick={addColumn}>+ Add Column</button>
      <div className="kanban-board">
        {columns.map(column => (
          <div 
            key={column.id} 
            className="kanban-column" 
            onDragOver={handleDragOver} 
            onDrop={() => handleDrop(column.id)}
          >
            <input
              type="text"
              value={column.title}
              onChange={(e) => setColumns(columns.map(col => col.id === column.id ? { ...col, title: e.target.value } : col))}
            />
            <button onClick={() => addCard(column.id, prompt("Enter task:") || "")}>+ Add Card</button>
            <div className="kanban-cards">
              {column.cards.map(card => (
                <div 
                  key={card.id} 
                  className="kanban-card" 
                  draggable
                  onDragStart={(e) => handleDragStart(e, card, column.id)}
                >
                  {card.text}
                  <button onClick={() => removeCard(column.id, card.id)}>x</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div 
        className="trash-can" 
        onDragOver={handleDragOver} 
        onDrop={() => setDraggedCard(null)}
      >
        🗑️ Drag here to delete
      </div>
    </div>
  );
};

export default KanbanBoard;
