import { useState } from "react";
import "./workspace.css";

const Workspace = () => {
  const [columns, setColumns] = useState([]);
  const [draggedCard, setDraggedCard] = useState(null);
  const [members, setMembers] = useState(["Alice", "Bob", "Charlie"]);
  const [newMember, setNewMember] = useState("");

  const addMember = () => {
    if (newMember.trim() && !members.includes(newMember)) {
      setMembers([...members, newMember]);
      setNewMember("");
    }
  };

  const removeMember = (name) => {
    setMembers(members.filter(member => member !== name));
  };


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
    const debounce = (func, delay) => {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
      };
    };

    const debouncedUpdate = debounce(() => {
      setColumns(columns.map(col => 
        col.id === columnId ? { 
          ...col, 
          cards: col.cards.map(card => 
            card.id === cardId ? { ...card, text, isEditing: false } : card
          )
        } : col
      ));
    }, 300);

    debouncedUpdate();
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
    <div className="workspace">
      <div className="sidebar-container">
        <h2 className="sidebar-title">Project Sidebar</h2>
        <nav className="sidebar-nav">
          <button className="sidebar-item">
            <span className="sidebar-icon">📊</span> Dashboard
          </button>
          <button className="sidebar-item">
            <span className="sidebar-icon">📋</span> Board List
          </button>
          <button className="sidebar-item">
            <span className="sidebar-icon">👥</span> Member List
          </button>
          <button className="sidebar-item">
            <span className="sidebar-icon">📁</span> Uploads
          </button>
          <button className="sidebar-item">
            <span className="sidebar-icon">➕</span> Create New Board
          </button>
        </nav>
        <div className="member-management">
          <h3 className="member-title">Manage Members</h3>
          <div className="member-input-container">
            <input
              type="text"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              placeholder="Enter member name"
              className="member-input"
            />
            <button onClick={addMember} className="add-member-btn">➕</button>
          </div>
          <ul className="member-list">
            {members.map((member) => (
              <li key={member} className="member-item">
                {member}
                <button onClick={() => removeMember(member)} className="remove-member-btn">🗑</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

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
    </div>
  );
};

export default Workspace;
