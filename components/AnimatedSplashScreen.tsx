import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  Text,
  Image,
} from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import * as SplashScreen from "expo-splash-screen";

interface AnimatedSplashScreenProps {
  onFinish: () => void;
}

export const AnimatedSplashScreen = ({
  onFinish,
}: AnimatedSplashScreenProps) => {
  const [lastStatus, setLastStatus] = useState<AVPlaybackStatus | null>(null);
  const videoRef = useRef<Video>(null);
  const opacity = useRef(new Animated.Value(1)).current;
  const progress = useRef(new Animated.Value(0)).current;

  const hasFinished = useRef(false);

  // Animation values for Title
  const titleScale = useRef(new Animated.Value(0.8)).current; // Start slightly smaller
  const titleOpacity = useRef(new Animated.Value(0)).current; // Start invisible

  useEffect(() => {
    // Delay animation start to give "sensation of appearing" later
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.spring(titleScale, {
          toValue: 1,
          friction: 8,
          tension: 20, // Gentler spring
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 2000, // Slow fade in (2 seconds) for "appearing" sensation
          useNativeDriver: true,
        }),
      ]).start();
    }, 1000); // Wait 1 second before showing title

    return () => clearTimeout(timer);
  }, []);

  const onPlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      // Hide native splash once video is ready
      await SplashScreen.hideAsync();

      // Update progress bar
      if (status.durationMillis) {
        // Calculate progress based on 3000ms target (max duration), capped at 100%
        const currentProgress = Math.min(status.positionMillis / 3000, 1);
        Animated.timing(progress, {
          toValue: currentProgress,
          duration: 250,
          useNativeDriver: false,
        }).start();
      }

      setLastStatus(status);

      // Auto-dismiss when finished OR after 3 seconds
      const shouldFinish = status.didJustFinish || status.positionMillis > 3000;

      if (shouldFinish && !hasFinished.current) {
        hasFinished.current = true;
        // Ensure progress bar fills if finishing early or on time
        progress.setValue(1);

        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          onFinish();
        });
      }
    }
  };

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        { opacity, zIndex: 99999, backgroundColor: "#000" },
      ]}
    >
      <Video
        ref={videoRef}
        style={StyleSheet.absoluteFill}
        source={require("@/assets/4489810-uhd_2160_4096_25fps.mp4")}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        rate={1.0}
        isLooping={false}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        onError={(e) => {
          console.error("Splash video error:", e);
          onFinish();
        }}
      />

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
    justifyContent: "space-between",
    paddingTop: 50, // Reduced top padding
    paddingBottom: 40, // Reduced bottom padding
    alignItems: "center",
    overflow: "hidden",
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 20, // Lower it slightly (subtle)
    width: "100%",
    paddingHorizontal: 20,
  },
  appLogo: {
    width: "100%",
    height: 160, // Increased size
    maxWidth: 450, // Allow it to perform bigger
  },
  progressContainer: {
    width: "70%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 30, // Reduced bottom margin
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
});
