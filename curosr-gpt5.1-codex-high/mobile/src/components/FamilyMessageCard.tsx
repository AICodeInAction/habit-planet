import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { FamilyMessage } from "@/data/mockData";
import { palette } from "@/theme/colors";

type Props = {
  message: FamilyMessage;
  onApplaud: (id: string) => void;
};

export const FamilyMessageCard = ({ message, onApplaud }: Props) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.sender}>
          <Image source={{ uri: message.avatar }} style={styles.avatar} />
          <View>
            <Text style={styles.name}>{message.sender}</Text>
            <Text style={styles.timestamp}>{message.timestamp}</Text>
          </View>
        </View>
        <Pressable onPress={() => onApplaud(message.id)}>
          <Text style={styles.likes}>👏 {message.likes}</Text>
        </Pressable>
      </View>
      <Text style={styles.body}>{message.body}</Text>
    </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },
  sender: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22
  },
  name: {
    color: palette.white,
    fontWeight: "600"
  },
  timestamp: {
    color: palette.muted,
    fontSize: 12
  },
  likes: {
    color: "#fcd34d",
    fontSize: 16,
    fontWeight: "600"
  },
  body: {
    color: palette.white,
    lineHeight: 20
  }
});

