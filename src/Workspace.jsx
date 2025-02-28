import { useState } from "react";
import "./workspace.css";

const KanbanBoard = () => {
  const [columns, setColumns] = useState([]);
  const [draggedCard, setDraggedCard] = useState(null);

  const addColumn = () => {
    setColumns([...columns, { id: Date.now(), title: "New Column", cards: [] }]);
  };

  const removeColumn = (columnId) => {
    setColumns(columns.filter(col => col.id !== columnId));
  };

  const addCard = (columnId) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, cards: [...col.cards, { id: Date.now(), text: "", isEditing: true }] } : col
    ));
  };

  const updateCardText = (columnId, cardId, text) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { 
        ...col, 
        cards: col.cards.map(card => 
          card.id === cardId ? { ...card, text, isEditing: false } : card
        )
      } : col
    ));
  };

  const handleKeyDown = (e, columnId, cardId) => {
    if (e.key === "Enter") {
      updateCardText(columnId, cardId, e.target.value);
    } else if (e.key === "Escape") {
      setColumns(columns.map(col => 
        col.id === columnId ? { 
          ...col, 
          cards: col.cards.filter(card => card.id !== cardId)
        } : col
      ));
    }
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

  const handleTrashDrop = () => {
    if (!draggedCard) return;
    setColumns(columns.map(col => ({
      ...col,
      cards: col.cards.filter(card => card.id !== draggedCard.id)
    })));
    setDraggedCard(null);
  };

  return (
    <div className="kanban-container">
      <button className="add-column-btn" onClick={addColumn}>+ Add Column</button>
      <div className="kanban-board">
        {columns.map(column => (
          <div 
            key={column.id} 
            className="kanban-column" 
            onDragOver={handleDragOver} 
            onDrop={() => handleDrop(column.id)}
          >
            <div className="column-header">
              <input
                type="text"
                value={column.title}
                onChange={(e) => setColumns(columns.map(col => col.id === column.id ? { ...col, title: e.target.value } : col))}
              />
              <button className="remove-column-btn" onClick={() => removeColumn(column.id)}>×</button>
            </div>
            <button className="add-card-btn" onClick={() => addCard(column.id)}>+ Add Card</button>
            <div className="kanban-cards">
              {column.cards.map(card => (
                <div 
                  key={card.id} 
                  className="kanban-card" 
                  draggable
                  onDragStart={(e) => handleDragStart(e, card, column.id)}
                >
                  {card.isEditing ? (
                    <input
                      type="text"
                      placeholder="Enter task... (Press Enter to add, Esc to cancel)"
                      autoFocus
                      onKeyDown={(e) => handleKeyDown(e, column.id, card.id)}
                    />
                  ) : (
                    <span>{card.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div 
        className="trash-can" 
        onDragOver={handleDragOver} 
        onDrop={handleTrashDrop}
      >
        🗑️ Delete
      </div>
    </div>
  );
};

export default KanbanBoard;
