import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function WatchListScreen() {
  const completedAnime = ["Dragon Ball Diama", "Naruto"]; // Replace with state/storage later

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="chevron-back" size={24} />
        <Text style={styles.headerTitle}>Watch List</Text>
        <View style={styles.headerRight}>
          <Text style={styles.saveText}>Save</Text>
          <Ionicons name="menu-outline" size={24} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Completed</Text>
        {completedAnime.map((anime, index) => (
          <TouchableOpacity key={index} style={styles.tag}>
            <Text style={styles.tagText}>{anime}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "500",
  },
  scroll: {
    gap: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  tag: {
    backgroundColor: "#000",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  tagText: {
    color: "#fff",
    fontWeight: "600",
  },
});
