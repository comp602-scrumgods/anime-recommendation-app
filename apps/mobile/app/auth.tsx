import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
} from "react-native";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "../firebase";

export default function AuthScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  // Listen for auth state changes to update the UI
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

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
    setError("");
    try {
      await signOut(auth);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // If user is logged in, show logout button
  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>You are logged in</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Logout" onPress={handleLogout} color="#ff4444" />
      </View>
    );
  }

  // If user is not logged in, show login/register form
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isRegisterMode ? "Register" : "Login"}</Text>
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
        color="#ff6f61"
      />
      <br />
      <Button
        title="Sign in with Google"
        onPress={handleGoogleSignIn}
        color="#4285F4"
      />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  error: {
    color: "#ff4444",
    marginBottom: 10,
    textAlign: "center",
    fontSize: 16,
  },
  toggleText: {
    color: "#007AFF",
    marginTop: 10,
    textAlign: "center",
    fontSize: 16,
  },
});
