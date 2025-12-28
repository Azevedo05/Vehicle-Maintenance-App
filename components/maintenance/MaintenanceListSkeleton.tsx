import React from "react";
import { View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { createStyles } from "@/styles/maintenance.styles";
import { Skeleton } from "@/components/ui/Skeleton";

export const MaintenanceListSkeleton = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.scrollContent}>
      {/* Header Buttons Skeleton */}
      <View style={[styles.header, { marginBottom: 24 }]}>
        <Skeleton width={150} height={34} borderRadius={8} />
        <View style={styles.headerButtons}>
          <Skeleton width={80} height={32} borderRadius={16} />
          <Skeleton width={32} height={32} borderRadius={16} />
        </View>
      </View>

      {/* Summary Card Skeleton */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Skeleton
            width={60}
            height={14}
            borderRadius={4}
            style={{ marginBottom: 4 }}
          />
          <Skeleton width={30} height={28} borderRadius={4} />
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Skeleton
            width={60}
            height={14}
            borderRadius={4}
            style={{ marginBottom: 4 }}
          />
          <Skeleton width={30} height={28} borderRadius={4} />
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Skeleton
            width={60}
            height={14}
            borderRadius={4}
            style={{ marginBottom: 4 }}
          />
          <Skeleton width={30} height={28} borderRadius={4} />
        </View>
      </View>

      {/* Quick Filters Skeleton */}
      <Skeleton
        width="100%"
        height={40}
        borderRadius={12}
        style={{ marginBottom: 16 }}
      />

      {/* Task List Skeleton */}
      <View style={{ gap: 12 }}>
        {[1, 2, 3, 4].map((key) => (
          <View key={key} style={[styles.taskCard, { height: 80 }]}>
            <View style={{ flex: 1, gap: 8 }}>
              <Skeleton width="60%" height={18} borderRadius={4} />
              <Skeleton width="40%" height={14} borderRadius={4} />
              <Skeleton width="30%" height={14} borderRadius={4} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
