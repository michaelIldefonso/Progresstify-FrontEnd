const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Base URL for the API

// Retrieves the authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token'); // Adjust this based on where you store your token
};

// A utility function for making authenticated fetch requests
const authFetch = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

// Utility function to handle fetch requests, throwing an error for non-OK responses and returning JSON
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Network response was not ok: ${errorText}`);
  }
  return response.json();
};

// Loads boards for a specific workspace, updates the state with the boards, and sets the active board if an ID is provided
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

// Creates a new board in the specified workspace, updates the boards state, and closes the modal
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

// Handles board selection, sets the active board, and navigates to its page
export const selectBoard = (board, setActiveBoard, setEditingBoardId, navigate) => {
  setActiveBoard(board);
  setEditingBoardId(null);
  navigate(`/board/${board.id}`);
};

// Handles the click event to edit a board's name
export const handleEditClick = (board, setEditingBoardId, setBoardName) => {
  setEditingBoardId(board.id);
  setBoardName(board.name);
};

// Handles changes to the board name input field
export const handleNameChange = (e, setBoardName) => {
  setBoardName(e.target.value);
};

// Saves the updated board name and updates the board list state
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

// Deletes a board and updates the board list state
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