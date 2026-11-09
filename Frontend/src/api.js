// Base URL of the FastAPI backend
const API_URL = import.meta.env.VITE_API_URL;

// Function to send user details to the backend
export const predictInsurance = async (formData) => {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("Failed to get prediction from server");
  }

  return await response.json();
};