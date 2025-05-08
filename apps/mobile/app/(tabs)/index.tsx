import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ListRenderItem,
} from "react-native";

interface Anime {
  id: number;
  title: string;
}

export default function HomeScreen() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("Fetching anime list from API...");
    fetch("http://127.0.0.1:3000/animes")
      .then((res) => res.json())
      .then((data: Anime[]) => {
        setAnimeList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        setLoading(false);
      });
  }, []);

  const renderItem: ListRenderItem<Anime> = ({ item }) => (
    <Text style={styles.item}>• {item.title}</Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📡 Anime List from API</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={animeList}
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    fontSize: 18,
    marginVertical: 5,
  },
});
