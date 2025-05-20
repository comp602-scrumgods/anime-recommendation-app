import { useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase";
import useAniListApi from "./useAniListApi";

interface Anime {
  id: number;
  title: { romaji: string };
  genres: string[];
  averageScore: number;
  startDate: { year: number };
  episodes: number;
  notes?: string;
}

const useFavorites = () => {
  const [favorites, setFavorites] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchAnimeById } = useAniListApi();

  const fetchFavorites = async (userEmail: string) => {
    setLoading(true);
    try {
      const userDocRef = doc(db, "favorites", userEmail);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        const storedAnimes = data.animes || [];

        const animeDetailsPromises = storedAnimes.map(async (stored: any) => {
          const animeData = await fetchAnimeById(stored.id);
          return { ...animeData, notes: stored.notes };
        });

        const animeDetails = await Promise.all(animeDetailsPromises);
        setFavorites(animeDetails);
      } else {
        setFavorites([]);
      }
    } catch (err: any) {
      setError("Failed to fetch favorites: " + err.message);
    }
    setLoading(false);
  };

  const addFavorite = async (userEmail: string, animeId: number) => {
    setError("");
    try {
      const animeData = await fetchAnimeById(animeId);
      if (!animeData) {
        setError("Anime not found.");
        return false;
      }

      const userDocRef = doc(db, "favorites", userEmail);
      await setDoc(
        userDocRef,
        {
          animes: arrayUnion({ id: animeId, notes: "" }),
        },
        { merge: true }
      );

      setFavorites([...favorites, { ...animeData, notes: "" }]);
      return true;
    } catch (err: any) {
      setError("Failed to add favorite: " + err.message);
      return false;
    }
  };

  const removeFavorite = async (userEmail: string, animeId: number) => {
    try {
      const userDocRef = doc(db, "favorites", userEmail);
      const animeToRemove = favorites.find((anime) => anime.id === animeId);
      if (!animeToRemove) return;

      await updateDoc(userDocRef, {
        animes: arrayRemove({ id: animeId, notes: animeToRemove.notes }),
      });

      setFavorites(favorites.filter((anime) => anime.id !== animeId));
    } catch (err: any) {
      setError("Failed to remove favorite: " + err.message);
    }
  };

  const updateNote = async (
    userEmail: string,
    animeId: number,
    note: string
  ) => {
    try {
      const userDocRef = doc(db, "favorites", userEmail);
      const updatedFavorites = favorites.map((anime) =>
        anime.id === animeId ? { ...anime, notes: note } : anime
      );

      await updateDoc(userDocRef, {
        animes: updatedFavorites.map(({ notes, id }) => ({ id, notes })),
      });

      setFavorites(updatedFavorites);
    } catch (err: any) {
      setError("Failed to update note: " + err.message);
    }
  };

  return {
    favorites,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    updateNote,
    loading,
    error,
  };
};

export default useFavorites;
