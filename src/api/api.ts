const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "", 
    headers: {
        "Content-type": "application/json",
    },
});
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});