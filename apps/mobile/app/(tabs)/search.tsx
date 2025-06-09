import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "expo-router";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";
import useAniListApi from "../../hooks/useAniListApi";

interface Anime {
  id: number;
  title: { romaji: string };
  coverImage?: { extraLarge: string };
  startDate?: { year?: number };
  genres?: string[];
}

const genres = [
  "Action",
  "Comedy",
  "Drama",
  "Fantasy",
  "Romance",
  "Horror",
  "Sci-Fi",
  "Adventure",
  "Slice of Life",
  "Supernatural",
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const { fetchAnimeByQuery, loading, error } = useAniListApi();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchData = async () => {
      const year = yearFilter ? parseInt(yearFilter) : undefined;
      const genre = genreFilter || undefined;
      const query = searchQuery || undefined;

      const data = await fetchAnimeByQuery({
        search: query,
        year,
        genre,
        sort: ["POPULARITY_DESC"],
      });

      setAnimeList(data);
    };

    fetchData();
  }, [searchQuery, yearFilter, genreFilter]);

  const renderItem = ({ item }: { item: Anime }) => (
    <TouchableOpacity
      style={styles.cardWrapper}
      onPress={() => navigation.navigate("details", { id: item.id.toString() })}
    >
      {item.coverImage?.extraLarge ? (
        <Image
          source={{ uri: item.coverImage.extraLarge }}
          style={styles.card}
        />
      ) : (
        <View style={[styles.card, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <Text style={styles.cardText} numberOfLines={2}>
        {item.title.romaji}
      </Text>
      <Text style={styles.metaText}>
        {item.startDate?.year || "Unknown Year"} |{" "}
        {item.genres?.join(", ") || "No Genre"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🔎 Search Anime</Text>
      <TextInput
        style={styles.input}
        placeholder="Search by title"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TextInput
        style={styles.input}
        placeholder="Filter by year (e.g., 2025)"
        value={yearFilter}
        onChangeText={setYearFilter}
        keyboardType="numeric"
      />

      <View style={styles.genreButtons}>
        {genres.map((genre) => (
          <TouchableOpacity
            key={genre}
            style={[
              styles.genreButton,
              genreFilter === genre && styles.genreButtonActive,
            ]}
            onPress={() => setGenreFilter(genreFilter === genre ? "" : genre)}
          >
            <Text
              style={[
                styles.genreButtonText,
                genreFilter === genre && styles.genreButtonTextActive,
              ]}
            >
              {genre}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : animeList.length === 0 ? (
        <Text style={styles.noDataText}>No results found.</Text>
      ) : (
        <FlatList
          data={animeList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 20 }}
        />
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
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  genreButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    gap: 8,
  },
  genreButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#eee",
    marginRight: 8,
    marginBottom: 8,
  },
  genreButtonActive: {
    backgroundColor: "#ff6f61",
  },
  genreButtonText: {
    fontSize: 14,
    color: "#333",
  },
  genreButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  cardWrapper: {
    marginRight: 12,
    width: 300,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#eee",
    borderRadius: 10,
    width: 300,
    height: 300,
    marginBottom: 8,
    resizeMode: "cover",
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
    fontWeight: "bold",
    textAlign: "center",
  },
  metaText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  noDataText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
});
