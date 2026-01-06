import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePrototype } from "@/hooks/PrototypeProvider";
import { palette } from "@/theme/colors";
import { SectionHeader } from "@/components/SectionHeader";
import { MedalCard } from "@/components/MedalCard";

export const RewardsScreen = () => {
  const insets = useSafeAreaInsets();
  const { medals, lightPoints, advanceMedal } = usePrototype();

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + 12 }]}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <View style={styles.summary}>
        <Text style={styles.caption}>累计荣誉</Text>
        <Text style={styles.value}>12 枚</Text>
        <Text style={styles.meta}>可兑换光尘 · {lightPoints}</Text>
        <View style={styles.breakdown}>
          <View>
            <Text style={styles.breakValue}>3</Text>
            <Text style={styles.breakLabel}>家庭共创</Text>
          </View>
          <View>
            <Text style={styles.breakValue}>6</Text>
            <Text style={styles.breakLabel}>自律成长</Text>
          </View>
          <View>
            <Text style={styles.breakValue}>3</Text>
            <Text style={styles.breakLabel}>探索冒险</Text>
          </View>
        </View>
      </View>

      <SectionHeader title="奖牌收藏" subtitle="点击任意牌推进进度" />
      {medals.map((medal) => (
        <MedalCard key={medal.id} medal={medal} onAdvance={advanceMedal} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.night,
    paddingHorizontal: 20
  },
  summary: {
    borderRadius: 28,
    padding: 24,
    backgroundColor: "rgba(251,191,36,0.08)",
    borderWidth: 1,
    borderColor: "rgba(251,191,36,0.3)",
    marginBottom: 24
  },
  caption: {
    color: palette.muted,
    letterSpacing: 2,
    fontSize: 12
  },
  value: {
    marginTop: 8,
    color: palette.white,
    fontSize: 36,
    fontWeight: "700"
  },
  meta: {
    marginTop: 4,
    color: "#fde68a"
  },
  breakdown: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  breakValue: {
    color: palette.white,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center"
  },
  breakLabel: {
    marginTop: 4,
    color: palette.muted,
    fontSize: 12,
    textAlign: "center"
  }
});

