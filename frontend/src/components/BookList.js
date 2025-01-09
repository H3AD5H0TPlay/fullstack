import React, { useEffect, useState, useCallback } from "react";
import API, { addFavourite, getFavourites, removeFavourite } from "./api"; // Egyedi API modul a backend kérésekhez
import "../styles/BookList.css"; // Komponens stílusai

const BookList = () => {
    /*
      Komponens betöltődésekor az oldal háttér- és szövegszínének beállítása.
      Unmountoláskor visszaáll az eredeti stílus.
    */
    useEffect(() => {
        document.body.style.backgroundColor = "#212121";
        document.body.style.color = "#fff";

        return () => {
            document.body.style.backgroundColor = "";
            document.body.style.color = "";
        };
    }, []);

    /*
      A sablon Logout gomb elrejtése, ha létezik.
    */
    useEffect(() => {
        const buttonToHide = document.querySelector(
            'button[style="padding: 10px 15px; font-size: 14px;"]'
        );
        if (buttonToHide) {
            buttonToHide.style.display = "none";
        }
    }, []);

    // Állapotok
    const [isLoggedOut, setIsLoggedOut] = useState(false); // Jelzi, ha a felhasználó kijelentkezett
    const [books, setBooks] = useState([]); // Könyvek listája
    const [newBook, setNewBook] = useState({ title: "", description: "" }); // Új könyv adatai
    const [editingBook, setEditingBook] = useState(null); // Szerkesztett könyv
    const [currentUser, setCurrentUser] = useState(""); // Aktuális felhasználó
    const [favourites, setFavourites] = useState([]);

    /*
      Kijelentkezés kezelése: Token törlése, állapot frissítése és átirányítás a bejelentkezési oldalra.
    */
    const logout = useCallback(() => {
        if (isLoggedOut) return;
        setIsLoggedOut(true);
        localStorage.removeItem("token");
        alert("You have been logged out.");
        window.location.href = "/login";
    }, [isLoggedOut]);

    /*
      Könyvek lekérése az API-ból. Kezeli a 401-es hibát (lejárt token).
    */
    const fetchBooks = useCallback(() => {
        API.get("books/")
            .then((response) => setBooks(response.data))
            .catch((error) => {
                if (error.response?.status === 401) {
                    console.error("Unauthorized request. Logging out.");
                    logout();
                } else {
                    console.error("Error fetching books:", error);
                }
            });
    }, [logout]);


    const handleAddFavourite = async (bookId) => {
        console.log("Adding book ID:", bookId); // Debug log
        try {
            await addFavourite(bookId);
            setFavourites([...favourites, bookId]); // Frissítsd a helyi állapotot
        } catch (error) {
            console.error("Error adding favourite:", error);
        }
    };
    
    const handleRemoveFavourite = async (bookId) => {
        console.log("Removing book ID:", bookId); // Debug log
        try {
            const favToRemove = favourites.find((fav) => fav === bookId);
            if (!favToRemove) return;
            await removeFavourite(favToRemove);
            setFavourites(favourites.filter((fav) => fav !== bookId)); // Frissítsd a helyi állapotot
        } catch (error) {
            console.error("Error removing favourite:", error);
        }
    };
    
    
    
    useEffect(() => {
        const fetchFavourites = async () => {
            try {
                const data = await getFavourites();
                setFavourites(data.map((fav) => fav.book)); // Csak a könyv ID-kat tároljuk
            } catch (error) {
                console.error("Error fetching favourites:", error);
            }
        };
    
        fetchFavourites();
    }, []);
    
    


    /*
      Aktuális felhasználó adatainak lekérése az API-ból. Kezeli a 401-es hibát.
    */
    const fetchCurrentUser = useCallback(() => {
        API.get("current_user/")
            .then((response) => setCurrentUser(response.data.username))
            .catch((error) => {
                if (error.response?.status === 401) {
                    console.error("Unauthorized request. Logging out.");
                    logout();
                } else {
                    console.error("Error fetching user:", error);
                }
            });
    }, [logout]);

    /*
      Komponens betöltődésekor adatok (könyvek és felhasználónév) lekérése.
    */
    useEffect(() => {
        if (!isLoggedOut) {
            fetchBooks();
            fetchCurrentUser();
        }
    }, [isLoggedOut, fetchBooks, fetchCurrentUser]);

    /*
      Új könyv hozzáadása az API-hoz.
      Sikeres hozzáadás után a könyvlista frissítése.
    */
      const addBook = () => {
        const { title, description } = newBook;
    
        // Validáció
        if (title.length < 3) {
            alert("Title must be at least 3 characters long");
            return;
        }
        if (description.length > 500) {
            alert("Description cannot exceed 500 characters");
            return;
        }
    
        API.post("books/", { title, description })
            .then(() => {
                fetchBooks();
                setNewBook({ title: "", description: "" });
            })
            .catch((error) => {
                console.error("Error adding book:", error.response?.data);
                alert(`Error: ${JSON.stringify(error.response?.data)}`);
            });
    };
    
    /*
      Meglévő könyv módosítása az API-ban. Frissíti a könyvlistát szerkesztés után.
    */
    const editBook = (id) => {
        if (!editingBook || !editingBook.title || !editingBook.description) {
            alert("Please fill in both the title and description before saving.");
            return;
        }

        API.put(`books/${id}/`, editingBook)
            .then(() => {
                fetchBooks();
                setEditingBook(null);
            })
            .catch((error) => {
                console.error("Error editing book:", error.response?.data);
                alert(`Error editing book: ${JSON.stringify(error.response?.data)}`);
            });
    };

    /*
      Könyv törlése az API-ból. Sikeres törlés után a lista frissítése.
    */
    const deleteBook = (id) => {
        API.delete(`books/${id}/`)
            .then(() => fetchBooks())
            .catch((error) => {
                console.error("Error deleting book:", error.response?.data);
                alert(`Error deleting book: ${JSON.stringify(error.response?.data)}`);
            });
    };

    // Komponens megjelenítése
    return (
        <div className="book-box">
            <nav>
                <ul className="navigation">
                    <li>
                        <a href="/favourites" className="nav-link">My favuorites</a>
                    </li>
                </ul>
            </nav>
            {/* Saját Logout gomb */}
            <button className="logout-btn" onClick={logout}>
                <div className="sign">
                    <svg viewBox="0 0 512 512">
                        <path
                            d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
                        ></path>
                    </svg>
                </div>
                <div className="text">Logout</div>
            </button>
            <p className="book-title">Book Manager</p>
            <form
                className="book-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    addBook();
                }}
            >
                <div className="book-field">
                    <input
                        className="book-input"
                        type="text"
                        value={newBook.title}
                        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                        required
                    />
                    <label className="book-label">Title</label>
                </div>
                <div className="book-field">
                    <textarea
                        className="book-input"
                        value={newBook.description}
                        onChange={(e) =>
                            setNewBook({ ...newBook, description: e.target.value })
                        }
                        required
                    ></textarea>
                    <label className="book-label">Description</label>
                </div>
                <button type="submit" className="book-btn">
                    Add Book
                </button>
            </form>
    
            <ul className="book-list">
                {books.map((book) => (
                    <li key={book.id} className="book-item">
                        {editingBook && editingBook.id === book.id ? (
                            <div className="book-edit-form">
                                <div className="book-field">
                                    <input
                                        className="book-input"
                                        type="text"
                                        value={editingBook.title}
                                        onChange={(e) =>
                                            setEditingBook({ ...editingBook, title: e.target.value })
                                        }
                                        required
                                    />
                                    <label className="book-label">Title</label>
                                </div>
                                <div className="book-field">
                                    <textarea
                                        className="book-input"
                                        value={editingBook.description}
                                        onChange={(e) =>
                                            setEditingBook({
                                                ...editingBook,
                                                description: e.target.value,
                                            })
                                        }
                                        required
                                    ></textarea>
                                    <label className="book-label">Description</label>
                                </div>
                                <button
                                    className="book-btn"
                                    onClick={() => {
                                        editBook(book.id);
                                    }}
                                >
                                    Save
                                </button>
                                <button
                                    className="book-btn"
                                    onClick={() => setEditingBook(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="book-item-content">
                                <h3>{book.title}</h3>
                                <p>
                                    <strong>Description:</strong> {book.description}
                                </p>
                                {favourites.includes(book.id) ? (
                                    <button
                                        className="favourite-btn"
                                        onClick={() => handleRemoveFavourite(book.id)}
                                    >
                                        -
                                    </button>
                                ) : (
                                    <button
                                        className="favourite-btn"
                                        onClick={() => handleAddFavourite(book.id)}
                                    >
                                        +
                                    </button>
                                )}
                                {book.owner === currentUser && (
                                    <div className="book-actions">
                                        <button
                                            className="book-btn"
                                            onClick={() => setEditingBook(book)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="book-btn"
                                            onClick={() => deleteBook(book.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
    
};

export default BookList;
