import React, { useState, useEffect } from "react";
import { View, StyleSheet, LayoutChangeEvent, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { Move } from "lucide-react-native";

interface DraggableImageProps {
  uri: string;
  onPositionChange?: (position: {
    x: number;
    y: number;
    scale: number;
  }) => void;
  initialPosition?: { x: number; y: number; scale: number };
  aspectRatio?: number;
  editable?: boolean;
  style?: any;
}

export const DraggableImage = ({
  uri,
  onPositionChange,
  initialPosition,
  aspectRatio = 16 / 9,
  editable = true,
  style,
}: DraggableImageProps) => {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const offsetX = useSharedValue(initialPosition?.x || 0);
  const offsetY = useSharedValue(initialPosition?.y || 0);
  const scale = useSharedValue(initialPosition?.scale || 1);
  const context = useSharedValue({ x: 0, y: 0 });

  useEffect(() => {
    if (initialPosition) {
      offsetX.value = initialPosition.x;
      offsetY.value = initialPosition.y;
      scale.value = initialPosition.scale;
    }
  }, [initialPosition]);

  useEffect(() => {
    if (uri && !initialPosition) {
      offsetX.value = 0;
      offsetY.value = 0;
      scale.value = 1;
    }
  }, [uri]);

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

  // Helper function to clamp values
  const clamp = (value: number, min: number, max: number) => {
    "worklet";
    return Math.min(Math.max(value, min), max);
  };

  const pan = Gesture.Pan()
    .enabled(editable && imageSize.width > 0)
    .onStart(() => {
      context.value = { x: offsetX.value, y: offsetY.value };
    })
    .onUpdate((event) => {
      const maxOffset = 0;
      const minOffsetX = containerSize.width - imageSize.width;
      const minOffsetY = containerSize.height - imageSize.height;

      // Apply clamping during drag to prevent going beyond bounds
      offsetX.value = clamp(
        context.value.x + event.translationX,
        minOffsetX,
        maxOffset
      );
      offsetY.value = clamp(
        context.value.y + event.translationY,
        minOffsetY,
        maxOffset
      );
    })
    .onEnd(() => {
      if (onPositionChange) {
        runOnJS(onPositionChange)({
          x: offsetX.value,
          y: offsetY.value,
          scale: scale.value,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
  }));

  return (
    <View
      style={[styles.container, { aspectRatio }, style]}
      onLayout={onLayout}
    >
      <GestureDetector gesture={pan}>
        <View style={styles.mask}>
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
      </GestureDetector>

      {editable && (
        <View style={styles.dragIndicator}>
          <Move size={16} color="rgba(255,255,255,0.8)" />
          <Text style={styles.dragText}>Arrastar</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#202020",
    overflow: "hidden",
    borderRadius: 16,
    position: "relative",
  },
  mask: {
    flex: 1,
    overflow: "hidden",
  },
  dragIndicator: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    pointerEvents: "none",
  },
  dragText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "600",
  },
});
