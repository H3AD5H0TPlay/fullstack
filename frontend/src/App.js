import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import BookList from "./components/BookList";

const App = () => {
    const [token, setToken] = useState(localStorage.getItem("token")); // Token állapot
    const [logoutInProgress, setLogoutInProgress] = useState(false); // Logout folyamat állapota

    const handleLogout = () => {
        setLogoutInProgress(true); // Kijelentkezési folyamat jelzése
        localStorage.removeItem("token"); // Token törlése
        setToken(null); // Állapot frissítése
        setTimeout(() => setLogoutInProgress(false), 1000); // Reseteljük az állapotot rövid késleltetéssel
    };

    return (
        <Router>
            <div>
                {/* Header vagy Logout gomb */}
                {token && (
                    <div style={{ position: "absolute", top: 10, right: 10 }}>
                        <button onClick={handleLogout} style={{ padding: "10px 15px", fontSize: "14px" }}>
                            Logout
                        </button>
                    </div>
                )}

                <Routes>
                    <Route
                        path="/"
                        element={token ? <Navigate to="/books" /> : <Navigate to="/login" />}
                    />
                    <Route path="/login" element={token ? <Navigate to="/books" /> : <Login setToken={setToken} />} />
                    <Route path="/register" element={token ? <Navigate to="/books" /> : <Register />} />
                    <Route
                        path="/books"
                        element={
                            token ? (
                                <BookList logoutInProgress={logoutInProgress} />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
