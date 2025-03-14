export const loadBoards = (setBoards, setActiveBoard, id) => {
  const savedBoards = JSON.parse(localStorage.getItem("boards")) || [];
  setBoards(savedBoards);

  if (id) {
    const active = savedBoards.find(d => d.id === parseInt(id));
    setActiveBoard(active);
  }
};

export const saveBoards = (boards) => {
  localStorage.setItem("boards", JSON.stringify(boards));
};

export const createBoard = (boards, setBoards, boardName, setBoardName, setModalOpen) => {
  const newBoard = { id: Date.now(), name: boardName };
  setBoards(prevBoards => {
    const updatedBoards = [newBoard, ...prevBoards];
    localStorage.setItem("boards", JSON.stringify(updatedBoards));
    return updatedBoards;
  });
  setBoardName("");
  setModalOpen(false);
};

export const selectBoard = (board, setActiveBoard, setEditingBoardId, navigate) => {
  setActiveBoard(board);
  setEditingBoardId(null);
  navigate(`/board/${board.id}`);
};

export const handleEditClick = (board, setEditingBoardId, setBoardName) => {
  setEditingBoardId(board.id);
  setBoardName(board.name);
};

export const handleNameChange = (e, setBoardName) => {
  setBoardName(e.target.value);
};

export const handleNameSave = (board, boards, setBoards, boardName, setEditingBoardId) => {
  setBoards(boards.map(d => d.id === board.id ? { ...d, name: boardName } : d));
  setEditingBoardId(null);
};