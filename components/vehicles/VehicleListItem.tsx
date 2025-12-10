import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  useTheme as usePaperTheme,
} from "react-native-paper";
import { ArchiveRestore, Car, Clock, AlertCircle } from "lucide-react-native";
import { router } from "expo-router";
import { BlurView } from "expo-blur";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { Vehicle, VEHICLE_CATEGORY_INFO } from "@/types/vehicle";
import { createStyles } from "@/components/styles/index.styles";

interface VehicleListItemProps {
  vehicle: Vehicle;
  onLongPress: (id: string) => void;
}

const VehicleListItemComponent = ({
  vehicle,
  onLongPress,
}: VehicleListItemProps) => {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { formatDistance } = usePreferences();
  const { getUpcomingTasks } = useVehicles();
  const styles = createStyles(colors);

  const upcomingTasks = getUpcomingTasks(vehicle.id);
  const dueTasks = upcomingTasks.filter((t) => {
    const isOverdueDate = t.daysUntilDue !== undefined && t.daysUntilDue <= 0;
    const isOverdueMileage =
      t.milesUntilDue !== undefined && t.milesUntilDue <= 0;
    return t.isDue || isOverdueDate || isOverdueMileage;
  });

  const categoryInfo =
    vehicle.category && VEHICLE_CATEGORY_INFO[vehicle.category];

  return (
    <Card
      style={[
        styles.vehicleCard,
        {
          borderRadius: 24, // More pronounced rounding
          backgroundColor: colors.card,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 4,
          marginBottom: 16, // Ensure spacing between cards
        },
      ]}
      onPress={() => router.push(`/vehicle/${vehicle.id}`)}
      onLongPress={() => onLongPress(vehicle.id)}
      mode="elevated"
    >
      <View style={{ position: "relative" }}>
        {vehicle.photo ? (
          <Card.Cover
            source={{ uri: vehicle.photo }}
            style={{
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              height: 200,
              backgroundColor: colors.background,
            }}
          />
        ) : (
          <View
            style={[
              styles.vehicleImagePlaceholder,
              {
                height: 200,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                width: "100%",
                backgroundColor: colors.primary + "10", // Subtle tint
              },
            ]}
          >
            <Car size={64} color={colors.primary} />
          </View>
        )}

        {/* Overlay Badges */}
        <View
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            flexDirection: "row",
            gap: 10,
            zIndex: 1,
          }}
        >
          {vehicle.archived &&
            (Platform.OS === "android" ? (
              <View
                style={{
                  padding: 8,
                  borderRadius: 20,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ArchiveRestore size={18} color={colors.warning} />
              </View>
            ) : (
              <BlurView
                intensity={30}
                tint="dark"
                style={{
                  padding: 8,
                  borderRadius: 20,
                  overflow: "hidden",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ArchiveRestore size={18} color={colors.warning} />
              </BlurView>
            ))}
          {/* Badge Logic: Unified Status Pill */}
          {(() => {
            const overdueTasks = dueTasks.filter((t) => {
              const isOverdueDate =
                t.daysUntilDue !== undefined && t.daysUntilDue <= 0;
              const isOverdueMileage =
                t.milesUntilDue !== undefined && t.milesUntilDue <= 0;
              return isOverdueDate || isOverdueMileage;
            });

            const upcomingTasksCount = dueTasks.length - overdueTasks.length;
            const overdueCount = overdueTasks.length;

            if (overdueCount === 0 && upcomingTasksCount === 0) return null;

            const content = (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                {/* Overdue Section */}
                {overdueCount > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <AlertCircle
                      size={14}
                      color={colors.error}
                      fill={colors.error}
                    />
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontWeight: "700",
                        fontSize: 13,
                      }}
                    >
                      {overdueCount}
                    </Text>
                  </View>
                )}

                {/* Separator if both exist */}
                {overdueCount > 0 && upcomingTasksCount > 0 && (
                  <View
                    style={{
                      width: 1,
                      height: 12,
                      backgroundColor: "rgba(255,255,255,0.2)",
                    }}
                  />
                )}

                {/* Upcoming Section */}
                {upcomingTasksCount > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Clock size={14} color={colors.warning} />
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontWeight: "700",
                        fontSize: 13,
                      }}
                    >
                      {upcomingTasksCount}
                    </Text>
                  </View>
                )}
              </View>
            );

            return Platform.OS === "android" ? (
              <View
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderRadius: 16,
                  backgroundColor: "rgba(0,0,0,0.7)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {content}
              </View>
            ) : (
              <BlurView
                intensity={40}
                tint="systemThickMaterialDark"
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderRadius: 16,
                  overflow: "hidden",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {content}
              </BlurView>
            );
          })()}
        </View>
      </View>

      <Card.Content style={{ paddingTop: 20, paddingBottom: 16 }}>
        {/* Header: Name+Year and Category */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left: Name and Year */}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "baseline",
              marginRight: 8,
            }}
          >
            <Title
              style={{
                fontSize: 22,
                fontWeight: "800",
                color: colors.text,
                lineHeight: 28,
                letterSpacing: -0.5,
                marginRight: 8,
              }}
            >
              {vehicle.make} {vehicle.model}
            </Title>
            <Text
              style={{
                fontSize: 16,
                color: colors.textSecondary,
                fontWeight: "500",
              }}
            >
              {vehicle.year}
            </Text>
          </View>

          {/* Right: Category Badge */}
          {categoryInfo && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                backgroundColor: categoryInfo.color + "15",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <categoryInfo.Icon size={14} color={categoryInfo.color} />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: categoryInfo.color,
                }}
              >
                {t(`vehicles.category_${vehicle.category}`)}
              </Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

export const VehicleListItem = React.memo(VehicleListItemComponent);
