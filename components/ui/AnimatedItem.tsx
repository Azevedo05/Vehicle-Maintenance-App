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
    const totalDelay = delay + index * 100; // Stagger by 100ms per item

    opacity.value = withDelay(totalDelay, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(
      totalDelay,
      withSpring(0, { damping: 25, stiffness: 250 })
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
