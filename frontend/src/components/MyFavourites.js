import React, { useEffect, useState } from "react";
import { getFavourites, removeFavourite } from "./api"; // API hívások importálása
import "../styles/MyFavourites.css"; // Stílusok importálása

const MyFavourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavourites = async () => {
        try {
            const data = await getFavourites();
            console.log("Kedvencek:", data);
            setFavourites(data);
        } catch (err) {
            setError("Failed to load favourites.");
            console.error(err);
        }
    };
    fetchFavourites();
}, []);

  

  const handleRemove = async (favouriteId) => {
    try {
      await removeFavourite(favouriteId); // Kedvenc törlése az API-ból
      setFavourites(favourites.filter((fav) => fav.id !== favouriteId)); // Lista frissítése
    } catch (err) {
      setError("Failed to remove favourite.");
      console.error(err);
    }
  };

  return (
    <div>
        <h2>My Favourites</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ul>
            {favourites.map((fav) => (
                <li key={fav.id}>
                    {fav.book ? fav.book.title : "Unknown title"} {/* A book címének használata */}
                    <button onClick={() => handleRemove(fav.id)}>Remove</button>
                </li>
            ))}
        </ul>
    </div>
);

};

export default MyFavourites;
