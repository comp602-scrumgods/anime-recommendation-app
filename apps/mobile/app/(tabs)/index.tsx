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
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "expo-router";
import useAniListApi from "../../hooks/useAniListApi";

interface Anime {
  id: number;
  title: { romaji: string };
  coverImage: { extraLarge: string };
  popularity: number;
  trending?: number;
}

export default function HomeScreen() {
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([]);
  const [popularAnime, setPopularAnime] = useState<Anime[]>([]);
  const { fetchAnimeByQuery, loading, error } = useAniListApi();
  const navigation = useNavigation();

  useEffect(() => {
    const loadAnime = async () => {
      const trending = await fetchAnimeByQuery({ sort: ["TRENDING_DESC"] });
      const popular = await fetchAnimeByQuery({ sort: ["POPULARITY_DESC"] });
      setTrendingAnime(trending);
      setPopularAnime(popular);

      console.log("Trending Anime:", trending);
      console.log("Popular Anime:", popular);
    };

    (async () => {
      await loadAnime();
    })();
  }, []);

  const renderItem: ListRenderItem<Anime> = ({ item }) => (
    <TouchableOpacity
      onPress={
        () => console.log("Anime ID:", item.id) // TODO: Navigate to anime details screen
      }
    >
      <View style={styles.cardWrapper}>
        {item.coverImage?.extraLarge ? (
          <Image
            source={{ uri: item.coverImage.extraLarge }}
            style={styles.card}
            onError={(e) =>
              console.log("Image load error:", e.nativeEvent.error)
            }
          />
        ) : (
          <View style={[styles.card, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        <Text style={styles.cardText} numberOfLines={2}>
          {item.title.romaji}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Home</Text>

      <Text style={styles.header}>📡 Trending</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : trendingAnime.length === 0 ? (
        <Text style={styles.noDataText}>No trending anime found.</Text>
      ) : (
        <View style={styles.horizontalList}>
          <FlatList
            data={trendingAnime}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      <Text style={styles.header}>🔥 Popular</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : popularAnime.length === 0 ? (
        <Text style={styles.noDataText}>No popular anime found.</Text>
      ) : (
        <View style={styles.horizontalList}>
          <FlatList
            data={popularAnime}
            keyExtractor={(item) => `popular-${item.id}`}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
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
    padding: 20,
    borderRadius: 10,
    marginRight: 10,
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#666",
    fontSize: 16,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
});
