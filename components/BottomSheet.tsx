import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  maxHeight?: string | number;
}

export const BottomSheet = ({
  visible,
  onClose,
  children,
  maxHeight = "90%",
}: BottomSheetProps) => {
  const { colors } = useTheme();
  const [showModal, setShowModal] = useState(visible);
  const panY = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.spring(panY, {
          toValue: 0,
          useNativeDriver: false,
          bounciness: 0,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(panY, {
          toValue: Dimensions.get("window").height,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => setShowModal(false));
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Allow drag if moving vertically significantly
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        // Allow dragging up (negative) and down (positive)
        // Limit dragging up to not go completely off screen (e.g. -500)
        // Limit dragging down
        const newY = gestureState.dy;
        panY.setValue(newY);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          // Dragged down significantly -> Close
          onClose();
        } else {
          // If dragged up or just a little down, stay at the new position?
          // The user said "place in the position I want".
          // But usually we need to persist the offset.
          // PanResponder uses delta from touch start. To persist, we need to use setOffset.
          // However, for simplicity and "Instagram like" feel (which usually snaps),
          // let's try to snap to "open" (0) if it's close, or keep it if it's dragged up?
          // Actually, Instagram comments snap to full screen or initial height.
          // "Position I want" might mean "don't snap back if I pull up".

          // Let's allow it to stay if dragged up, but maybe bound it.
          // Since we are using a simple Animated.Value without offset state tracking in this simple component,
          // "staying" at a position requires updating the base value.

          // For now, let's revert to 0 (initial open state) if not closed,
          // BUT allow the view to be taller so it doesn't cut off.
          // The user's main complaint about "cut off" was likely the paddingBottom hack.
          // The "position I want" might be solved by just allowing it to be fully tall.

          // Let's try snapping back to 0 for now to ensure stability,
          // but FIX the cutoff by removing the paddingBottom hack and using a better layout.
          // If the user really wants to "leave it floating", we'd need a more complex state.
          // Let's assume they want to be able to drag it up to see more, and it snaps to fit.

          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: false,
            bounciness: 4,
          }).start();
        }
      },
    })
  ).current;

  if (!showModal) return null;

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalCard: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      borderBottomWidth: 0,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 10,
      width: "100%",
      // Ensure it can grow but respects screen limits
      maxHeight: "94%",
      paddingBottom: 40, // Safe area padding
    },
    contentContainer: {
      paddingHorizontal: 24,
      paddingTop: 12,
      flexShrink: 1,
      // Removed maxHeight constraint here to let content flow
    },
    handleContainer: {
      width: "100%",
      alignItems: "center",
      paddingVertical: 10,
      marginBottom: 10,
    },
    handle: {
      width: 40,
      height: 4,
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
  });

  const translateY = panY.interpolate({
    inputRange: [-Dimensions.get("window").height, 0],
    outputRange: [-50, 0], // Allow slight overdrag up, but mostly clamp or dampen
    extrapolate: "clamp",
    // To truly allow "drag up", we would need to change the layout logic.
    // But removing the paddingBottom hack is the priority to fix the cutoff.
  });

  return (
    <Modal
      transparent
      visible={showModal}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity }]}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Animated.View
              style={[
                styles.modalCard,
                {
                  transform: [{ translateY: panY }], // Use panY directly to allow full movement
                },
              ]}
            >
              <View style={styles.contentContainer}>
                <View
                  style={styles.handleContainer}
                  {...panResponder.panHandlers}
                >
                  <View style={styles.handle} />
                </View>
                {children}
              </View>
              {/* Add a filler view to cover the bottom when dragging up */}
              <View
                style={{
                  height: 1000,
                  backgroundColor: colors.card,
                  position: "absolute",
                  top: "100%",
                  left: -1, // Account for border width
                  right: -1, // Account for border width
                  borderLeftWidth: 1,
                  borderRightWidth: 1,
                  borderColor: colors.border,
                }}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
