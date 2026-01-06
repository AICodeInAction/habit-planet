import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Medal } from "@/data/mockData";
import { palette } from "@/theme/colors";

type Props = {
  medal: Medal;
  onAdvance: (id: string) => void;
};

const rarityColor: Record<Medal["rarity"], string> = {
  SSR: "#fbbf24",
  SR: "#38bdf8",
  R: "#f472b6"
};

export const MedalCard = ({ medal, onAdvance }: Props) => {
  return (
    <Pressable style={styles.card} onPress={() => onAdvance(medal.id)}>
      <View style={styles.row}>
        <View>
          <Text style={[styles.rarity, { color: rarityColor[medal.rarity] }]}>{medal.rarity}</Text>
          <Text style={styles.name}>{medal.name}</Text>
          <Text style={styles.requirement}>{medal.requirement}</Text>
        </View>
        <Text style={styles.reward}>{medal.reward}</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${medal.progress * 100}%` }]} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 16
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12
  },
  rarity: {
    fontSize: 12,
    letterSpacing: 3,
    fontWeight: "700"
  },
  name: {
    color: palette.white,
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4
  },
  requirement: {
    color: palette.muted,
    marginTop: 4
  },
  reward: {
    color: "#a5b4fc",
    fontWeight: "600"
  },
  progressBar: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fbbf24"
  }
});

