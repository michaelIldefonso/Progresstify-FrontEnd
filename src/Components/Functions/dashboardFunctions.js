export const loadBoards = async (workspaceId, setBoards, setActiveBoard, id) => {
  try {
    const response = await fetch(`/api/workspaces/${workspaceId}/boards`);
    const savedBoards = await response.json();
    setBoards(savedBoards);
    if (id) {
      const active = savedBoards.find(d => d.id === parseInt(id));
      setActiveBoard(active);
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
    const response = await fetch(`/api/workspaces/${workspaceId}/boards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: boardName }),
    });

    console.log(`Response status: ${response.status}`);
    console.log(`Response status text: ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Network response was not ok: ${response.status} ${response.statusText}`);
      console.error(`Response body: ${errorText}`);
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    let newBoard;
    try {
      newBoard = await response.json();
      console.log('Board created successfully:', newBoard);
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      throw new Error('Failed to parse JSON response');
    }

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
    const response = await fetch(`/api/workspaces/${workspaceId}/boards/${board.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: boardName })
    });
    if (response.ok) {
      setBoards(boards.map(d => d.id === board.id ? { ...d, name: boardName } : d));
      setEditingBoardId(null);
    } else {
      console.error("Failed to save board name:", await response.text());
    }
  } catch (error) {
    console.error("Failed to save board name:", error);
  }
};