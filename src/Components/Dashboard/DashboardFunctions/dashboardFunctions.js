const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Base URL for the API

const getAuthToken = () => {
  return localStorage.getItem('token'); // Adjust this based on where you store your token
};

const authFetch = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Network response was not ok: ${errorText}`);
  }
  return response.json();
};

export const loadBoards = async (workspaceId, setBoards, setActiveBoard, id) => {
  try {
    const savedBoards = await authFetch(`${API_BASE_URL}/api/boards/${workspaceId}/boards`);
    if (Array.isArray(savedBoards)) {
      setBoards(savedBoards);
      if (id) {
        const active = savedBoards.find(d => d.id === parseInt(id));
        setActiveBoard(active);
      }
    } else {
      console.error("Failed to load boards: response is not an array");
    }
  } catch (error) {
    console.error("Failed to load boards:", error);
  }
};

export const createBoard = async (workspaceId, boards, setBoards, boardName, setBoardName, setModalOpen) => {
  try {
    if (!workspaceId) {
      throw new Error('Workspace ID is required');
    }

    console.log(`Sending request to create board in workspace ${workspaceId} with name ${boardName}`);
    const newBoard = await authFetch(`${API_BASE_URL}/api/boards/${workspaceId}/boards`, {
      method: 'POST',
      body: JSON.stringify({ name: boardName }),
    });

    console.log('Board created successfully:', newBoard);
    setBoards([...boards, newBoard]);
    setBoardName('');
    setModalOpen(false);
  } catch (error) {
    console.error('Failed to create board:', error);
    alert('Failed to create board: ' + error.message);
  }
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

export const handleNameSave = async (workspaceId, board, boards, setBoards, boardName, setEditingBoardId) => {
  try {
    await authFetch(`${API_BASE_URL}/api/boards/${workspaceId}/boards/${board.id}`, {
      method: 'PUT',
      body: JSON.stringify({ name: boardName })
    });

    setBoards(boards.map(d => d.id === board.id ? { ...d, name: boardName } : d));
    setEditingBoardId(null);
  } catch (error) {
    console.error("Failed to save board name:", error);
  }
};

export const deleteBoard = async (workspaceId, boardId, boards, setBoards) => {
  try {
    await authFetch(`${API_BASE_URL}/api/boards/${workspaceId}/boards/${boardId}`, {
      method: 'DELETE',
    });

    setBoards(boards.filter((board) => board.id !== boardId)); // Update state after deletion
  } catch (error) {
    console.error("Failed to delete board:", error);
    alert("Failed to delete board. Please try again.");
  }
};