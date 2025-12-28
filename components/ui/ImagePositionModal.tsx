import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
  Dimensions,
  Image as RNImage,
  ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Image } from "expo-image";
import {
  X,
  Check,
  ChevronRight,
  Maximize2,
  AlignCenter,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  MoveHorizontal,
  MoveVertical,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";
import { VehicleImage } from "./VehicleImage";
import { DetailsSkeleton } from "./DetailsSkeleton";
import { createImagePositionModalStyles } from "@/styles/ui/ImagePositionModal.styles";

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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

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
  const styles = createImagePositionModalStyles(colors);

  const [step, setStep] = useState<1 | 2>(1);
  const [isReady, setIsReady] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [containerHeight, setContainerHeight] = useState(0);
  const [savedListPosition, setSavedListPosition] =
    useState<ImagePosition | null>(null);

  const currentAspectRatio = step === 1 ? listAspectRatio : detailsAspectRatio;
  const padding = step === 1 ? 24 : 0;
  const frameWidth = SCREEN_WIDTH - padding * 2;
  // Step 2 usa uma altura fixa como a página real de detalhes
  // Usamos 350 para caber melhor em ecrãs pequenos mantendo o aspeto "alto"
  const bannerHeight = 350;
  const frameHeight =
    step === 1 ? frameWidth / currentAspectRatio : bannerHeight;

  const [baseSize, setBaseSize] = useState({ width: 0, height: 0 });

  // Estado de controlo - usando shared values (para animação) e React state (para leitura)
  const scale = useSharedValue(1);
  const posX = useSharedValue(0.5);
  const posY = useSharedValue(0.5);

  // Mirrors do estado React para leitura fiável
  const [currentScale, setCurrentScale] = useState(1);
  const [currentPosX, setCurrentPosX] = useState(0.5);
  const [currentPosY, setCurrentPosY] = useState(0.5);

  // Load Image Size
  useEffect(() => {
    if (visible && imageUri) {
      setIsReady(false);
      setStep(1);
      RNImage.getSize(
        imageUri,
        (w, h) => {
          setImageSize({ width: w, height: h });
        },
        (err) => console.error(err)
      );
    }
  }, [visible, imageUri]);

  // Calculate Base Size (Cover)
  useEffect(() => {
    if (imageSize.width > 0) {
      const imgAspect = imageSize.width / imageSize.height;
      const frameAspect = frameWidth / frameHeight;
      let bw, bh;
      if (imgAspect > frameAspect) {
        bh = frameHeight;
        bw = bh * imgAspect;
      } else {
        bw = frameWidth;
        bh = bw / imgAspect;
      }
      setBaseSize({ width: bw, height: bh });
    }
  }, [imageSize, frameWidth, frameHeight]);

  // Initial values for current step
  useEffect(() => {
    if (baseSize.width > 0 && containerHeight > 0) {
      const initial = step === 1 ? initialListPosition : initialDetailsPosition;
      const newScale = initial?.scale || 1;
      const newPosX = initial?.xRatio ?? 0.5;
      const newPosY = initial?.yRatio ?? 0.5;

      // Update both shared values and React state
      scale.value = newScale;
      posX.value = newPosX;
      posY.value = newPosY;
      setCurrentScale(newScale);
      setCurrentPosX(newPosX);
      setCurrentPosY(newPosY);

      setIsReady(true);
    }
  }, [step, baseSize, containerHeight]);

  // Animated Style for the Image
  const animatedImageStyle = useAnimatedStyle(() => {
    const s = scale.value;
    const currentW = baseSize.width * s;
    const currentH = baseSize.height * s;

    // Full freedom image movement
    const tx = posX.value * (frameWidth + currentW) - currentW;
    const ty = posY.value * (frameHeight + currentH) - currentH;

    return {
      width: currentW,
      height: currentH,
      transform: [{ translateX: tx }, { translateY: ty }],
    };
  });

  const getCurrentPosition = (): ImagePosition => {
    // Read from React state (reliable) instead of shared values
    return {
      xRatio: currentPosX,
      yRatio: currentPosY,
      scale: currentScale,
    };
  };

  // Helper to get clamped position values (keeps image covering the frame)
  const getClampedPosition = (
    axis: "x" | "y",
    edge: "start" | "center" | "end"
  ) => {
    const s = scale.value;
    const currentW = baseSize.width * s;
    const currentH = baseSize.height * s;
    const size = axis === "x" ? currentW : currentH;
    const frame = axis === "x" ? frameWidth : frameHeight;

    // Calculate the range that keeps image covering the frame
    const minPos = frame / (frame + size); // right/bottom edge aligned
    const maxPos = size / (frame + size); // left/top edge aligned

    if (edge === "start") return minPos;
    if (edge === "end") return maxPos;
    return 0.5; // center
  };

  const headerHeight = insets.top + 90;
  // Step 2: image starts below the navigation header (simulating details page top)
  const frameTop =
    step === 1
      ? containerHeight > 0
        ? (containerHeight - frameHeight) / 2
        : 100
      : headerHeight;

  const PresetButton = ({
    icon: Icon,
    onPress,
    label,
  }: {
    icon: any;
    onPress: () => void;
    label: string;
  }) => (
    <TouchableOpacity style={styles.presetButton} onPress={onPress}>
      <Icon size={18} color="#FFF" />
      <Text style={styles.presetLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* Workspace */}
        <View
          style={styles.workspace}
          onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
        >
          {isReady && (
            <View style={StyleSheet.absoluteFill}>
              {/* Dimmed Background */}
              <View
                style={[
                  styles.backgroundFullCover,
                  { top: frameTop, left: padding },
                ]}
                pointerEvents="none"
              >
                <Animated.View style={animatedImageStyle}>
                  <Image
                    source={{ uri: imageUri }}
                    style={{ width: "100%", height: "100%", opacity: 0.4 }}
                  />
                </Animated.View>
              </View>

              {/* Step 1 Central Focus Dimming Overlay */}
              {step === 1 && (
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: "rgba(0,0,0,0.6)" },
                  ]}
                  pointerEvents="none"
                />
              )}

              {/* Active Frame area */}
              <View
                style={[
                  styles.frameContainer,
                  {
                    top: frameTop,
                    left: padding,
                    width: frameWidth,
                    height: frameHeight,
                    borderRadius: step === 1 ? 24 : 0,
                  },
                ]}
              >
                <Animated.View
                  style={[styles.imageWrapper, animatedImageStyle]}
                >
                  <Image
                    source={{ uri: imageUri }}
                    style={{ width: "100%", height: "100%" }}
                  />
                </Animated.View>
                {step === 1 && (
                  <View style={styles.frameBorder} pointerEvents="none" />
                )}
              </View>

              {/* Step 2 "Página de Detalhes" Mock Curve with Skeleton Content */}
              {/* Step 2 "Página de Detalhes" Mock Curve with Skeleton Content */}
              {step === 2 && (
                <View
                  style={[
                    styles.detailsCurveContainer,
                    { top: frameTop + frameHeight - 80, bottom: 0 },
                  ]}
                  pointerEvents="none"
                >
                  <DetailsSkeleton overlapping={false} />
                </View>
              )}

              {/* Step 2 Header Overlay - hides image bleeding into header */}
              {step === 2 && (
                <View
                  style={[styles.headerOverlay, { height: frameTop }]}
                  pointerEvents="none"
                />
              )}
            </View>
          )}

          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
            <TouchableOpacity style={styles.headerButton} onPress={onCancel}>
              <X size={24} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {step === 2 ? "Banner dos Detalhes" : "Miniatura dos Cartões"}
              </Text>
              <Text style={styles.stepIndicator}>
                {`Ajuste o posicionamento • ${step}/2`}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.headerButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                const current = getCurrentPosition();
                if (step === 1) {
                  setSavedListPosition(current);
                  setStep(2);
                  setIsReady(false);
                } else {
                  onConfirm({
                    listPosition: savedListPosition!,
                    detailsPosition: current,
                  });
                }
              }}
            >
              <Check size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Step 3 removido conforme solicitado */}

        {/* Painel de controlos flutuante para os passos 1 e 2 */}
        {true && (
          <View
            style={[
              styles.controlsPanel,
              { paddingBottom: insets.bottom + 16 },
            ]}
          >
            <View style={styles.controlsContent}>
              {/* Zoom */}
              <View style={styles.sliderRow}>
                <Maximize2 size={16} color="rgba(255,255,255,0.4)" />
                <Slider
                  style={styles.slider}
                  minimumValue={0.2}
                  maximumValue={3}
                  value={currentScale}
                  onValueChange={(v: number) => {
                    scale.value = v;
                    setCurrentScale(v);
                  }}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor="rgba(255,255,255,0.1)"
                  thumbTintColor="#FFF"
                />
              </View>

              {/* X Position */}
              <View style={styles.sliderRow}>
                <MoveHorizontal size={16} color="rgba(255,255,255,0.4)" />
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={currentPosX}
                  onValueChange={(v: number) => {
                    posX.value = v;
                    setCurrentPosX(v);
                  }}
                  minimumTrackTintColor="rgba(255,255,255,0.2)"
                  maximumTrackTintColor="rgba(255,255,255,0.1)"
                  thumbTintColor="#FFF"
                />
              </View>

              {/* Y Position */}
              <View style={styles.sliderRow}>
                <MoveVertical size={16} color="rgba(255,255,255,0.4)" />
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={currentPosY}
                  onValueChange={(v: number) => {
                    posY.value = v;
                    setCurrentPosY(v);
                  }}
                  minimumTrackTintColor="rgba(255,255,255,0.2)"
                  maximumTrackTintColor="rgba(255,255,255,0.1)"
                  thumbTintColor="#FFF"
                />
              </View>

              {/* Quick Actions */}
              <View style={styles.presetsWrapper}>
                <PresetButton
                  icon={AlignCenter}
                  label="Centro"
                  onPress={() => {
                    posX.value = withTiming(0.5);
                    posY.value = withTiming(0.5);
                    setCurrentPosX(0.5);
                    setCurrentPosY(0.5);
                  }}
                />
                <PresetButton
                  icon={ChevronUp}
                  label="Topo"
                  onPress={() => {
                    const val = getClampedPosition("y", "end");
                    posY.value = withTiming(val);
                    setCurrentPosY(val);
                  }}
                />
                <PresetButton
                  icon={ChevronDown}
                  label="Base"
                  onPress={() => {
                    const val = getClampedPosition("y", "start");
                    posY.value = withTiming(val);
                    setCurrentPosY(val);
                  }}
                />
                <PresetButton
                  icon={ChevronLeft}
                  label="Esq."
                  onPress={() => {
                    const val = getClampedPosition("x", "end");
                    posX.value = withTiming(val);
                    setCurrentPosX(val);
                  }}
                />
                <PresetButton
                  icon={ChevronRightIcon}
                  label="Dir."
                  onPress={() => {
                    const val = getClampedPosition("x", "start");
                    posX.value = withTiming(val);
                    setCurrentPosX(val);
                  }}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};
