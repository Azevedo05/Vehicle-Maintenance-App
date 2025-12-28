import React, { useState, useEffect } from "react";
import { View, StyleSheet, LayoutChangeEvent, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { Move } from "lucide-react-native";

interface VehicleImagePosition {
  xRatio: number; // 0-1
  yRatio: number; // 0-1
  scale: number;
}

interface VehicleImageProps {
  uri: string;
  position?: VehicleImagePosition;
  onPositionChange?: (position: VehicleImagePosition) => void;
  height?: number;
  aspectRatio?: number;
  editable?: boolean;
  borderTopRadius?: number;
  borderBottomRadius?: number;
  style?: any;
  dragLabel?: string;
}

/**
 * Unified component for displaying vehicle images with optional pan-to-crop.
 * Uses normalized positioning (0-1 ratios) for consistent rendering at any size.
 */
export const VehicleImage = ({
  uri,
  position,
  onPositionChange,
  height,
  aspectRatio,
  editable = false,
  borderTopRadius = 0,
  borderBottomRadius = 0,
  style,
  dragLabel = "Drag to adjust",
}: VehicleImageProps) => {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [naturalSize, setNaturalSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // Convert ratio to pixel offset
  const ratioToOffset = (
    ratio: number,
    containerDim: number,
    imageDim: number
  ) => {
    "worklet";
    // Full freedom formula: offset = ratio * (container + image) - image
    return ratio * (containerDim + imageDim) - imageDim;
  };

  // Convert pixel offset to ratio
  const offsetToRatio = (
    offset: number,
    containerDim: number,
    imageDim: number
  ) => {
    // Inverse of ratioToOffset: ratio = (offset + image) / (container + image)
    const totalSpan = containerDim + imageDim;
    if (totalSpan <= 0) return 0.5;
    return (offset + imageDim) / totalSpan;
  };

  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const scale = useSharedValue(position?.scale || 1);
  const context = useSharedValue({ x: 0, y: 0 });

  // Calculate base image size (Cover) whenever container or natural image size changes
  useEffect(() => {
    if (containerSize.width > 0 && containerSize.height > 0 && naturalSize) {
      const widthRatio = containerSize.width / naturalSize.width;
      const heightRatio = containerSize.height / naturalSize.height;
      const scaleFactor = Math.max(widthRatio, heightRatio);

      setImageSize({
        width: naturalSize.width * scaleFactor,
        height: naturalSize.height * scaleFactor,
      });
    }
  }, [containerSize, naturalSize]);

  // Update offsets when position, image size, or container size changes
  useEffect(() => {
    if (
      position &&
      containerSize.width > 0 &&
      containerSize.height > 0 &&
      imageSize.width > 0 &&
      imageSize.height > 0
    ) {
      const scaledWidth = imageSize.width * position.scale;
      const scaledHeight = imageSize.height * position.scale;

      offsetX.value = ratioToOffset(
        position.xRatio,
        containerSize.width,
        scaledWidth
      );
      offsetY.value = ratioToOffset(
        position.yRatio,
        containerSize.height,
        scaledHeight
      );
      scale.value = position.scale;
    }
  }, [position, containerSize, imageSize]);

  // Center image when no position is provided and sizes are known
  useEffect(() => {
    if (
      !position &&
      containerSize.width > 0 &&
      containerSize.height > 0 &&
      imageSize.width > 0 &&
      imageSize.height > 0
    ) {
      const centerX = (containerSize.width - imageSize.width) / 2;
      const centerY = (containerSize.height - imageSize.height) / 2;
      offsetX.value = centerX;
      offsetY.value = centerY;
    }
  }, [containerSize, imageSize, position, uri]);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height: h } = event.nativeEvent.layout;
    setContainerSize({ width, height: h });
  };

  const onLoad = (event: { source: { width: number; height: number } }) => {
    const { width, height: h } = event.source;
    setNaturalSize({ width, height: h });
  };

  const clamp = (value: number, min: number, max: number) => {
    "worklet";
    return Math.min(Math.max(value, min), max);
  };

  const emitPositionChange = (x: number, y: number, s: number) => {
    if (onPositionChange) {
      const currentW = imageSize.width * s;
      const currentH = imageSize.height * s;
      onPositionChange({
        xRatio: offsetToRatio(x, containerSize.width, currentW),
        yRatio: offsetToRatio(y, containerSize.height, currentH),
        scale: s,
      });
    }
  };

  const pan = Gesture.Pan()
    .enabled(editable && imageSize.width > 0)
    .onStart(() => {
      context.value = { x: offsetX.value, y: offsetY.value };
    })
    .onUpdate((event) => {
      const currentW = imageSize.width * scale.value;
      const currentH = imageSize.height * scale.value;

      // Full freedom constraints
      const maxOffsetX = containerSize.width;
      const minOffsetX = -currentW;
      const maxOffsetY = containerSize.height;
      const minOffsetY = -currentH;

      offsetX.value = clamp(
        context.value.x + event.translationX,
        minOffsetX,
        maxOffsetX
      );
      offsetY.value = clamp(
        context.value.y + event.translationY,
        minOffsetY,
        maxOffsetY
      );
    })
    .onEnd(() => {
      if (onPositionChange) {
        runOnJS(emitPositionChange)(offsetX.value, offsetY.value, scale.value);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    width: imageSize.width * scale.value,
    height: imageSize.height * scale.value,
    transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
  }));

  const containerStyle = [
    styles.container,
    {
      ...(height ? { height } : {}),
      ...(aspectRatio ? { aspectRatio } : {}),
      borderTopLeftRadius: borderTopRadius,
      borderTopRightRadius: borderTopRadius,
      borderBottomLeftRadius: borderBottomRadius,
      borderBottomRightRadius: borderBottomRadius,
    },
    style,
  ];

  // Fast path: no position, no edit mode -> just use native cover
  if (!position && !editable) {
    return (
      <View style={containerStyle} onLayout={onLayout}>
        <Image
          source={{ uri }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          transition={200}
        />
      </View>
    );
  }

  // Show native cover while waiting for measurements
  const sizesReady =
    containerSize.width > 0 &&
    containerSize.height > 0 &&
    imageSize.width > 0 &&
    imageSize.height > 0;

  return (
    <View style={containerStyle} onLayout={onLayout}>
      <GestureDetector gesture={pan}>
        <View style={styles.mask}>
          {sizesReady ? (
            <Animated.View style={animatedStyle}>
              <Image
                source={{ uri }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                transition={200}
              />
            </Animated.View>
          ) : (
            // Native cover until we can calculate proper offsets
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
          <Text style={styles.dragText}>{dragLabel}</Text>
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
