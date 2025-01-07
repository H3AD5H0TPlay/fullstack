// api.js: Axios beállítások
// Ez a fájl beállítja az Axios-t egy alapértelmezett URL-lel, és minden kéréshez hozzáadja a Bearer tokent, ha elérhető.
// A 401-es (Unauthorized) hibák kezelésére is tartalmaz egy interceptor-t, amely kijelentkezteti a felhasználót.

import axios from "axios";

// Egy Axios példány létrehozása az API alapértelmezett URL-jével
const API = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/api/", // API elérési útvonal
});

// Request interceptor hozzáadása, amely a Bearer tokent illeszti az Authorization fejlécbe (ha van)
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // Token lekérése a localStorage-ból
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Authorization fejléc hozzáadása
        }
        return config; // A módosított konfiguráció visszaadása
    },
    (error) => Promise.reject(error) // Hibák továbbítása
);

// Response interceptor hozzáadása a válaszok kezelésére, például 401-es hibák esetén
API.interceptors.response.use(
    (response) => response, // Sikeres válaszok változatlanul továbbítása
    (error) => {
        if (error.response?.status === 401) { // Ha a válasz státusza 401 (Unauthorized)
            console.error("Jogosulatlan kérés. Kijelentkezés..."); // Hibajelzés a konzolra
            localStorage.removeItem("token"); // Token eltávolítása a localStorage-ból
            window.location.href = "/login"; // Átirányítás a bejelentkezési oldalra
        }
        return Promise.reject(error); // Egyéb hibák továbbítása
    }
);

// Token eltávolítása érvénytelenítéskor
export const logout = () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
        API.post("/logout/", { refresh_token: refreshToken })
            .then(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    } else {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }
};

export const getFavourites = async () => {
    try {
        const response = await API.get('/favourites/');
        return response.data;
    } catch (error) {
        console.error("Error fetching favourites:", error);
        throw error;
    }
};

export const addFavourite = async (bookId) => {
    try {
        API.post("/favourites/", { book: bookId });
    } catch (error) {
        console.error("Error adding favourite:", error);
        throw error;
    }
};

export const removeFavourite = async (favouriteId) => {
    try {
        const response = await API.delete(`/favourites/${favouriteId}/`);
        return response.data;
    } catch(error) {
        console.error("Error deleting favourite:", error);
        throw error;
    }
};

export default API; // Az Axios konfigurált példányának exportálása
