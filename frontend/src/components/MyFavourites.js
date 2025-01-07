import React, { useEffect, useState } from "react";
import { getFavourites, removeFavourite } from "./api";
import "../styles/MyFavourites.css";

const MyFavourites = () => {
    const [favourites, setFavourites] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavourites = async () => {
            try {
                const data = await getFavourites();
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
            await removeFavourite(favouriteId);
            setFavourites(favourites.filter(fav => fav.id !== favouriteId));
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
                {favourites.map(fav => (
                    <li key={fav.id}>
                        {fav.book.title} <button onClick={() => handleRemove(fav.id)}>-</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyFavourites;