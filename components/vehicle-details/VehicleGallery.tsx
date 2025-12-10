import React from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useTheme } from "@/contexts/ThemeContext";

interface VehicleGalleryProps {
  photos: string[];
  activePhoto: string | undefined;
  onSelect: (uri: string) => void;
}

export const VehicleGallery = ({
  photos,
  activePhoto,
  onSelect,
}: VehicleGalleryProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  if (!photos || photos.length <= 1) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {photos.map((uri, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onSelect(uri)}
            activeOpacity={0.7}
            style={[
              styles.thumbContainer,
              activePhoto === uri && styles.activeThumb,
            ]}
          >
            <Image source={{ uri }} style={styles.image} contentFit="cover" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginBottom: 24,
      marginTop: -40, // Negative margin to pull it up slightly into the negative space if needed, or just normal spacing
    },
    content: {
      paddingHorizontal: 24,
      gap: 12,
    },
    thumbContainer: {
      width: 70,
      height: 70,
      borderRadius: 12,
      overflow: "hidden",
      borderWidth: 2,
      borderColor: "transparent",
      backgroundColor: colors.surface,
    },
    activeThumb: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    image: {
      width: "100%",
      height: "100%",
    },
  });
