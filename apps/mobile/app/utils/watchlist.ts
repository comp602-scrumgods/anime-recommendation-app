import AsyncStorage from "@react-native-async-storage/async-storage";

const WATCHLIST_KEY = "watchlist";

export const getWatchlist = async () => {
  const json = await AsyncStorage.getItem(WATCHLIST_KEY);
  return json ? JSON.parse(json) : [];
};

export const addToWatchlist = async (anime: any) => {
  const current = await getWatchlist();
  const exists = current.some((a: any) => a.id === anime.id);
  if (!exists) {
    const updated = [...current, anime]; // ✅ append to list
    await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
  }
};

export const removeFromWatchlist = async (id: number) => {
  const current = await getWatchlist();
  const updated = current.filter((a: any) => a.id !== id);
  await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
};
