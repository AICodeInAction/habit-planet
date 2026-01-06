import React from "react";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { Planet } from "@/data/mockData";
import { palette } from "@/theme/colors";

type Props = {
  planet: Planet;
  onBoost: (id: string) => void;
};

const statusColor: Record<Planet["status"], string> = {
  unlocked: "#a5b4fc",
  building: "#fcd34d",
  locked: "#f87171"
};

export const PlanetCard = ({ planet, onBoost }: Props) => {
  return (
    <Pressable onPress={() => onBoost(planet.id)} style={styles.wrapper}>
      <ImageBackground source={{ uri: planet.cover }} style={styles.cover} imageStyle={styles.image}>
        <BlurView intensity={40} tint="dark" style={styles.badge}>
          <Text style={[styles.badgeText, { color: statusColor[planet.status] }]}>{planet.status.toUpperCase()}</Text>
        </BlurView>
      </ImageBackground>
      <View style={styles.body}>
        <Text style={styles.name}>{planet.name}</Text>
        <Text style={styles.description}>{planet.description}</Text>
        <View style={styles.progress}>
          <View style={[styles.progressFill, { width: `${planet.progress * 100}%` }]} />
        </View>
        <Text style={styles.perk}>
          光尘需求 {planet.requiredPoints} · {planet.perks.join(" / ")}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(8,10,26,0.7)",
    marginBottom: 16
  },
  cover: {
    height: 140
  },
  image: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28
  },
  badge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2
  },
  body: {
    padding: 16
  },
  name: {
    color: palette.white,
    fontSize: 20,
    fontWeight: "700"
  },
  description: {
    color: palette.muted,
    marginTop: 6,
    lineHeight: 18
  },
  progress: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginTop: 16,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#38bdf8"
  },
  perk: {
    marginTop: 10,
    color: palette.muted,
    fontSize: 12
  }
});

