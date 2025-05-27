import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getWatchlist, removeFromWatchlist } from "@/utils/watchlist";

export default function WatchListScreen() {
  const [watchlist, setWatchlist] = useState<any[]>([]);

  const load = async () => {
    const list = await getWatchlist();
    setWatchlist(list);
  };

  useEffect(() => {
    const unsubscribe = load();
    return () => unsubscribe;
  }, []);

  const handleRemove = async (id: number) => {
    await removeFromWatchlist(id);
    load();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="chevron-back" size={24} />
        <Text style={styles.headerTitle}>Watch List</Text>
        <View style={styles.headerRight}>
          <Text style={styles.saveText}>Save</Text>
          <Ionicons name="menu-outline" size={24} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {watchlist.length === 0 ? (
          <Text style={styles.empty}>Your watch list is empty.</Text>
        ) : (
          watchlist.map((anime, index) => (
            <TouchableOpacity key={index} style={styles.tag}>
              <Text style={styles.tagText}>{anime.title.romaji}</Text>
              <Ionicons
                name="close"
                size={16}
                color="white"
                style={{ marginLeft: 8 }}
                onPress={() => handleRemove(anime.id)}
              />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50, paddingHorizontal: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  saveText: { fontSize: 16, fontWeight: "500" },
  scroll: { gap: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "600" },
  empty: { fontSize: 16, color: "#888" },
  tag: {
    backgroundColor: "#000",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  tagText: { color: "#fff", fontWeight: "600" },
});
