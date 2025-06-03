import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getWatchlist,
  removeFromWatchlist,
  updateStatus,
} from "../utils/watchlist";

export default function WatchListScreen() {
  const [watchlist, setWatchlist] = useState<any[]>([]);

  const load = async () => {
    const list = await getWatchlist();
    setWatchlist(list);
  };

  useEffect(() => {
    load();
  }, []);

  const handleRemove = async (id: number) => {
    await removeFromWatchlist(id);
    load();
  };

  const handleChangeStatus = async (id: number, newStatus: string) => {
    await updateStatus(id, newStatus);
    load();
  };

  const renderSection = (title: string, status: string) => {
    const sectionData = watchlist.filter((a) => a.status === status);
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {sectionData.length === 0 ? (
          <Text style={styles.empty}>No anime.</Text>
        ) : (
          sectionData.map((anime, index) => (
            <View key={index} style={styles.animeRow}>
              <Text style={styles.animeTitle}>{anime.title.romaji}</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={() => handleRemove(anime.id)}>
                  <Ionicons name="trash-outline" size={24} color="#ff4444" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleChangeStatus(anime.id, "watching")}
                >
                  <Text style={styles.statusButton}>Watching</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleChangeStatus(anime.id, "watched")}
                >
                  <Text style={styles.statusButton}>Watched</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleChangeStatus(anime.id, "wantToWatch")}
                >
                  <Text style={styles.statusButton}>Want to Watch</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {renderSection("Watching", "watching")}
      {renderSection("Watched", "watched")}
      {renderSection("Want to Watch", "wantToWatch")}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  empty: { fontSize: 14, color: "#888" },
  animeRow: { marginBottom: 15 },
  animeTitle: { fontSize: 16, fontWeight: "600" },
  buttonRow: { flexDirection: "row", gap: 10, marginTop: 5 },
  statusButton: { color: "#007AFF", fontSize: 12 },
});
