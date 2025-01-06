// Login.js: Bejelentkező oldal
// A felhasználó megadja a felhasználónevét és jelszavát, majd belépés történik a szervertől kapott token alapján.

import React, { useState, useEffect } from "react"; // React Hook-ok importálása
import { Link } from "react-router-dom"; // Navigációhoz használt Link komponens
import axios from "axios"; // HTTP kérésekhez használt könyvtár
import "../styles/Login.css"; // Komponenshez tartozó CSS stílusok

const Login = ({ setToken }) => {
    // Az oldal háttér- és szövegszínének beállítása a komponens betöltésekor.
    // Kilépéskor (unmount) visszaállítja az eredeti stílusokat.
    useEffect(() => {
        document.body.style.backgroundColor = "#212121"; // Sötétszürke háttér
        document.body.style.color = "#fff"; // Fehér szövegszín

        return () => {
            document.body.style.backgroundColor = ""; // Eredeti háttér visszaállítása
            document.body.style.color = ""; // Eredeti szövegszín visszaállítása
        };
    }, []);

    // `credentials`: A felhasználónév és jelszó állapotát tárolja.
    const [credentials, setCredentials] = useState({ username: "", password: "" });

    // Az űrlap beküldésének kezelése.
    // A felhasználónév és jelszó elküldése az API-nak, és a szervertől kapott token tárolása.
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Input validáció
        if (!credentials.username.match(/^[a-zA-Z0-9]{3,20}$/)) {
            alert("Invalid username format");
            return;
        }
        if (credentials.password.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }
    
        axios
            .post("http://127.0.0.1:8000/api/token/", credentials)
            .then((response) => {
                const token = response.data.access;
                localStorage.setItem("token", token);
                setToken(token);
            })
            .catch((error) => {
                console.error("Login failed:", error);
                alert("Invalid username or password");
            });
    };

    // Komponens megjelenítése: Űrlap a bejelentkezéshez és link a regisztrációs oldalra.
    return (
        <div className="login-box">
            <p>Login</p> {/* Oldalcím */}
            <form onSubmit={handleSubmit}> {/* Bejelentkezési űrlap */}
                <div className="user-box">
                    <input
                        type="text"
                        required
                        value={credentials.username} // Felhasználónév állapota
                        onChange={(e) =>
                            setCredentials({ ...credentials, username: e.target.value })
                        } // Állapot frissítése
                    />
                    <label>Username</label> {/* Felhasználónév címke */}
                </div>
                
                <div className="user-box">
                    <input
                        type="password"
                        required
                        value={credentials.password} // Jelszó állapota
                        onChange={(e) =>
                            setCredentials({ ...credentials, password: e.target.value })
                        } // Állapot frissítése
                    />
                    <label>Password</label> {/* Jelszó címke */}
                </div>
                
                <button type="submit" className="submit-btn"> {/* Bejelentkezés gomb */}
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Login
                </button>
            </form>
            
            <p>
                Don't have an account?{" "}
                <Link to="/register" className="a2">Register here</Link> {/* Regisztrációs link */}
            </p>
        </div>
    );
};

export default Login;
