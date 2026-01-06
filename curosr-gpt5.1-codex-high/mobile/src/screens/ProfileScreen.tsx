import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { usePrototype } from "@/hooks/PrototypeProvider";
import { palette } from "@/theme/colors";
import { RoutineCard } from "@/components/RoutineCard";
import { SectionHeader } from "@/components/SectionHeader";

export const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const { members, routines } = usePrototype();
  const main = members[0];

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + 12 }]}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <View style={styles.header}>
        <Image source={{ uri: main.avatar }} style={styles.heroAvatar} />
        <Text style={styles.name}>{main.name}</Text>
        <Text style={styles.rank}>银河段位 · 光谱见习官</Text>
        <View style={styles.heroMeta}>
          <View style={styles.metaChip}>
            <Ionicons name="flame" color="#fb923c" size={16} />
            <Text style={styles.metaText}>连续 {main.streak} 天</Text>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="time" color="#4ade80" size={16} />
            <Text style={styles.metaText}>准时率 98%</Text>
          </View>
        </View>
      </View>

      <SectionHeader title="个人习惯引擎" subtitle="动态调整" actionLabel="调整" />
      {routines.map((routine) => (
        <RoutineCard key={routine.id} routine={routine} />
      ))}

      <SectionHeader title="守护人设置" subtitle="管理权限" />
      <View style={styles.guardianCard}>
        {members
          .filter((member) => member.id !== main.id)
          .map((member) => (
            <View key={member.id} style={styles.guardianRow}>
              <View style={styles.guardianLeft}>
                <Image source={{ uri: member.avatar }} style={styles.guardianAvatar} />
                <View>
                  <Text style={styles.guardianName}>{member.name}</Text>
                  <Text style={styles.guardianMeta}>提醒 + 奖励权限</Text>
                </View>
              </View>
              <Pressable style={styles.guardianBtn}>
                <Text style={styles.guardianBtnText}>管理</Text>
              </Pressable>
            </View>
          ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.night,
    paddingHorizontal: 20
  },
  header: {
    alignItems: "center",
    padding: 24,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    marginBottom: 24
  },
  heroAvatar: {
    width: 96,
    height: 96,
    borderRadius: 32,
    marginBottom: 16
  },
  name: {
    color: palette.white,
    fontSize: 28,
    fontWeight: "700"
  },
  rank: {
    marginTop: 4,
    color: palette.muted
  },
  heroMeta: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)"
  },
  metaText: {
    color: palette.white,
    fontWeight: "600",
    fontSize: 12
  },
  guardianCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    padding: 12
  },
  guardianRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)"
  },
  guardianLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  guardianAvatar: {
    width: 52,
    height: 52,
    borderRadius: 18
  },
  guardianName: {
    color: palette.white,
    fontWeight: "600",
    fontSize: 16
  },
  guardianMeta: {
    color: palette.muted,
    fontSize: 12
  },
  guardianBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)"
  },
  guardianBtnText: {
    color: palette.white,
    fontSize: 12
  }
});

