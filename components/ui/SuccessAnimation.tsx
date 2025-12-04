import React, { useEffect } from "react";
import { View, StyleSheet, Modal } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import { Check } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface SuccessAnimationProps {
  visible: boolean;
  onAnimationFinish?: () => void;
}

export const SuccessAnimation = ({
  visible,
  onAnimationFinish,
}: SuccessAnimationProps) => {
  const { colors } = useTheme();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = 0;
      opacity.value = 1;
      scale.value = withSequence(
        withSpring(1.2),
        withSpring(1),
        withDelay(
          500,
          withSpring(0, {}, (finished) => {
            if (finished && onAnimationFinish) {
              runOnJS(onAnimationFinish)();
            }
          })
        )
      );
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.container}>
        <Animated.View
          style={[styles.card, { backgroundColor: colors.card }, animatedStyle]}
        >
          <View style={[styles.circle, { backgroundColor: colors.primary }]}>
            <Check size={48} color="#FFFFFF" strokeWidth={3} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  card: {
    padding: 32,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
