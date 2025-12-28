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
import { Image } from "expo-image";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useVehicles } from "@/contexts/VehicleContext";
import { Vehicle, VEHICLE_CATEGORY_INFO } from "@/types/vehicle";
import { createVehicleListItemStyles } from "@/styles/vehicles/VehicleListItem.styles";
import { Reminder } from "@/components/vehicle-details/quick-reminders/types";
import { VehicleImage } from "@/components/ui/VehicleImage";

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
  const { getUpcomingTasks, getQuickRemindersByVehicle } = useVehicles();
  const styles = createVehicleListItemStyles(colors);

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
      mode="elevated"
    >
      <View style={styles.imageContainer}>
        {vehicle.photo ? (
          <VehicleImage
            uri={vehicle.photo}
            position={vehicle.photoPosition}
            height={200}
            borderTopRadius={24}
            borderBottomRadius={24}
          />
        ) : (
          <View style={styles.vehicleImagePlaceholder}>
            <Car size={64} color={colors.primary} />
          </View>
        )}

        {/* Overlay Badges */}
        <View style={styles.badgeContainer}>
          {vehicle.archived &&
            (Platform.OS === "android" ? (
              <View style={styles.archivedBadgeAndroid}>
                <ArchiveRestore size={18} color={colors.warning} />
              </View>
            ) : (
              <BlurView
                intensity={30}
                tint="dark"
                style={styles.archivedBadgeIos}
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

            const vehicleReminders = getQuickRemindersByVehicle(vehicle.id);
            const overdueReminders = vehicleReminders.filter(
              (r: Reminder) => r.dueAt <= Date.now()
            );

            const upcomingTasksCount = dueTasks.length - overdueTasks.length;
            const overdueCount = overdueTasks.length + overdueReminders.length;

            if (overdueCount === 0 && upcomingTasksCount === 0) return null;

            const content = (
              <View style={styles.statusPillContent}>
                {/* Overdue Section */}
                {overdueCount > 0 && (
                  <View style={styles.statusSection}>
                    <AlertCircle
                      size={14}
                      color={colors.error}
                      fill={colors.error}
                    />
                    <Text style={styles.statusText}>{overdueCount}</Text>
                  </View>
                )}

                {/* Separator if both exist */}
                {overdueCount > 0 && upcomingTasksCount > 0 && (
                  <View style={styles.statusSeparator} />
                )}

                {/* Upcoming Section */}
                {upcomingTasksCount > 0 && (
                  <View style={styles.statusSection}>
                    <Clock size={14} color={colors.warning} />
                    <Text style={styles.statusText}>{upcomingTasksCount}</Text>
                  </View>
                )}
              </View>
            );

            return Platform.OS === "android" ? (
              <View style={styles.statusPillAndroid}>{content}</View>
            ) : (
              <BlurView
                intensity={40}
                tint="systemThickMaterialDark"
                style={styles.statusPillIos}
              >
                {content}
              </BlurView>
            );
          })()}
        </View>
      </View>

      <Card.Content style={styles.cardContent}>
        {/* Header: Name+Year and Category */}
        <View style={styles.headerRow}>
          {/* Left: Name and Year */}
          <View style={styles.titleContainer}>
            <Title style={styles.title}>
              {vehicle.make} {vehicle.model}
            </Title>
            <Text style={styles.year}>{vehicle.year}</Text>
          </View>

          {/* Right: Category Badge */}
          {categoryInfo && (
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: categoryInfo.color + "15" },
              ]}
            >
              <categoryInfo.Icon size={14} color={categoryInfo.color} />
              <Text
                style={[styles.categoryText, { color: categoryInfo.color }]}
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
