import { apiClient } from "../../../utils/auth";

export const handleSubmit = async (
  workspaceName,
  workspaceDescription,
  setWorkspaces,
  workspaces,
  setOpen,
  setWorkspaceName,
  setWorkspaceDescription
) => {
  const client = apiClient();
  // Create a new workspace
  if (!workspaceName) return;

  ("Submitting workspace with the following details:");
  ("Name:", workspaceName);
  ("Description:", workspaceDescription);

  try {
    const response = await client.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/workspaces`,
      { name: workspaceName, description: workspaceDescription },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    ("Request payload sent:", { name: workspaceName, description: workspaceDescription });
    ("Workspace created successfully:", response.data);

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
  const client = apiClient();
  try {
    await client.delete(`${import.meta.env.VITE_API_BASE_URL}/api/workspaces/delete/${workspaceId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    setWorkspaces((prevWorkspaces) =>
      prevWorkspaces.filter((ws) => ws.id !== workspaceId)
    );
  } catch (error) {
    console.error("Error deleting workspace:", error);
  }
};

export const fetchWorkspaces = async (navigate, setWorkspaces) => {
  const client = apiClient(navigate);

  try {
    const response = await client.get("/api/workspaces");
    ("API Response (Workspaces):", response.data);
    setWorkspaces(response.data);
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    navigate("/");
  }
};