import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePrototype } from "@/hooks/PrototypeProvider";
import { palette } from "@/theme/colors";
import { SectionHeader } from "@/components/SectionHeader";
import { FamilyMessageCard } from "@/components/FamilyMessageCard";

export const FamilyScreen = () => {
  const insets = useSafeAreaInsets();
  const { members, messages, applaudMessage } = usePrototype();

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + 12 }]}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <View style={styles.themeCard}>
        <Text style={styles.caption}>本周主题</Text>
        <Text style={styles.title}>「温暖厨房日记」</Text>
        <Text style={styles.body}>
          每晚记录一次家庭晚餐时刻，分享一天最开心的瞬间，完成后解锁「味蕾星」限定装饰。
        </Text>
        <View style={styles.actionRow}>
          <Text style={styles.tag}>第 2 天 · 进度 54%</Text>
          <Text style={styles.cta}>上传瞬间</Text>
        </View>
      </View>

      <SectionHeader title="亲子星际电台" subtitle="点击掌声增加鼓励" />
      {messages.map((message) => (
        <FamilyMessageCard key={message.id} message={message} onApplaud={applaudMessage} />
      ))}

      <SectionHeader title="家庭航行排行榜" subtitle="实时刷新" />
      <View style={styles.board}>
        {members.map((member, index) => (
          <View key={member.id} style={styles.boardRow}>
            <Text style={[styles.rank, { color: rankColor(index) }]}>{index + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.boardName}>{member.name}</Text>
              <Text style={styles.boardMeta}>连胜 {member.streak} 天</Text>
            </View>
            <Text style={styles.boardPoints}>+{member.points}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const rankColor = (index: number) => {
  if (index === 0) return "#fbbf24";
  if (index === 1) return "#e5e7eb";
  if (index === 2) return "#fb923c";
  return palette.muted;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.night,
    paddingHorizontal: 20
  },
  themeCard: {
    borderRadius: 28,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 24
  },
  caption: {
    color: palette.muted,
    fontSize: 12
  },
  title: {
    marginTop: 6,
    color: palette.white,
    fontSize: 26,
    fontWeight: "700"
  },
  body: {
    marginTop: 10,
    color: palette.muted,
    lineHeight: 20
  },
  actionRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  tag: {
    color: "#fcd34d",
    fontWeight: "600"
  },
  cta: {
    color: "#a5b4fc",
    fontWeight: "600"
  },
  board: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 12
  },
  boardRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)"
  },
  rank: {
    width: 24,
    fontSize: 20,
    fontWeight: "700"
  },
  boardName: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600"
  },
  boardMeta: {
    color: palette.muted,
    fontSize: 12
  },
  boardPoints: {
    color: "#34d399",
    fontSize: 18,
    fontWeight: "700"
  }
});

