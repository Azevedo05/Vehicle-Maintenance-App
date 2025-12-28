import React from "react";
import { View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { createStyles } from "@/styles/index.styles";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export const VehicleListSkeleton = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={{ gap: 16 }}>
      {[1, 2, 3].map((key) => (
        <Card key={key} style={styles.vehicleCard} padding={12}>
          <Skeleton
            width={80}
            height={80}
            borderRadius={12}
            style={{ marginRight: 16 }}
          />
          <View style={{ flex: 1, gap: 8 }}>
            {/* Name */}
            <Skeleton width="60%" height={20} borderRadius={4} />
            {/* Details */}
            <Skeleton width="80%" height={16} borderRadius={4} />
            {/* Mileage */}
            <Skeleton width="40%" height={16} borderRadius={4} />
          </View>
        </Card>
      ))}
    </View>
  );
};
