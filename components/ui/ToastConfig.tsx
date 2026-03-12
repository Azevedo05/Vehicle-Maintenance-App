import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Easing,
  Platform,
} from "react-native";
import Toast, { BaseToastProps, ToastConfig } from "react-native-toast-message";
import { useTheme } from "@/contexts/ThemeContext";

// Define the structure of our custom props
interface CustomToastProps {
  actionLabel?: string;
  onAction?: () => void;
  description?: string;
  toastId?: number; // Unique ID to force animation restart
}

// Extend BaseToastProps to include our internal props structure from the library
type ToastProps = BaseToastProps & {
  props?: CustomToastProps;
};

const ToastMessage = ({
  text1,
  text2,
  type,
  props,
}: {
  text1?: string;
  text2?: string;
  type: "success" | "error" | "info" | "warning";
  props?: CustomToastProps;
}) => {
  const { colors } = useTheme();

  useEffect(() => {
    // No-op - removed progress bar animation
  }, [text1, text2, type, props?.actionLabel, props?.toastId]);

  const handleAction = () => {
    if (props?.onAction) {
      props.onAction();
      Toast.hide();
    }
  };

  // Determine if this is a short/simple toast (only text1, no text2 or action)
  const isCompact = !text2 && !props?.actionLabel;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, shadowColor: "#000" },
        isCompact && styles.containerCompact,
      ]}
    >
      <View
        style={[
          styles.contentContainer,
          isCompact && styles.contentContainerCompact,
        ]}
      >
        {/* Icon logic removed */}
        <View
          style={[
            styles.textContainer,
            isCompact && styles.textContainerCompact,
          ]}
        >
          {text1 && (
            <Text
              style={[
                styles.title,
                { color: colors.text },
                isCompact && styles.titleCompact,
              ]}
            >
              {text1}
            </Text>
          )}
          {text2 && (
            <Text
              style={[styles.description, { color: colors.text, opacity: 0.7 }]}
            >
              {text2}
            </Text>
          )}
        </View>

        {props?.actionLabel && (
          <React.Fragment>
            <View
              style={[styles.separator, { backgroundColor: colors.border }]}
            />
            <TouchableOpacity
              onPress={handleAction}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.actionLabel, { color: colors.primary }]}>
                {props.actionLabel}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    borderRadius: 16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 100,
    zIndex: 9999,
    marginTop: 10,
    overflow: "hidden", // Highlight: Ensure progress bar stays inside rounded corners
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    fontWeight: "500",
  },
  separator: {
    width: 1,
    height: 24,
    marginHorizontal: 12,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  // Compact styles for short toasts (only text1, no text2 or action)
  containerCompact: {
    width: "auto",
    alignSelf: "center",
    minWidth: 120,
    maxWidth: "70%",
  },
  contentContainerCompact: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  textContainerCompact: {
    flex: 0,
    alignItems: "center",
  },
  titleCompact: {
    marginBottom: 0,
    textAlign: "center",
  },
});

export const toastConfig: ToastConfig = {
  success: (props) => <ToastMessage {...props} type="success" />,
  error: (props) => <ToastMessage {...props} type="error" />,
  info: (props) => <ToastMessage {...props} type="info" />,
  warning: (props) => <ToastMessage {...props} type="warning" />,
};
