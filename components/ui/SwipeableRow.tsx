import React, { useRef } from "react";
import { Animated, StyleSheet, View, I18nManager } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Trash2, Pencil } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface SwipeableRowProps {
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  borderRadius?: number;
}

export const SwipeableRow = ({
  children,
  onEdit,
  onDelete,
  borderRadius = 16,
}: SwipeableRowProps) => {
  const { colors } = useTheme();
  const swipeableRow = useRef<Swipeable>(null);

  const close = () => {
    swipeableRow.current?.close();
  };

  const renderRightAction = (
    text: string,
    color: string,
    x: number,
    progress: Animated.AnimatedInterpolation<number>,
    icon: React.ReactNode,
    onPress?: () => void
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });

    const pressHandler = () => {
      close();
      onPress?.();
    };

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: "transparent" }]}
          onPress={pressHandler}
        >
          <View
            style={[
              styles.actionButton,
              { backgroundColor: color, borderRadius: borderRadius },
            ]}
          >
            {icon}
          </View>
        </RectButton>
      </Animated.View>
    );
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    _dragAnimatedValue: Animated.AnimatedInterpolation<number>
  ) => {
    const width = 80; // Wider area for spacing

    return (
      <View
        style={{
          width: (onEdit ? width : 0) + (onDelete ? width : 0),
          flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
        }}
      >
        {onEdit &&
          renderRightAction(
            "Edit",
            colors.primary,
            width,
            progress,
            <Pencil size={20} color="#FFFFFF" />,
            onEdit
          )}
        {onDelete &&
          renderRightAction(
            "Delete",
            colors.error,
            onEdit ? width * 2 : width,
            progress,
            <Trash2 size={20} color="#FFFFFF" />,
            onDelete
          )}
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRow}
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={renderRightActions}
      containerStyle={styles.container}
    >
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "visible",
  },
  rightAction: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  actionButton: {
    width: 64,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
