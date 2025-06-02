import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ListRenderItem,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { User } from "firebase/auth";
import { auth } from "../../firebase";
import useFavorites from "../../hooks/useFavorites";
import { useNavigation } from "expo-router";
import { RootStackParamList } from "../../types/navigation";
import { NavigationProp } from "@react-navigation/native";
import LoginPromptModal from "@/components/Modals/LoginPromptModal";

interface Anime {
  id: number;
  title: { romaji: string };
  genres: string[];
  averageScore: number;
  startDate: { year: number };
  episodes: number;
  notes?: string;
}

export default function Favourites() {
  const [user, setUser] = useState<User | null>(null);
  const [newAnimeId, setNewAnimeId] = useState<string>("");
  const [editingAnimeId, setEditingAnimeId] = useState<number | null>(null);
  const [editNote, setEditNote] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [localError, setLocalError] = useState<string>("");
  const {
    favorites,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    updateNote,
    loading,
    error: favoritesError,
  } = useFavorites();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Check if user is signed in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchFavorites(currentUser.email!);
      } else {
        setModalVisible(true);
      }
    });
    return unsubscribe;
  }, []);

  const handleAddFavorite = async () => {
    if (!user || !newAnimeId) return;

    const animeId = parseInt(newAnimeId);
    const success = await addFavorite(user.email!, animeId);
    if (success) {
      setNewAnimeId("");
    }
  };

  const handleUpdateNote = async (animeId: number) => {
    if (!user) return;
    await updateNote(user.email!, animeId, editNote);
    setEditingAnimeId(null);
    setEditNote("");
  };

  const handleDeleteFavorite = async (animeId: number) => {
    if (!user) return;
    await removeFavorite(user.email!, animeId);
  };

  const renderItem: ListRenderItem<Anime> = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("details", { id: item.id.toString() })
        }
      >
        <Text style={styles.item}>• {item.title.romaji}</Text>
      </TouchableOpacity>
      <Text style={styles.subText}>Genre: {item.genres.join(", ")}</Text>
      <Text style={styles.subText}>
        Rating: {(item.averageScore / 10).toFixed(1)}
      </Text>
      <Text style={styles.subText}>Release Year: {item.startDate.year}</Text>
      <Text style={styles.subText}>Episodes: {item.episodes}</Text>
      {editingAnimeId === item.id ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            value={editNote}
            onChangeText={setEditNote}
            placeholder="Add a note..."
          />
          <Button
            title="Save"
            onPress={() => handleUpdateNote(item.id)}
            color="#ff6f61"
          />
          <Button
            title="Cancel"
            onPress={() => setEditingAnimeId(null)}
            color="#ff4444"
          />
        </View>
      ) : (
        <>
          <Text style={styles.subText}>Notes: {item.notes || "None"}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setEditingAnimeId(item.id);
                setEditNote(item.notes || "");
              }}
            >
              <Text style={styles.buttonText}>Edit Note</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteFavorite(item.id)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <Text style={styles.subText}>------------------------</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <LoginPromptModal
          text="Login to view your favourite animes"
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>⭐ Favourites</Text>
      </View>

      <View style={styles.addContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Anime ID to Add"
          value={newAnimeId}
          onChangeText={setNewAnimeId}
          keyboardType="numeric"
        />
        <Button
          title="Add Favorite"
          onPress={handleAddFavorite}
          color="#ff6f61"
        />
      </View>

      {favoritesError ? (
        <Text style={styles.error}>{favoritesError}</Text>
      ) : null}
      {localError ? <Text style={styles.error}>{localError}</Text> : null}

      {favorites.length === 0 ? (
        <Text style={styles.noFavourites}>No favourites found for user.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          style={{ pointerEvents: "auto" }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  itemContainer: {
    marginBottom: 10,
  },
  item: {
    fontSize: 18,
    marginVertical: 5,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 20,
  },
  noFavourites: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    fontSize: 16,
    flex: 1,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  editContainer: {
    marginTop: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#ff4444",
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
