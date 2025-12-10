import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { ThemedBackground } from "@/components/ThemedBackground";
import { useTheme } from "@/contexts/ThemeContext";

export default function NotFoundScreen() {
  const { colors } = useTheme();

  return (
    <ThemedBackground>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>
          This screen doesn&apos;t exist.
        </Text>

        <Link href="/" style={styles.link}>
          <Text style={[styles.linkText, { color: colors.primary }]}>
            Go back to vehicles
          </Text>
        </Link>
      </View>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold" as const,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
});
