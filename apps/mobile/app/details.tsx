import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
  FlatList,
  Modal, // Added Modal for share confirmation
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import useAniListApi from "../hooks/useAniListApi";
import useFavorites from "../hooks/useFavorites";
import useComments from "../hooks/useComments";
import { RootStackParamList } from "../types/navigation";
import { NavigationProp } from "@react-navigation/native";
import { auth } from "../firebase";
import LoginPromptModal from "../components/Modals/LoginPromptModal";
import Clipboard from "@react-native-clipboard/clipboard"; // Added Clipboard for sharing

interface Anime {
  id: number;
  title: { romaji: string };
  coverImage: { extraLarge: string };
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

interface Comment {
  id: string;
  userEmail: string;
  text: string;
  timestamp: string;
}

export default function CommentsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [showDescription, setShowDescription] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [copyPopupVisible, setCopyPopupVisible] = useState(false); // Added for share confirmation
  const [commentText, setCommentText] = useState<string>("");

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const {
    fetchAnimeById,
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
  const {
    comments,
    fetchAllComments,
    addComment,
    deleteComment,
    loading: commentsLoading,
    error: commentsError,
  } = useComments();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) {
        setValidationError("No anime ID provided.");
        return;
      }
      const data = await fetchAnimeById(parseInt(id), true);
      setAnime(data);

      if (auth.currentUser) {
        await fetchFavorites(auth.currentUser.email!);
      }
      await fetchAllComments();
    };

    fetchDetails();
  }, []);

  const handleToggleFavorite = async () => {
    if (!auth.currentUser) {
      setModalVisible(true);
      return;
    }

    const animeId = parseInt(id!);
    if (favorites.some((fav) => fav.id === animeId)) {
      await removeFavorite(auth.currentUser.email!, animeId);
    } else {
      await addFavorite(auth.currentUser.email!, animeId);
    }
  };

  const handleAddComment = async () => {
    if (!auth.currentUser) {
      setModalVisible(true);
      return;
    }

    if (!commentText.trim()) return;

    const success = await addComment(
      parseInt(id!),
      auth.currentUser.email!,
      commentText
    );
    if (success) {
      setCommentText("");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!auth.currentUser) {
      setModalVisible(true);
      return;
    }

    const success = await deleteComment(commentId, auth.currentUser.email!);
    if (!success) {
      console.log("Failed to delete comment");
    }
  };

  const handleShare = async () => {
    if (!anime) return;

    const shareUrl = `http://localhost:8081/details?id=${anime.id}`;
    const message = `Check out this anime: ${anime.title.romaji}! ${shareUrl}`;

    try {
      await Clipboard.setString(message);
      setCopyPopupVisible(true);
      setTimeout(() => setCopyPopupVisible(false), 2000);
    } catch (error: any) {
      console.error("Error copying link:", error.message);
    }
  };

  const renderDescription = (description: string) => {
    let processedText = description.replace(/<br\s*\/?>/g, "\n");

    const parts = processedText.split(/(<b>.*?<\/b>)/g);
    return parts.map((part, index) => {
      if (part.startsWith("<b>") && part.endsWith("</b>")) {
        // Extract the text between <b> tags and render it bold
        const boldText = part.replace(/<\/?b>/g, "");
        return (
          <Text key={index} style={{ fontWeight: "bold" }}>
            {boldText}
          </Text>
        );
      } else {
        return <Text key={index}>{part}</Text>;
      }
    });
  };

  if (animeLoading || favoritesLoading || commentsLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ff6f61" />
      </View>
    );
  }

  if (animeError || validationError || !anime) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          {animeError || validationError || "Anime not found."}
        </Text>
      </View>
    );
  }

  if (auth.currentUser && commentsError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{commentsError}</Text>
      </View>
    );
  }

  const isFavorite = favorites.some((fav) => fav.id === parseInt(id || "0"));

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

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 16,
          marginBottom: 8,
        }}
      >
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            isFavorite ? styles.removeFavoriteButton : styles.addFavoriteButton,
          ]}
          onPress={handleToggleFavorite}
        >
          <FontAwesome
            name={isFavorite ? "heart" : "heart-o"}
            size={20}
            color={isFavorite ? "#fff" : "#ff6f61"}
            style={styles.favoriteIcon}
          />
          <Text
            style={
              styles.favoriteButtonText && {
                color: isFavorite ? "#fff" : "#ff6f61",
              }
            }
          >
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowDescription(!showDescription)}
        >
          <Text style={styles.buttonText}>
            {showDescription ? "Hide Description" : "Show Description"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <FontAwesome
            name="share-alt"
            size={20}
            color="#fff"
            style={styles.shareIcon}
          />
          <Text style={styles.shareButtonText}>Share Anime</Text>
        </TouchableOpacity>
      </View>

      {showDescription && renderDescription(anime.description)}

      <Text style={styles.subHeading}>Comments</Text>

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder={
            auth.currentUser ? "Add a comment..." : "Login to Post..."
          }
          value={commentText}
          onChangeText={setCommentText}
          multiline
          onSubmitEditing={
            auth.currentUser ? handleAddComment : () => setModalVisible(true)
          }
          blurOnSubmit={false}
          returnKeyType="done"
        />
        {auth.currentUser ? (
          <TouchableOpacity
            style={styles.commentButton}
            onPress={handleAddComment}
          >
            <Text style={styles.commentButtonText}>Post</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.commentButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.commentButtonText}>Login to Post</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.commentCard,
              index % 2 === 0 ? styles.commentCardEven : styles.commentCardOdd,
            ]}
          >
            <View style={styles.commentHeader}>
              <Text style={styles.commentUser}>{item.userEmail}</Text>
              {auth.currentUser &&
                auth.currentUser.email === item.userEmail && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteComment(item.id)}
                  >
                    <FontAwesome name="trash" size={18} color="#ff4444" />
                  </TouchableOpacity>
                )}
            </View>
            <Text style={styles.commentText}>{item.text}</Text>
            <Text style={styles.commentTimestamp}>{item.timestamp}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noDataText}>
            No comments yet. Be the first to comment!
          </Text>
        }
        style={styles.commentList}
      />

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

      <LoginPromptModal
        text="Login to save your favourite anime or add comments"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      {/* Modal for "Anime link copied!" */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={copyPopupVisible}
        onRequestClose={() => setCopyPopupVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.copyModal}>
            <Text style={styles.copyModalText}>Anime link copied! Yay! 🎉</Text>
          </View>
        </View>
      </Modal>
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
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
    elevation: 5,
  },
  addFavoriteButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#ff6f61",
  },
  removeFavoriteButton: {
    backgroundColor: "#ff6f61",
  },
  favoriteIcon: {
    marginRight: 8,
  },
  favoriteButtonText: {
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2196f3",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: "#2196f3",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  shareIcon: {
    marginRight: 8,
  },
  shareButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
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
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  commentButton: {
    backgroundColor: "#ff6f61",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: "#ff6f61",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  commentButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  commentList: {
    width: "100%",
  },
  commentCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  commentCardEven: {
    backgroundColor: "#e6f0fa",
  },
  commentCardOdd: {
    backgroundColor: "#fbedfc",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  commentText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  commentTimestamp: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
    textAlign: "right",
  },
  deleteButton: {
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  copyModal: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  copyModalText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
