import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface AnimatedTabIconProps {
  focused: boolean;
  children: React.ReactNode;
}

export const AnimatedTabIcon = ({
  focused,
  children,
}: AnimatedTabIconProps) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (focused) {
      // "Pop" effect when selected
      scale.value = withSequence(
        withTiming(1.2, { duration: 100 }),
        withSpring(1.1, { damping: 10, stiffness: 100 }) // Slightly larger when active
      );
      translateY.value = withSpring(-2, { damping: 10 }); // Slight lift
    } else {
      scale.value = withSpring(1, { damping: 10 });
      translateY.value = withSpring(0);
    }
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
    };
  });

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};
