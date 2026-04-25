import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

// Generic Post Request Function
export const postRequest = async (url, data, isFormData = false) => {
  try {
    const config = {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    };
    const response = await API.post(url, data, config);
    return response.data;
  } catch (error) {
    console.log(error.response);
    throw error.response?.data?.message || "Something went wrong!";
  }
};

export const logoutUser = async () => {
  try {
    const response = await API.post("/users/logout");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Logout failed";
  }
};

// Specific Auth Services
export const registerUser = (formData) =>
  postRequest("/users/register", formData, true);
export const loginUser = (credentials) =>
  postRequest("/users/login", credentials, false);
