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
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import useAniListApi from "../../hooks/useAniListApi";
import useFavorites from "../../hooks/useFavorites";
import { RootStackParamList } from "../../types/navigation";
import { NavigationProp } from "@react-navigation/native";
import { auth } from "../../firebase";
import LoginPromptModal from "@/components/Modals/LoginPromptModal";
import { addToWatchlist } from "../utils/watchlist";

interface Anime {
  id: number;
  title: { romaji: string };
  coverImage?: { extraLarge: string };
  popularity: number;
  trending?: number;
}

export default function HomeScreen() {
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([]);
  const [popularAnime, setPopularAnime] = useState<Anime[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const {
    fetchAnimeByQuery,
    loading: animeLoading,
    error: animeError,
  } = useAniListApi();
  const {
    favorites,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    loading: favoritesLoading,
  } = useFavorites();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadAnime = async () => {
      const trending = await fetchAnimeByQuery({ sort: ["TRENDING_DESC"] });
      const popular = await fetchAnimeByQuery({ sort: ["POPULARITY_DESC"] });
      setTrendingAnime(trending);
      setPopularAnime(popular);

      if (auth.currentUser) {
        await fetchFavorites(auth.currentUser.email!);
      }
    };

    (async () => {
      await loadAnime();
    })();
  }, []);

  const handleToggleFavorite = async (animeId: number) => {
    if (!auth.currentUser) {
      setModalVisible(true);
      return;
    }

    const isFavorite = favorites.some((fav) => fav.id === animeId);
    if (isFavorite) {
      await removeFavorite(auth.currentUser.email!, animeId);
    } else {
      await addFavorite(auth.currentUser.email!, animeId);
    }
  };

  const renderItem: ListRenderItem<Anime> = ({ item }) => {
    const isFavorite = favorites.some((fav) => fav.id === item.id);

    return (
      <View style={[styles.cardWrapper]}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("details", { id: item.id.toString() })
          }
        >
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
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            isFavorite ? styles.removeFavoriteButton : styles.addFavoriteButton,
          ]}
          onPress={() => handleToggleFavorite(item.id)}
          disabled={favoritesLoading}
        >
          <FontAwesome
            name={isFavorite ? "heart" : "heart-o"}
            size={16}
            color={isFavorite ? "#fff" : "#ff6f61"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => addToWatchlist(item)}>
          <Text style={styles.addButton}>+ Add to Watchlist</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.pageTitle}>Home</Text>

        <Text style={styles.header}>📡 Trending</Text>
        {animeLoading || favoritesLoading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : animeError ? (
          <Text style={styles.errorText}>{animeError}</Text>
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
        {animeLoading || favoritesLoading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : animeError ? (
          <Text style={styles.errorText}>{animeError}</Text>
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

      <LoginPromptModal
        text="Login to save your favourite anime"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    paddingTop: 50,
    paddingHorizontal: 20,
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
    height: 370,
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
    marginTop: 10,
  },
  addButton: {
    fontSize: 14,
    color: "#007AFF",
    marginTop: 6,
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  addFavoriteButton: {
    borderWidth: 2,
    borderColor: "#ff6f61",
  },
  removeFavoriteButton: {
    backgroundColor: "#ff6f61",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  noDataText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
    fontStyle: "italic",
  },
});
