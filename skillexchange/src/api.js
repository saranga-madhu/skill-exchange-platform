export const API_URL = "http://localhost:5001/api";

export const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
        return { Authorization: `Bearer ${user.token}` };
    }
    return {};
};
