import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Car, ArchiveRestore } from "lucide-react-native";
import { router } from "expo-router";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { Vehicle, VEHICLE_CATEGORY_INFO } from "@/types/vehicle";
import { createStyles } from "@/components/styles/index.styles";
import { Card } from "@/components/ui/Card";

interface VehicleListItemProps {
  vehicle: Vehicle;
  onLongPress: (id: string) => void;
}

export const VehicleListItem = ({
  vehicle,
  onLongPress,
}: VehicleListItemProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useLocalization();
  const { formatDistance } = usePreferences();
  const { getUpcomingTasks } = useVehicles();

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
      style={styles.vehicleCard}
      onPress={() => router.push(`/vehicle/${vehicle.id}`)}
      onLongPress={() => onLongPress(vehicle.id)}
      delayLongPress={250}
      padding={0}
    >
      <View>
        {vehicle.photo ? (
          <Image
            source={{ uri: vehicle.photo }}
            style={styles.vehicleImage}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={styles.vehicleImagePlaceholder}>
            <Car size={48} color={colors.textSecondary} />
          </View>
        )}

        {/* Overlay Badges */}
        <View
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            flexDirection: "row",
            gap: 8,
          }}
        >
          {vehicle.archived && (
            <View
              style={{
                backgroundColor: "rgba(0,0,0,0.6)",
                padding: 6,
                borderRadius: 20,
              }}
            >
              <ArchiveRestore size={16} color={colors.warning} />
            </View>
          )}
          {dueTasks.length > 0 && (
            <View style={[styles.alertBadge, { marginLeft: 0 }]}>
              <Text style={styles.alertBadgeText}>{dueTasks.length}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.vehicleInfo}>
        <View style={styles.vehicleTextContainer}>
          <Text style={styles.vehicleName} numberOfLines={1}>
            {vehicle.make} {vehicle.model}
          </Text>

          <View style={styles.detailsRow}>
            <Text style={styles.vehicleDetails}>{vehicle.year}</Text>

            {categoryInfo && (
              <>
                <Text style={styles.dotSeparator}>•</Text>
                <View style={styles.categoryBadge}>
                  <categoryInfo.Icon size={12} color={categoryInfo.color} />
                  <Text
                    style={[
                      styles.categoryBadgeText,
                      { color: categoryInfo.color },
                    ]}
                  >
                    {t(`vehicles.category_${vehicle.category}`)}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        <Text style={styles.vehicleMileage}>
          {formatDistance(vehicle.currentMileage)}
        </Text>
      </View>
    </Card>
  );
};
