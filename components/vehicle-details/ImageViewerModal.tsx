import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { X } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

interface ImageViewerModalProps {
  visible: boolean;
  imageUri: string | undefined;
  onClose: () => void;
}

export const ImageViewerModal = ({
  visible,
  imageUri,
  onClose,
}: ImageViewerModalProps) => {
  const { colors } = useTheme();

  if (!imageUri) return null;

  return (
    <Modal
      visible={visible}
      transparent={true} // Switch to transparent to control the background manually
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <StatusBar style="light" backgroundColor="#000000" translucent={true} />
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </SafeAreaView>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            contentFit="contain"
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  safeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 16,
    marginRight: 8,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
