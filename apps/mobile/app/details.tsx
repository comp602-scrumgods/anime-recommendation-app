import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function DetailsScreen() {
  const { id, title } = useLocalSearchParams<{ id?: string; title?: string }>();

  // State for editable fields
  const [animeId, setAnimeId] = useState(id?.toString() || "");
  const [animeTitle, setAnimeTitle] = useState(title?.toString() || "");
  const [note, setNote] = useState("");

  const handleSaveNote = () => {
    console.log("Saved Note:", {
      animeId,
      animeTitle,
      note,
    });
    alert("Note saved!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Anime ID:</Text>
      <TextInput
        style={styles.input}
        value={animeId}
        onChangeText={setAnimeId}
        placeholder="Anime ID"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Anime Title:</Text>
      <TextInput
        style={styles.input}
        value={animeTitle}
        onChangeText={setAnimeTitle}
        placeholder="Anime Title"
      />

      <Text style={styles.label}>Add a Note:</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        numberOfLines={4}
        value={note}
        onChangeText={setNote}
        placeholder="Write your note here..."
      />

      <Button title="Save Note" onPress={handleSaveNote} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#000",
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    padding: 10,
  },
});
