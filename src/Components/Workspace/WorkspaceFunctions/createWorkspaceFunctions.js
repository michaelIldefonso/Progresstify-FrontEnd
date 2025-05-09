import axios from "axios";



export const handleSubmit = async (
  workspaceName,
  workspaceDescription,
  setWorkspaces,
  workspaces,
  setOpen,
  setWorkspaceName,
  setWorkspaceDescription
) => {
  // Create a new workspace
  if (!workspaceName) return;

  console.log("Submitting workspace with the following details:");
  console.log("Name:", workspaceName);
  console.log("Description:", workspaceDescription);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/workspaces`,
      { name: workspaceName, description: workspaceDescription },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    console.log("Request payload sent:", { name: workspaceName, description: workspaceDescription });
    console.log("Workspace created successfully:", response.data);

    // Update the workspaces state
    setWorkspaces([...workspaces, response.data]);
    setOpen(false); // Close the modal
    setWorkspaceName(""); // Clear the workspace name
    setWorkspaceDescription(""); // Clear the workspace description
  } catch (error) {
    console.error("Error creating workspace:", error);
  }
};

export const handleDescriptionChange = (e, setWorkspaceDescription, setDescriptionError) => {
  // for handling description change
  const value = e.target.value;
  if (value.length <= 200) {
    // Check if description is less than or equal to 200 characters
    setWorkspaceDescription(value); // Update the workspace description state
    setDescriptionError(""); // Clear the description error
  } else {
    setDescriptionError("Description exceeds 200 characters limit."); // Set description error
  }
};

export const handleDeleteWorkspace = async (workspaceId, setWorkspaces) => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/workspaces/delete/${workspaceId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    setWorkspaces((prevWorkspaces) =>
      prevWorkspaces.filter((ws) => ws.id !== workspaceId)
    );
  } catch (error) {
    console.error("Error deleting workspace:", error);
  }
};