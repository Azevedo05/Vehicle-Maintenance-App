import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

interface AccordionProps {
    title: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    initiallyExpanded?: boolean;
}

export function Accordion({ title, children, icon, initiallyExpanded = false }: AccordionProps) {
    const [expanded, setExpanded] = useState(initiallyExpanded);
    const { colors } = useTheme();

    const toggleExpand = () => {
        if (Platform.OS === 'ios') {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }
        setExpanded(!expanded);
    };

    const styles = StyleSheet.create({
        container: {
            backgroundColor: colors.card,
            borderRadius: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 16,
        },
        titleContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
        },
        title: {
            fontSize: 16,
            fontWeight: "600",
            color: colors.text,
        },
        content: {
            paddingHorizontal: 16,
            paddingBottom: 16,
            paddingTop: 8,
            gap: 16,
        },
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.header}
                onPress={toggleExpand}
                activeOpacity={0.7}
            >
                <View style={styles.titleContainer}>
                    {icon}
                    <Text style={styles.title}>{title}</Text>
                </View>
                {expanded ? (
                    <ChevronUp size={20} color={colors.textSecondary} />
                ) : (
                    <ChevronDown size={20} color={colors.textSecondary} />
                )}
            </TouchableOpacity>
            {expanded && <View style={styles.content}>{children}</View>}
        </View>
    );
}
