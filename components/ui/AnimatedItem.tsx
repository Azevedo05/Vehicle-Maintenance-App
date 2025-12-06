import React, { useEffect } from "react";
import { ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface AnimatedItemProps {
  children: React.ReactNode;
  index: number;
  delay?: number;
  style?: ViewStyle;
}

export const AnimatedItem = ({
  children,
  index,
  delay = 0,
  style,
}: AnimatedItemProps) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const totalDelay = Math.min(index * 50, 300); // Stagger by 50ms, max 300ms delay

    opacity.value = withDelay(totalDelay, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(
      totalDelay,
      withSpring(0, { damping: 20, stiffness: 300 })
    );
  }, [delay, index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
};
