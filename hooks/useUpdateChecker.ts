import { useEffect } from "react";
import { Alert, Linking } from "react-native";
import Constants from "expo-constants";

const UPDATE_JSON_URL =
  "https://shift-vehicle-maintenance.vercel.app/version.json";
// Fallback URL if json doesn't have one
const FALLBACK_URL = "https://shift-vehicle-maintenance.vercel.app/";

/**
 * Parses a semantic version string into an array of numbers.
 * Removes 'v' prefix if present.
 */
const parseVersion = (version: string) => {
  return version
    .replace(/^v/, "")
    .split(".")
    .map((num) => parseInt(num, 10));
};

/**
 * Compares two semantic version strings.
 * Returns true if versionA > versionB.
 */
const isNewerVersion = (versionA: string, versionB: string) => {
  const partsA = parseVersion(versionA);
  const partsB = parseVersion(versionB);

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const a = partsA[i] || 0;
    const b = partsB[i] || 0;
    if (a > b) return true;
    if (a < b) return false;
  }
  return false;
};

export const useUpdateChecker = () => {
  useEffect(() => {
    const checkUpdate = async () => {
      try {
        const currentVersion = Constants.expoConfig?.version;
        if (!currentVersion) {
          if (__DEV__) console.log("UpdateChecker: No version in expoConfig");
          return;
        }

        const response = await fetch(UPDATE_JSON_URL);
        if (!response.ok) {
          if (__DEV__)
            console.log("UpdateChecker: Failed to fetch version.json");
          return;
        }

        const data = await response.json();
        const latestVersion = data.latestVersion; // e.g., "1.0.1"
        const downloadUrl = data.downloadUrl || FALLBACK_URL;

        if (latestVersion && isNewerVersion(latestVersion, currentVersion)) {
          Alert.alert(
            "Update Available",
            `A new version (${latestVersion}) is available. Please update to continue enjoying the latest features.`,
            [
              {
                text: "Later",
                style: "cancel",
              },
              {
                text: "Update Now",
                onPress: () => Linking.openURL(downloadUrl),
              },
            ]
          );
        } else {
          if (__DEV__) console.log("UpdateChecker: App is up to date");
        }
      } catch (error) {
        if (__DEV__) console.log("Failed to check for updates:", error);
      }
    };

    checkUpdate();
  }, []);
};
