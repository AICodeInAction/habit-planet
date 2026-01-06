import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { palette } from "@/theme/colors";

type Props = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onPressAction?: () => void;
  rightSlot?: React.ReactNode;
};

export const SectionHeader = ({ title, subtitle, actionLabel, onPressAction, rightSlot }: Props) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightSlot ? (
        rightSlot
      ) : actionLabel ? (
        <Text style={styles.action} onPress={onPressAction}>
          {actionLabel}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },
  title: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "600"
  },
  subtitle: {
    marginTop: 4,
    color: palette.muted,
    fontSize: 13
  },
  action: {
    color: "#a5b4fc",
    fontSize: 13
  }
});

