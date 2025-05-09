import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const trendingAnime = [
  {
    id: 1,
    title: "Attack on Titan",
    image: "https://i.imgur.com/L68FtMA.jpg", // placeholder
  },
  {
    id: 2,
    title: "Jujutsu Kaisen",
    image: "https://i.imgur.com/FHMNSVZ.jpeg",
  },
  {
    id: 3,
    title: "Demon Slayer",
    image: "https://i.imgur.com/b0NOuHq.jpeg",
  },
];

const TrendingCarousel = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🔥 Trending Anime</Text>
      <FlatList
        data={trendingAnime}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default TrendingCarousel;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 10,
  },
  card: {
    marginHorizontal: 8,
    width: 120,
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 180,
    borderRadius: 12,
  },
  title: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
});
