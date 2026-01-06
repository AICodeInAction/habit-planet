import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { HabitTask, FamilyMember } from "@/data/mockData";
import { palette } from "@/theme/colors";

type Props = {
  task: HabitTask;
  members: FamilyMember[];
  onToggle: (id: string) => void;
};

const statusLabel: Record<HabitTask["status"], string> = {
  pending: "待开始",
  "in-progress": "进行中",
  done: "已完成"
};

export const HabitCard = ({ task, members, onToggle }: Props) => {
  const involvedMembers = members.filter((m) => task.members.includes(m.id));

  return (
    <Pressable style={styles.card} onPress={() => onToggle(task.id)}>
      <Image source={{ uri: task.cover }} style={styles.cover} />
      <View style={styles.body}>
        <Text style={styles.category}>{task.category}</Text>
        <Text style={styles.title}>{task.title}</Text>
        <View style={styles.footer}>
          <View style={styles.avatarRow}>
            {involvedMembers.map((member) => (
              <Image key={member.id} source={{ uri: member.avatar }} style={styles.avatar} />
            ))}
          </View>
          <BlurView intensity={30} tint="dark" style={styles.status}>
            <Text style={styles.statusText}>{statusLabel[task.status]}</Text>
          </BlurView>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
    marginBottom: 16
  },
  cover: {
    width: "100%",
    height: 140
  },
  body: {
    padding: 16
  },
  category: {
    color: palette.muted,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 2
  },
  title: {
    marginTop: 6,
    color: palette.white,
    fontSize: 20,
    fontWeight: "600"
  },
  footer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  avatarRow: {
    flexDirection: "row"
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    marginRight: -10
  },
  status: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999
  },
  statusText: {
    color: palette.white,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1
  }
});

