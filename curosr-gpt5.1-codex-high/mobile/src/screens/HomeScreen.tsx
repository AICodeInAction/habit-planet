import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { usePrototype } from "@/hooks/PrototypeProvider";
import { palette } from "@/theme/colors";
import { CircularProgress } from "@/components/CircularProgress";
import { HabitCard } from "@/components/HabitCard";
import { SectionHeader } from "@/components/SectionHeader";

export const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const { tasks, members, lightPoints, flightProgress, toggleTaskStatus } = usePrototype();

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + 12 }]}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <LinearGradient colors={["#1b1742", "#050912"]} style={styles.hero}>
        <View style={styles.heroHeader}>
          <View>
            <Text style={styles.heroCaption}>星际习惯航线</Text>
            <Text style={styles.heroTitle}>星航家庭</Text>
          </View>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80" }}
            style={styles.avatar}
          />
        </View>
        <View style={styles.heroBody}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroSub}>今日航程</Text>
            <Text style={styles.heroCallout}>点亮「晨读星」</Text>
            <Text style={styles.heroDescription}>完成 3 个晨间习惯即可推进飞船 40 光点。</Text>
            <View style={styles.heroActions}>
              <View style={styles.actionPill}>
                <Ionicons name="flame" color="#fb923c" size={18} />
                <Text style={styles.actionText}>连胜 {members[0]?.streak ?? 0} 天</Text>
              </View>
              <View style={styles.actionPill}>
                <Ionicons name="sparkles" color="#fcd34d" size={18} />
                <Text style={styles.actionText}>光点 {lightPoints}</Text>
              </View>
            </View>
          </View>
          <CircularProgress value={flightProgress} label="飞航进度" />
        </View>
      </LinearGradient>

      <SectionHeader title="家庭同步进度" subtitle="实时加成" actionLabel="全部" />
      <View style={styles.familyBoard}>
        {members.map((member) => (
          <View key={member.id} style={styles.memberCard}>
            <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.memberPoints}>+{member.points} 光点</Text>
            <Text style={styles.memberStreak}>连胜 {member.streak} 天</Text>
          </View>
        ))}
      </View>

      <SectionHeader title="今日任务清单" subtitle="点击任务切换状态" actionLabel="编辑" />
      {tasks.map((task) => (
        <HabitCard key={task.id} task={task} members={members} onToggle={toggleTaskStatus} />
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
    borderRadius: 32,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)"
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24
  },
  heroCaption: {
    color: palette.muted,
    fontSize: 13
  },
  heroTitle: {
    marginTop: 6,
    color: palette.white,
    fontSize: 28,
    fontWeight: "700"
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)"
  },
  heroBody: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  },
  heroSub: {
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 12
  },
  heroCallout: {
    color: palette.white,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 6
  },
  heroDescription: {
    marginTop: 10,
    color: palette.muted,
    lineHeight: 18
  },
  heroActions: {
    marginTop: 16,
    flexDirection: "row",
    gap: 12
  },
  actionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)"
  },
  actionText: {
    color: palette.white,
    fontSize: 12,
    fontWeight: "600"
  },
  familyBoard: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12
  },
  memberCard: {
    flex: 1,
    borderRadius: 22,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    alignItems: "center"
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    marginBottom: 8
  },
  memberName: {
    color: palette.white,
    fontWeight: "600"
  },
  memberPoints: {
    marginTop: 4,
    color: "#34d399",
    fontWeight: "600"
  },
  memberStreak: {
    marginTop: 2,
    color: palette.muted,
    fontSize: 12
  }
});

