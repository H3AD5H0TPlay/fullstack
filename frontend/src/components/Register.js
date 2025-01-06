// Register.js: Regisztrációs oldal
// A felhasználó új fiókot hozhat létre felhasználónév, e-mail és jelszó megadásával.

import React, { useState, useEffect } from "react"; // React Hook-ok importálása
import { useNavigate, Link } from "react-router-dom"; // Navigációs komponensek
import axios from "axios"; // HTTP kérésekhez használt könyvtár
import "../styles/Register.css"; // CSS stílusfájl

const Register = () => {
    // Az oldal háttér- és szövegszínének beállítása a komponens betöltésekor.
    // Kilépéskor visszaállítja az eredeti stílusokat.
    useEffect(() => {
        document.body.style.backgroundColor = "#212121"; // Sötétszürke háttér
        document.body.style.color = "#fff"; // Fehér szövegszín

        return () => {
            document.body.style.backgroundColor = ""; // Eredeti háttér visszaállítása
            document.body.style.color = ""; // Eredeti szövegszín visszaállítása
        };
    }, []);

    // A regisztrációs űrlap mezőinek állapotát tárolja.
    const [formData, setFormData] = useState({
        username: "", // Felhasználónév
        password: "", // Jelszó
        email: "", // E-mail
    });

    // Navigációs hook: Sikeres regisztráció után a bejelentkezési oldalra irányít.
    const navigate = useNavigate();

    // Az űrlap beküldésének kezelése.
    // Elküldi a regisztrációs adatokat az API-hoz, és siker esetén átirányítja a felhasználót.
    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Input validáció
        if (!formData.username.match(/^[a-zA-Z0-9]{3,20}$/)) {
            alert("Invalid username format");
            return;
        }
        if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
            alert("Invalid email format");
            return;
        }
        if (formData.password.length < 8) {
            alert("Password must be at least 8 characters long");
            return;
        }
    
        axios
            .post("http://127.0.0.1:8000/api/register/", formData)
            .then(() => {
                alert("Success! Redirecting to login...");
                navigate("/login");
            })
            .catch((error) => {
                console.error("Registration failed:", error.response?.data);
                alert("Error: e-mail or username already in use.");
            });
    };
    

    // Komponens megjelenítése: Regisztrációs űrlap és navigációs link.
    return (
        <div className="register-box">
            <p>Register</p> {/* Oldalcím */}
            <form onSubmit={handleSubmit}> {/* Regisztrációs űrlap */}
                <div className="user-box">
                    <input
                        type="text"
                        required
                        value={formData.username} // Felhasználónév értéke
                        onChange={(e) =>
                            setFormData({ ...formData, username: e.target.value })
                        } // Állapot frissítése
                    />
                    <label>Username</label> {/* Felhasználónév mező */}
                </div>

                <div className="user-box">
                    <input
                        type="email"
                        required
                        value={formData.email} // E-mail értéke
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        } // Állapot frissítése
                    />
                    <label>E-mail</label> {/* E-mail mező */}
                </div>
                
                <div className="user-box">
                    <input
                        type="password"
                        required
                        value={formData.password} // Jelszó értéke
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        } // Állapot frissítése
                    />
                    <label>Password</label> {/* Jelszó mező */}
                </div>
                
                <button type="submit" className="submit-btn">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Register {/* Regisztrációs gomb */}
                </button>
            </form>
            <p>
                Already have an account?{" "}
                <Link to="/" className="a2">Log in here</Link> {/* Navigációs link */}
            </p>
        </div>
    );
};

export default Register;
