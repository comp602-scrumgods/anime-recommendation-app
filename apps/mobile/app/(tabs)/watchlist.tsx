import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getWatchlist,
  removeFromWatchlist,
  updateStatus,
} from "../utils/watchlist";

const TABS = [
  { label: "Watching", value: "watching" },
  { label: "Watched", value: "watched" },
  { label: "Want to Watch", value: "wantToWatch" },
];

export default function WatchListScreen() {
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("watching");

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

  const filteredList = watchlist.filter((a) => a.status === activeTab);

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.value}
            style={[styles.tab, activeTab === tab.value && styles.activeTab]}
            onPress={() => setActiveTab(tab.value)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.value && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No anime in this list.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.animeRow}>
            <Text style={styles.animeTitle}>{item.title.romaji}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={() => handleRemove(item.id)}>
                <Ionicons name="trash-outline" size={24} color="#ff4444" />
              </TouchableOpacity>
              {TABS.map(
                (tab) =>
                  tab.value !== activeTab && (
                    <TouchableOpacity
                      key={tab.value}
                      onPress={() => handleChangeStatus(item.id, tab.value)}
                    >
                      <Text style={styles.statusButton}>{tab.label}</Text>
                    </TouchableOpacity>
                  ),
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  tabText: {
    fontSize: 16,
    color: "#888",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#007AFF",
  },
  activeTabText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  animeRow: {
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  animeTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 5,
    alignItems: "center",
  },
  statusButton: {
    color: "#007AFF",
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#e6f0ff",
    borderRadius: 5,
    overflow: "hidden",
  },
  empty: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
    fontSize: 14,
  },
});
