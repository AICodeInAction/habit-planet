import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { palette } from "@/theme/colors";

type Props = {
  size?: number;
  strokeWidth?: number;
  value: number; // 0-1
  label?: string;
};

export const CircularProgress = ({ size = 96, strokeWidth = 10, value, label }: Props) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - value * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="habitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#38bdf8" />
            <Stop offset="100%" stopColor="#c084fc" />
          </LinearGradient>
        </Defs>
        <Circle
          stroke="rgba(255,255,255,0.12)"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke="url(#habitGradient)"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={StyleSheet.absoluteFillObject}>
        <View style={styles.center}>
          <Text style={styles.percentage}>{Math.round(value * 100)}%</Text>
          {label ? <Text style={styles.label}>{label}</Text> : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  percentage: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "700"
  },
  label: {
    marginTop: 4,
    color: palette.muted,
    fontSize: 12
  }
});

