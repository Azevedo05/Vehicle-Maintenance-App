import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
  LayoutChangeEvent,
  Image as RNImage,
  Dimensions,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { X, Check, ChevronRight, Move } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";

interface ImagePosition {
  xRatio: number;
  yRatio: number;
  scale: number;
}

interface ImagePositionResult {
  listPosition: ImagePosition;
  detailsPosition: ImagePosition;
}

interface ImagePositionModalProps {
  visible: boolean;
  imageUri: string;
  initialListPosition?: ImagePosition;
  initialDetailsPosition?: ImagePosition;
  onConfirm: (result: ImagePositionResult) => void;
  onCancel: () => void;
  listAspectRatio?: number;
  detailsAspectRatio?: number;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

type Step = 1 | 2;

export const ImagePositionModal = ({
  visible,
  imageUri,
  initialListPosition,
  initialDetailsPosition,
  onConfirm,
  onCancel,
  listAspectRatio = 16 / 9,
  detailsAspectRatio = 16 / 9,
}: ImagePositionModalProps) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<Step>(1);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [imageNaturalSize, setImageNaturalSize] = useState({
    width: 0,
    height: 0,
  });
  const [isReady, setIsReady] = useState(false);

  // Saved positions from each step
  const [savedListPosition, setSavedListPosition] =
    useState<ImagePosition | null>(null);

  // Current step's aspect ratio
  const currentAspectRatio = step === 1 ? listAspectRatio : detailsAspectRatio;

  // Shared values for animations
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const savedOffsetX = useSharedValue(0);
  const savedOffsetY = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  // Frame dimensions based on current step
  const padding = 24;
  const frameWidth = SCREEN_WIDTH - padding * 2;
  const frameHeight = frameWidth / currentAspectRatio;

  // Base image size for current frame
  const [baseImageSize, setBaseImageSize] = useState({ width: 0, height: 0 });

  // Load image dimensions
  useEffect(() => {
    if (visible && imageUri) {
      setIsReady(false);
      setStep(1);
      setSavedListPosition(null);
      setImageNaturalSize({ width: 0, height: 0 });

      RNImage.getSize(
        imageUri,
        (width, height) => {
          setImageNaturalSize({ width, height });
        },
        (error) => {
          console.error("Failed to get image size:", error);
        }
      );
    }
  }, [visible, imageUri]);

  // Calculate base image size when natural size or aspect ratio changes
  useEffect(() => {
    if (imageNaturalSize.width > 0 && imageNaturalSize.height > 0) {
      const imageAspect = imageNaturalSize.width / imageNaturalSize.height;
      const frameAspect = frameWidth / frameHeight;

      let baseWidth, baseHeight;
      if (imageAspect > frameAspect) {
        baseHeight = frameHeight;
        baseWidth = baseHeight * imageAspect;
      } else {
        baseWidth = frameWidth;
        baseHeight = baseWidth / imageAspect;
      }

      setBaseImageSize({ width: baseWidth, height: baseHeight });
    }
  }, [imageNaturalSize, frameWidth, frameHeight]);

  // Initialize position when base size is calculated
  useEffect(() => {
    if (
      baseImageSize.width > 0 &&
      baseImageSize.height > 0 &&
      containerSize.height > 0
    ) {
      const initialPosition =
        step === 1 ? initialListPosition : initialDetailsPosition;
      const initialScale = initialPosition?.scale || 1;

      scale.value = initialScale;
      savedScale.value = initialScale;

      const imgWidth = baseImageSize.width * initialScale;
      const imgHeight = baseImageSize.height * initialScale;

      if (initialPosition) {
        const maxOffsetX = frameWidth - imgWidth;
        const maxOffsetY = frameHeight - imgHeight;
        offsetX.value = initialPosition.xRatio * maxOffsetX;
        offsetY.value = initialPosition.yRatio * maxOffsetY;
      } else {
        // Center
        offsetX.value = (frameWidth - imgWidth) / 2;
        offsetY.value = (frameHeight - imgHeight) / 2;
      }

      savedOffsetX.value = offsetX.value;
      savedOffsetY.value = offsetY.value;
      setIsReady(true);
    }
  }, [
    baseImageSize,
    containerSize,
    step,
    initialListPosition,
    initialDetailsPosition,
  ]);

