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
      // When not overlapping (in ImagePositionModal), fill all available space
      !overlapping && { flex: 1, minHeight: 600 },
    ]}
  >
    <View style={styles.skeletonContent}>
      {/* Vehicle Header Row - Title + Category Badge */}
      <View style={styles.skeletonHeaderRow}>
        <View style={styles.skeletonTitleGroup}>
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonPlate} />
        </View>
        <View style={styles.skeletonCategoryBadge} />
      </View>

      {/* Stats Row - Year, Mileage, Fuel */}
      <View style={styles.skeletonStatsRow}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.skeletonStatColumn}>
            <View style={styles.skeletonStatLabel} />
            <View style={styles.skeletonStatValue} />
          </View>
        ))}
      </View>

      {/* Technical Specs Section */}
      <View style={styles.skeletonSectionHeader}>
        <View style={styles.skeletonSectionTitle} />
      </View>
      <View style={styles.skeletonSpecsGrid}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.skeletonSpecItem}>
            <View style={styles.skeletonSpecIcon} />
            <View style={styles.skeletonSpecText} />
          </View>
        ))}
      </View>

      {/* Quick Reminders Section */}
      <View style={styles.skeletonSectionHeader}>
        <View style={styles.skeletonSectionTitle} />
        <View style={styles.skeletonAddButton} />
      </View>
      <View style={styles.skeletonReminderCard}>
        <View style={styles.skeletonReminderIcon} />
        <View style={styles.skeletonReminderContent}>
          <View style={styles.skeletonReminderTitle} />
          <View style={styles.skeletonReminderDate} />
        </View>
      </View>

      {/* Maintenance Overview Section */}
      <View style={styles.skeletonSectionHeader}>
        <View style={styles.skeletonSectionTitle} />
      </View>
      <View style={styles.skeletonOverviewRow}>
        {[1, 2].map((i) => (
          <View key={i} style={styles.skeletonOverviewCard}>
            <View style={styles.skeletonOverviewValue} />
            <View style={styles.skeletonOverviewLabel} />
          </View>
        ))}
      </View>

      {/* Maintenance History Section */}
      <View style={styles.skeletonSectionHeader}>
        <View style={styles.skeletonSectionTitleWide} />
      </View>
      {[1, 2].map((i) => (
        <View key={i} style={styles.skeletonHistoryItem}>
          <View style={styles.skeletonHistoryIcon} />
          <View style={styles.skeletonHistoryContent}>
            <View style={styles.skeletonHistoryTitle} />
            <View style={styles.skeletonHistoryDetails} />
          </View>
          <View style={styles.skeletonHistoryAmount} />
        </View>
      ))}

      {/* Fuel Logs Section */}
      <View style={styles.skeletonSectionHeader}>
        <View style={styles.skeletonSectionTitle} />
      </View>
      <View style={styles.skeletonFuelCard}>
        <View style={styles.skeletonFuelIcon} />
        <View style={styles.skeletonFuelContent}>
          <View style={styles.skeletonFuelTitle} />
          <View style={styles.skeletonFuelDetails} />
        </View>
      </View>
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
    gap: 20,
  },
  // Header
  skeletonHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
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
  skeletonCategoryBadge: {
    width: 80,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 8,
  },
  // Stats Row
  skeletonStatsRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 32,
    paddingTop: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  skeletonStatColumn: {
    alignItems: "flex-start",
  },
  skeletonStatLabel: {
    width: 50,
    height: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 3,
    marginBottom: 6,
  },
  skeletonStatValue: {
    width: 60,
    height: 18,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
  },
  // Section Headers
  skeletonSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  skeletonSectionTitle: {
    width: 100,
    height: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 4,
  },
  skeletonSectionTitleWide: {
    width: 160,
    height: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 4,
  },
  skeletonAddButton: {
    width: 28,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
  },
  // Technical Specs
  skeletonSpecsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  skeletonSpecItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.03)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  skeletonSpecIcon: {
    width: 18,
    height: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 4,
  },
  skeletonSpecText: {
    width: 50,
    height: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 4,
  },
  // Quick Reminders
  skeletonReminderCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 16,
    borderRadius: 16,
  },
  skeletonReminderIcon: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
  },
  skeletonReminderContent: {
    flex: 1,
    gap: 6,
  },
  skeletonReminderTitle: {
    width: "60%",
    height: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
  },
  skeletonReminderDate: {
    width: "40%",
    height: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 4,
  },
  // Maintenance Overview
  skeletonOverviewRow: {
    flexDirection: "row",
    gap: 12,
  },
  skeletonOverviewCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
  },
  skeletonOverviewValue: {
    width: 60,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 6,
  },
  skeletonOverviewLabel: {
    width: 80,
    height: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 4,
  },
  // Maintenance History
  skeletonHistoryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 14,
    borderRadius: 14,
  },
  skeletonHistoryIcon: {
    width: 36,
    height: 36,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
  },
  skeletonHistoryContent: {
    flex: 1,
    gap: 6,
  },
  skeletonHistoryTitle: {
    width: "50%",
    height: 14,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
  },
  skeletonHistoryDetails: {
    width: "70%",
    height: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 3,
  },
  skeletonHistoryAmount: {
    width: 50,
    height: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 4,
  },
  // Fuel Logs
  skeletonFuelCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 16,
    borderRadius: 16,
  },
  skeletonFuelIcon: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
  },
  skeletonFuelContent: {
    flex: 1,
    gap: 6,
  },
  skeletonFuelTitle: {
    width: "50%",
    height: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
  },
  skeletonFuelDetails: {
    width: "70%",
    height: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 4,
  },
});
