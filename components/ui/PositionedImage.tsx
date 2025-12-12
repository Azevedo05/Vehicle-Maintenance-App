import React, { useState } from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Image } from "expo-image";

interface PositionedImageProps {
  uri: string;
  position?: { x: number; y: number; scale: number };
  height?: number;
  borderTopRadius?: number;
  borderBottomRadius?: number;
}

/**
 * Displays an image with a saved position offset.
 * Uses the same rendering logic as DraggableImage for consistency.
 */
export const PositionedImage = ({
  uri,
  position,
  height = 200,
  borderTopRadius = 24,
  borderBottomRadius = 0,
}: PositionedImageProps) => {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  const onLoad = (event: { source: { width: number; height: number } }) => {
    const { width, height } = event.source;
    if (containerSize.width > 0 && containerSize.height > 0) {
      const widthRatio = containerSize.width / width;
      const heightRatio = containerSize.height / height;
      const scaleFactor = Math.max(widthRatio, heightRatio);

      setImageSize({
        width: width * scaleFactor,
        height: height * scaleFactor,
      });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: position
      ? [{ translateX: position.x }, { translateY: position.y }]
      : [],
  }));

  return (
    <View
      style={[
        styles.container,
        {
          height,
          borderTopLeftRadius: borderTopRadius,
          borderTopRightRadius: borderTopRadius,
          borderBottomLeftRadius: borderBottomRadius,
          borderBottomRightRadius: borderBottomRadius,
        },
      ]}
      onLayout={onLayout}
    >
      {imageSize.width > 0 && imageSize.height > 0 ? (
        <Animated.View
          style={[
            animatedStyle,
            { width: imageSize.width, height: imageSize.height },
          ]}
        >
          <Image
            source={{ uri }}
            style={{ width: "100%", height: "100%" }}
            contentFit="fill"
          />
        </Animated.View>
      ) : (
        <Image
          source={{ uri }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          onLoad={onLoad}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#202020",
  },
});
