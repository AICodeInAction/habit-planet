import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Routine } from "@/data/mockData";
import { palette } from "@/theme/colors";

export const RoutineCard = ({ routine }: { routine: Routine }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.slot}>{routine.slot}</Text>
      <Text style={styles.title}>{routine.title}</Text>
      <View style={styles.progress}>
        <View style={[styles.progressFill, { width: `${routine.completion * 100}%` }]} />
      </View>
      <Text style={styles.meta}>{Math.round(routine.completion * 100)}% 完成</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: 12
  },
  slot: {
    color: palette.muted,
    fontSize: 12
  },
  title: {
    marginTop: 6,
    color: palette.white,
    fontSize: 18,
    fontWeight: "600"
  },
  progress: {
    marginTop: 12,
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#34d399"
  },
  meta: {
    marginTop: 8,
    color: palette.muted,
    fontSize: 12
  }
});

