import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

// Coded by Mengyang
// This is a simple search screen for anime titles.
// It fetches data from a local API and allows users to search by title, year, and genre.

interface Anime {
  id: number;
  title: string;
  year: number;
  genre: string;
}

export default function SearchScreen() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [filteredAnime, setFilteredAnime] = useState<Anime[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:3000/animes")
      .then((res) => res.json())
      .then((data: Anime[]) => {
        setAnimeList(data);
        setFilteredAnime(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = animeList;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((anime) =>
        anime.title.toLowerCase().includes(q),
      );
    }

    if (yearFilter) {
      filtered = filtered.filter(
        (anime) => anime.year.toString() === yearFilter,
      );
    }

    if (genreFilter) {
      filtered = filtered.filter((anime) =>
        anime.genre.toLowerCase().includes(genreFilter.toLowerCase()),
      );
    }

    setFilteredAnime(filtered);
  }, [searchQuery, yearFilter, genreFilter]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔍 Search Anime</Text>
      <TextInput
        style={styles.input}
        placeholder="Search by title"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TextInput
        style={styles.input}
        placeholder="Filter by year (e.g., 2023)"
        value={yearFilter}
        onChangeText={setYearFilter}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Filter by genre (e.g., Action)"
        value={genreFilter}
        onChangeText={setGenreFilter}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={filteredAnime}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Text style={styles.item}>
              • {item.title} ({item.year}) – {item.genre}
            </Text>
          )}
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
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  item: {
    fontSize: 16,
    marginVertical: 6,
  },
});
