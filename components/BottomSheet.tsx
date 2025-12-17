import React, { useCallback, useMemo, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
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
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // Handle visibility changes
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  // Handle dismiss callback
  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  // Render backdrop
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  // Custom handle component
  const renderHandle = useCallback(
    () => (
      <View style={styles.handleContainer}>
        <View style={[styles.handle, { backgroundColor: colors.primary }]} />
      </View>
    ),
    [colors.primary]
  );

  // Dynamic styles
  const containerStyle = useMemo(
    () => ({
      backgroundColor: colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      borderBottomWidth: 0,
    }),
    [colors.card, colors.border]
  );

  const contentContainerStyle = useMemo(
    () => ({
      paddingHorizontal: 24,
      paddingTop: 12,
      paddingBottom: 40,
    }),
    []
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enableDynamicSizing={true}
      maxDynamicContentSize={Dimensions.get("window").height * 0.9}
      enablePanDownToClose={true}
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      handleComponent={renderHandle}
      backgroundStyle={containerStyle}
      style={styles.bottomSheet}
    >
      <BottomSheetScrollView
        style={contentContainerStyle}
        contentContainerStyle={{ paddingBottom: 40 }}
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  handleContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 22,
    paddingBottom: 10,
    marginBottom: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
});
