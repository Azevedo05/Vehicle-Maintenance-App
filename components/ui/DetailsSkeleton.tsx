import React from "react";
import { View, StyleSheet } from "react-native";

interface DetailsSkeletonProps {
  overlapping?: boolean;
}

export const DetailsSkeleton = ({
  overlapping = true,
}: DetailsSkeletonProps) => (
  <View
    style={[
      styles.detailsCurve,
      !overlapping && { height: "auto", minHeight: 200, flex: 0 },
    ]}
  >
    <View style={styles.skeletonContent}>
      {/* Vehicle Title Row */}
      <View style={styles.skeletonHeaderRow}>
        <View style={styles.skeletonTitleGroup}>
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonPlate} />
        </View>
        <View style={styles.skeletonIcon} />
      </View>

      {/* Stats Row */}
      <View style={styles.skeletonStatsRow}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.skeletonStatColumn}>
            <View style={styles.skeletonStatLabel} />
            <View style={styles.skeletonStatValue} />
          </View>
        ))}
      </View>

      {/* Additional Sections */}
      {!overlapping && (
        <>
          <View style={styles.skeletonSection}>
            <View style={styles.skeletonBigNumber} />
          </View>
          <View style={styles.skeletonEmptyCard}>
            <View style={styles.skeletonEmptyText} />
          </View>
        </>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  detailsCurve: {
    width: "100%",
    height: 1000,
    backgroundColor: "#050505",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingTop: 32,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  skeletonContent: {
    gap: 16,
  },
  skeletonHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  skeletonTitleGroup: {
    flex: 1,
  },
  skeletonTitle: {
    width: "70%",
    height: 28,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 6,
    marginBottom: 8,
  },
  skeletonPlate: {
    width: 80,
    height: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 4,
  },
  skeletonIcon: {
    width: 32,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 8,
  },
  skeletonStatsRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 32,
    marginBottom: 28,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
  skeletonStatColumn: {
    alignItems: "flex-start",
  },
  skeletonStatLabel: {
    width: 60,
    height: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 3,
    marginBottom: 6,
  },
  skeletonStatValue: {
    width: 50,
    height: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
  },
  skeletonSection: {
    marginBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
  skeletonBigNumber: {
    width: 120,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 6,
  },
  skeletonEmptyCard: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  skeletonEmptyText: {
    width: "100%",
    height: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 4,
  },
});
