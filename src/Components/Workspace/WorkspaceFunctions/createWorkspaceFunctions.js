import axios from "axios";

export const handleCreateWorkspace = (setOpen) => {
  // Open the modal to create a new workspace
  setOpen(true);
};

export const handleCloseModal = (setOpen) => {
  // Close the modal
  setOpen(false);
};

export const handleSubmit = (
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

  console.log("Submitting workspace with the following details:"); // Debug log
  console.log("Name:", workspaceName); // Log workspace name
  console.log("Description:", workspaceDescription); // Log workspace description

  axios
    .post(
      // Post request to create a new workspace
      `${import.meta.env.VITE_API_BASE_URL}/api/workspaces`,
      { name: workspaceName, description: workspaceDescription },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Send token in the headers
      }
    )
    .then((response) => {
      console.log("Request payload sent:", { name: workspaceName, description: workspaceDescription }); // Log payload
      console.log("Workspace created successfully:", response.data); // Log API response
      // Update the workspaces state
      setWorkspaces([...workspaces, response.data]); // Add the new workspace to the workspaces array
      setOpen(false); // Close the modal
      setWorkspaceName(""); // Clear the workspace name
      setWorkspaceDescription(""); // Clear the workspace description
    })
    .catch((error) => console.error("Error creating workspace:", error)); // Log error if workspace creation fails
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

export const handleDeleteWorkspace = (workspaceId, setWorkspaces) => {
  axios
    .delete(`${import.meta.env.VITE_API_BASE_URL}/api/workspaces/delete/${workspaceId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(() => {
      setWorkspaces((prevWorkspaces) =>
        prevWorkspaces.filter((ws) => ws.id !== workspaceId)
      );
    })
    .catch((error) => console.error("Error deleting workspace:", error));
};