  const onContainerLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  // Pinch gesture
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = Math.max(1, Math.min(savedScale.value * event.scale, 5));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      const imgWidth = baseImageSize.width * scale.value;
      const imgHeight = baseImageSize.height * scale.value;
      const minX = frameWidth - imgWidth;
      const minY = frameHeight - imgHeight;
      offsetX.value = Math.min(0, Math.max(minX, offsetX.value));
      offsetY.value = Math.min(0, Math.max(minY, offsetY.value));
      savedOffsetX.value = offsetX.value;
      savedOffsetY.value = offsetY.value;
    });

  // Pan gesture
  const panGesture = Gesture.Pan()
    .minPointers(1)
    .maxPointers(2)
    .onStart(() => {
      savedOffsetX.value = offsetX.value;
      savedOffsetY.value = offsetY.value;
    })
    .onUpdate((event) => {
      const imgWidth = baseImageSize.width * scale.value;
      const imgHeight = baseImageSize.height * scale.value;
      const minX = frameWidth - imgWidth;
      const minY = frameHeight - imgHeight;

      const newX = savedOffsetX.value + event.translationX;
      const newY = savedOffsetY.value + event.translationY;

      offsetX.value = Math.min(0, Math.max(minX, newX));
      offsetY.value = Math.min(0, Math.max(minY, newY));
    })
    .onEnd(() => {
      savedOffsetX.value = offsetX.value;
      savedOffsetY.value = offsetY.value;
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedImageStyle = useAnimatedStyle(() => {
    const imgWidth = baseImageSize.width * scale.value;
    const imgHeight = baseImageSize.height * scale.value;

    return {
      width: imgWidth,
      height: imgHeight,
      transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
    };
  });

  // Get current position from animation values
  const getCurrentPosition = useCallback((): ImagePosition => {
    const imgWidth = baseImageSize.width * scale.value;
    const imgHeight = baseImageSize.height * scale.value;
    const maxOffsetX = frameWidth - imgWidth;
    const maxOffsetY = frameHeight - imgHeight;

    const xRatio = maxOffsetX !== 0 ? offsetX.value / maxOffsetX : 0;
    const yRatio = maxOffsetY !== 0 ? offsetY.value / maxOffsetY : 0;

    return {
      xRatio: Math.max(0, Math.min(1, xRatio)),
      yRatio: Math.max(0, Math.min(1, yRatio)),
      scale: scale.value,
    };
  }, [baseImageSize, frameWidth, frameHeight]);

  // Handle next step
  const handleNext = useCallback(() => {
    const currentPos = getCurrentPosition();
    setSavedListPosition(currentPos);
    setIsReady(false);
    setStep(2);
  }, [getCurrentPosition]);

  // Handle confirm
  const handleConfirm = useCallback(() => {
    const detailsPos = getCurrentPosition();

    onConfirm({
      listPosition: savedListPosition || detailsPos,
      detailsPosition: detailsPos,
    });
  }, [getCurrentPosition, savedListPosition, onConfirm]);

  // Frame position (centered in container)
  const frameTop =
    containerSize.height > 0 ? (containerSize.height - frameHeight) / 2 : 100;
  const frameLeft = padding;

  // Calculate full image dimensions for background preview
  const getFullImageSize = () => {
    if (imageNaturalSize.width === 0) return { width: 0, height: 0 };

    const imageAspect = imageNaturalSize.width / imageNaturalSize.height;
    const availableWidth = SCREEN_WIDTH;
    const availableHeight = containerSize.height || SCREEN_HEIGHT * 0.6;

    let w, h;
    if (imageAspect > availableWidth / availableHeight) {
      w = availableWidth;
      h = w / imageAspect;
    } else {
      h = availableHeight;
      w = h * imageAspect;
    }
    return { width: w, height: h };
  };

  const fullImageSize = getFullImageSize();

  const stepTitles = {
    1: "Posição na Lista",
    2: "Posição nos Detalhes",
  };

  const stepHints = {
    1: "Arraste para ajustar a imagem do cartão",
    2: "Arraste para ajustar a imagem dos detalhes",
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      statusBarTranslucent
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={[styles.container, { backgroundColor: "#000" }]}>
          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <X size={24} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Text style={styles.title}>{stepTitles[step]}</Text>
              <Text style={styles.stepIndicator}>Passo {step} de 2</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.headerButton,
                styles.confirmButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={step === 1 ? handleNext : handleConfirm}
              activeOpacity={0.7}
            >
              {step === 1 ? (
                <ChevronRight size={24} color="#FFF" />
              ) : (
                <Check size={24} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>

          {/* Image Area */}
          <View style={styles.imageArea} onLayout={onContainerLayout}>
            {/* Full image preview (background) */}
            {imageNaturalSize.width > 0 && (
              <View
                style={[
                  styles.fullImageContainer,
                  {
                    width: fullImageSize.width,
                    height: fullImageSize.height,
                    top:
                      containerSize.height > 0
                        ? (containerSize.height - fullImageSize.height) / 2
                        : 0,
                    left: (SCREEN_WIDTH - fullImageSize.width) / 2,
                  },
                ]}
                pointerEvents="none"
              >
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: "100%", height: "100%", opacity: 0.5 }}
                  contentFit="cover"
                />
              </View>
            )}

            {isReady && (
              <>
                {/* Frame container */}
                <View
                  style={[
                    styles.frameContainer,
                    {
                      top: frameTop,
                      left: frameLeft,
                      width: frameWidth,
                      height: frameHeight,
                    },
                  ]}
                >
                  <GestureDetector gesture={composedGesture}>
                    <Animated.View
                      style={[styles.imageWrapper, animatedImageStyle]}
                    >
                      <Image
                        source={{ uri: imageUri }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                      />
                    </Animated.View>
                  </GestureDetector>

                  <View style={styles.frameBorder} pointerEvents="none" />
                </View>

                {/* Overlays */}
                <View
                  style={[
                    styles.overlay,
                    { top: 0, left: 0, right: 0, height: frameTop },
                  ]}
                  pointerEvents="none"
                />
                <View
                  style={[
                    styles.overlay,
                    {
                      top: frameTop + frameHeight,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    },
                  ]}
                  pointerEvents="none"
                />
                <View
                  style={[
                    styles.overlay,
                    {
                      top: frameTop,
                      left: 0,
                      width: frameLeft,
                      height: frameHeight,
                    },
                  ]}
                  pointerEvents="none"
                />
                <View
                  style={[
                    styles.overlay,
                    {
                      top: frameTop,
                      right: 0,
                      width: frameLeft,
                      height: frameHeight,
                    },
                  ]}
                  pointerEvents="none"
                />
              </>
            )}

            {!isReady && (
              <View style={styles.loading}>
                <Text style={styles.loadingText}>A carregar...</Text>
              </View>
            )}
          </View>

          {/* Bottom: Stepper + Hint */}
          <View
            style={[
              styles.bottomContainer,
              { paddingBottom: insets.bottom + 16 },
            ]}
          >
            {/* Stepper dots */}
            <View style={styles.stepper}>
              <View
                style={[styles.stepDot, step >= 1 && styles.stepDotActive]}
              />
              <View
                style={[styles.stepLine, step >= 2 && styles.stepLineActive]}
              />
              <View
                style={[styles.stepDot, step >= 2 && styles.stepDotActive]}
              />
            </View>

            {/* Hint */}
            <View style={styles.hintPill}>
              <Move size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.hintText}>{stepHints[step]}</Text>
            </View>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    zIndex: 100,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButton: {},
  titleContainer: {
    alignItems: "center",
  },
  title: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  stepIndicator: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginTop: 2,
  },
  imageArea: {
    flex: 1,
    position: "relative",
  },
  fullImageContainer: {
    position: "absolute",
  },
  frameContainer: {
    position: "absolute",
    overflow: "hidden",
    borderRadius: 16,
  },
  imageWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  overlay: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  frameBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
    borderRadius: 16,
    zIndex: 10,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
  },
  bottomContainer: {
    alignItems: "center",
    paddingTop: 16,
    gap: 16,
    zIndex: 100,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  stepDotActive: {
    backgroundColor: "#3B82F6",
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  stepLineActive: {
    backgroundColor: "#3B82F6",
  },
  hintPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  hintText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "500",
  },
});
