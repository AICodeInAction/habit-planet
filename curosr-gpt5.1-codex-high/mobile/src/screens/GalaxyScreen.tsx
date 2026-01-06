import React from "react";
import { ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePrototype } from "@/hooks/PrototypeProvider";
import { palette } from "@/theme/colors";
import { PlanetCard } from "@/components/PlanetCard";

export const GalaxyScreen = () => {
  const insets = useSafeAreaInsets();
  const { planets, lightPoints, boostPlanet } = usePrototype();

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + 12 }]}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&w=1200&q=80"
        }}
        style={styles.hero}
        imageStyle={{ borderRadius: 32 }}
      >
        <LinearGradient colors={["rgba(2,6,23,0.9)", "rgba(5,5,15,0.6)"]} style={styles.heroOverlay}>
          <Text style={styles.heroLabel}>第 3 章 · 银河探险</Text>
          <Text style={styles.heroTitle}>晨曦星系</Text>
          <Text style={styles.heroMeta}>累计光点 · {lightPoints}</Text>
        </LinearGradient>
      </ImageBackground>

      {planets.map((planet) => (
        <PlanetCard key={planet.id} planet={planet} onBoost={boostPlanet} />
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
  hero: {
    height: 220,
    borderRadius: 32,
    overflow: "hidden",
    marginBottom: 24
  },
  heroOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-end",
    borderRadius: 32
  },
  heroLabel: {
    color: palette.muted,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 12
  },
  heroTitle: {
    marginTop: 8,
    color: palette.white,
    fontSize: 32,
    fontWeight: "700"
  },
  heroMeta: {
    marginTop: 4,
    color: "#a5f3fc"
  }
});

