import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated } from "react-native";
import * as SplashScreen from "expo-splash-screen";

interface AnimatedSplashScreenProps {
  onFinish: () => void;
}

export const AnimatedSplashScreen = ({
  onFinish,
}: AnimatedSplashScreenProps) => {
  const opacity = useRef(new Animated.Value(1)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.8)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const hasFinished = useRef(false);

  useEffect(() => {
    // Hide native splash immediately
    SplashScreen.hideAsync();

    // Animate title appearance
    Animated.parallel([
      Animated.spring(titleScale, {
        toValue: 1,
        friction: 8,
        tension: 20,
        useNativeDriver: true,
      }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate progress bar
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Finish after 2.5 seconds
    const timer = setTimeout(() => {
      if (!hasFinished.current) {
        hasFinished.current = true;
        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          onFinish();
        });
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        { opacity, zIndex: 99999, backgroundColor: "#000" },
      ]}
    >
      {/* Overlay Content */}
      <View style={styles.overlay}>
        <View style={styles.titleContainer}>
          <Animated.Image
            source={require("@/assets/images/splash-title.png")}
            style={[
              styles.appLogo,
              {
                opacity: titleOpacity,
                transform: [{ scale: titleScale }],
              },
            ]}
            resizeMode="contain"
          />
        </View>

        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  appLogo: {
    width: "80%",
    height: 120,
    maxWidth: 350,
  },
  progressContainer: {
    position: "absolute",
    bottom: 80,
    width: "60%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
});
