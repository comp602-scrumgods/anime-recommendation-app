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
  Pressable,
} from "react-native";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

interface Anime {
  title: string;
  genre: string[];
  rating: number;
  releaseYear: number;
  seasons: number;
  notes?: string;
}

export default function Favourites() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Check if user is signed in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Fetch favourites when user signs in
  useEffect(() => {
    if (!user) return;

    const fetchFavourites = async () => {
      setLoading(true);
      try {
        const userDocRef = doc(db, "favourites", user.email!);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setAnimeList(data.animes || []);
        }
      } catch (err) {
        console.error("Firestore error:", err);
      }
      setLoading(false);
    };

    fetchFavourites();
  }, [user]);

  const handleLogin = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegister = async () => {
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAnimeList([]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const renderItem: ListRenderItem<Anime> = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.item}>• {item.title}</Text>
      <Text style={styles.subText}>Genre: {item.genre.join(", ")}</Text>
      <Text style={styles.subText}>Rating: {item.rating}</Text>
      <Text style={styles.subText}>Release Year: {item.releaseYear}</Text>
      <Text style={styles.subText}>Seasons: {item.seasons}</Text>
      {item.notes && <Text style={styles.subText}>Notes: {item.notes}</Text>}
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
        <Text style={styles.header}>
          {isRegisterMode ? "Register" : "Login"}
        </Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button
          title={isRegisterMode ? "Register" : "Login"}
          onPress={isRegisterMode ? handleRegister : handleLogin}
        />
        <br />
        <Button title="Sign in with Google" onPress={handleGoogleSignIn} />
        <Pressable onPress={() => setIsRegisterMode(!isRegisterMode)}>
          <Text style={styles.toggleText}>
            {isRegisterMode
              ? "Already have an account? Login"
              : "Need an account? Register"}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>⭐ Favourites</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>
      {animeList.length === 0 ? (
        <Text style={styles.noFavourites}>No favourites found for user.</Text>
      ) : (
        <FlatList
          data={animeList}
          keyExtractor={(item) => item.title.toString()}
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
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  toggleText: {
    color: "#007AFF",
    marginTop: 10,
    textAlign: "center",
  },
});
