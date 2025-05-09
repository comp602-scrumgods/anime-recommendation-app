import { useEffect, useState } from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ListRenderItem,
  ScrollView,
  Image,
} from "react-native";

interface Anime {
  id: number;
  title: string;
  popularity: number;
  image: string;
}

export default function HomeScreen() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("Fetching anime list from API...");
    fetch("http://localhost:3000/animes")
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
    <View style={styles.cardWrapper}>
      <View style={styles.card}>
        {item.image && (
          <Image
            source={{ uri: item.image }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        )}
      </View>
      <Text style={styles.cardText} numberOfLines={2}>
        {item.title}
      </Text>
    </View>
  );

  const popularAnimeList = [...animeList].sort((a, b) => b.popularity - a.popularity);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Home</Text>

      {/* Trending Section */}
      <Text style={styles.header}>📡 Trending</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <View style={styles.horizontalList}>
          <FlatList
            data={animeList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={true}
          />
        </View>
      )}

      {/* Popular Section */}
      <Text style={styles.header}>🔥 Popular</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <View style={styles.horizontalList}>
          <FlatList
            data={popularAnimeList}
            keyExtractor={(item) => `popular-${item.id}`}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={true}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  horizontalList: {
    height: 340,
  },
  cardWrapper: {
    marginRight: 10,
    alignItems: "center",
    width: 300,
  },
  card: {
  backgroundColor: "#d2d3fa",
  borderRadius: 10,
  marginRight: 10,
  width: 300,
  height: 300,
  overflow: "hidden",
},
  cardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 8,
  },
});
