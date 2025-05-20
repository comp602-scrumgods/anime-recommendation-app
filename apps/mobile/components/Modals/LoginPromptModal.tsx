import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";

interface LoginPromptModalProps {
  visible: boolean;
  text: string;
  onClose: () => void;
}

export default function LoginPromptModal({
  visible,
  onClose,
  text,
}: LoginPromptModalProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Login Required</Text>
          <Text style={styles.modalMessage}>{text}</Text>
          <View style={styles.modalButtonRow}>
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.loginButton]}
              onPress={() => {
                onClose();
                navigation.navigate("auth");
              }}
            >
              <Text style={[styles.modalButtonText, styles.loginButtonText]}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtonRow: {
    flexDirection: "row",
    gap: 15,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  modalButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#ff6f61",
    borderColor: "#ff6f61",
  },
  loginButtonText: {
    color: "#fff",
  },
});
