import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import useAniListApi from "../hooks/useAniListApi";
import { RootStackParamList } from "../types/navigation";
import { NavigationProp } from "@react-navigation/native";

interface Anime {
  id: number;
  title: { romaji: string };
  coverImage: { large: string; extraLarge: string };
  averageScore: number;
  genres: string[];
  description: string;
  recommendations: { nodes: Recommendation[] };
}

interface Recommendation {
  mediaRecommendation: {
    id: number;
    title: { romaji: string };
    coverImage: { extraLarge: string };
  };
}

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [showDescription, setShowDescription] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { fetchAnimeById, loading, error } = useAniListApi();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) {
        setValidationError("No anime ID provided.");
        return;
      }
      const data = await fetchAnimeById(parseInt(id), true);
      setAnime(data);
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ff6f61" />
      </View>
    );
  }

  if (error || validationError || !anime) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          {error || validationError || "Anime not found."}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Anime Details</Text>

      <Image
        source={{ uri: anime.coverImage.extraLarge }}
        style={styles.image}
        onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
      />

      <Text style={styles.animeTitle}>{anime.title.romaji}</Text>

      <View style={styles.ratingRow}>
        <FontAwesome name="star" size={24} color="#ffd700" />
        <Text style={styles.ratingText}>
          {(anime.averageScore / 10).toFixed(1)} | {anime.genres.join(", ")}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowDescription(!showDescription)}
      >
        <Text style={styles.buttonText}>
          {showDescription ? "Hide Description" : "Show Description"}
        </Text>
      </TouchableOpacity>

      {showDescription && (
        <Text style={styles.description}>{anime.description}</Text>
      )}

      <Text style={styles.subHeading}>You might also Like</Text>

      <View style={styles.recommendationRow}>
        {anime.recommendations.nodes.length > 0 ? (
          anime.recommendations.nodes.map((rec: Recommendation) => (
            <TouchableOpacity
              key={rec.mediaRecommendation.id}
              style={styles.recommendationCard}
              onPress={() =>
                navigation.navigate("details", {
                  id: rec.mediaRecommendation.id.toString(),
                })
              }
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: rec.mediaRecommendation.coverImage.extraLarge }}
                style={styles.recommendationImage}
                onError={(e) =>
                  console.log("Image load error:", e.nativeEvent.error)
                }
              />
              <Text style={styles.recommendationText}>
                {rec.mediaRecommendation.title.romaji}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noDataText}>No recommendations available.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  image: {
    width: 500,
    height: 500,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  animeTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#222",
    textAlign: "center",
    marginVertical: 10,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 18,
    color: "#555",
    marginLeft: 8,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#ff6f61",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: "#ff6f61",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "justify",
    lineHeight: 24,
    marginBottom: 25,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    alignSelf: "center",
    margin: 30,
  },
  recommendationRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
  },
  recommendationCard: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  recommendationImage: {
    width: 250,
    height: 250,
    borderRadius: 8,
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    fontWeight: "500",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "500",
  },
  noDataText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    fontStyle: "italic",
  },
});
