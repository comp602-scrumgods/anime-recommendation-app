import AsyncStorage from "@react-native-async-storage/async-storage";

const WATCHLIST_KEY = "watchlist";

// Read current list from storage
export const getWatchlist = async () => {
  const json = await AsyncStorage.getItem(WATCHLIST_KEY);
  return json ? JSON.parse(json) : [];
};

// Add anime to watchlist (correct version that supports multiple anime)
export const addToWatchlist = async (anime: any) => {
  const current = await getWatchlist();

  // Always normalize the object fields we store
  const normalizedAnime = {
    id: anime.id,
    title: anime.title,
    coverImage: anime.coverImage,
    status: "wantToWatch",
  };

  // Check for duplicates safely
  const exists = current.some((a: any) => Number(a.id) === Number(normalizedAnime.id));
  if (!exists) {
    const updated = [...current, normalizedAnime];
    await AsyncStorage.removeItem(WATCHLIST_KEY); // Force clear before writing (safe for web)
    await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
  }
};

// Remove anime
export const removeFromWatchlist = async (id: number) => {
  const current = await getWatchlist();
  const updated = current.filter((a: any) => Number(a.id) !== Number(id));
  await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
};

// Change status of anime
export const updateStatus = async (id: number, newStatus: string) => {
  const current = await getWatchlist();
  const updated = current.map((a: any) =>
    Number(a.id) === Number(id) ? { ...a, status: newStatus } : a
  );
  await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
};
