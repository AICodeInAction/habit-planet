import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useAppStore } from '../store/useAppStore';
import { colors, gradients, theme } from '../theme';
import { StarField } from '../components/common/StarField';
import { RootStackParamList, Habit } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// 进度环组件
const ProgressRing: React.FC<{ progress: number; size?: number }> = ({ 
  progress, 
  size = 120 
}) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  
  return (
    <View style={{ width: size, height: size }}>
      <View style={[styles.progressRingBg, { width: size, height: size }]}>
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.progressRingFill,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              transform: [{ rotate: `${-90 + progress * 360}deg` }],
            },
          ]}
        />
      </View>
      <View style={styles.progressRingCenter}>
        <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
      </View>
    </View>
  );
};

// 习惯卡片组件
const HabitCard: React.FC<{
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
}> = ({ habit, isCompleted, onToggle }) => {
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(isCompleted ? 1 : 0);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));
  
  const handlePress = useCallback(() => {
    // 触觉反馈
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // 动画
    scale.value = withSequence(
      withSpring(0.95),
      withSpring(1)
    );
    
    if (!isCompleted) {
      checkScale.value = withSpring(1);
    } else {
      checkScale.value = withTiming(0, { duration: 200 });
    }
    
    onToggle();
  }, [isCompleted, onToggle]);
  
  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={handlePress}>
        <LinearGradient
          colors={
            isCompleted
              ? ['rgba(76, 217, 100, 0.2)', 'rgba(76, 217, 100, 0.1)']
              : [colors.card.background, colors.card.backgroundLight]
          }
          style={[
            styles.habitCard,
            isCompleted && styles.habitCardCompleted,
          ]}
        >
          <View style={styles.habitCardContent}>
            {/* 勾选圆圈 */}
            <View
              style={[
                styles.checkCircle,
                isCompleted && styles.checkCircleCompleted,
              ]}
            >
              <Animated.View style={checkAnimatedStyle}>
                <Ionicons name="checkmark" size={16} color="#fff" />
              </Animated.View>
            </View>
            
            {/* 习惯信息 */}
            <View style={styles.habitInfo}>
              <View style={styles.habitIconRow}>
                <Text style={styles.habitIcon}>{habit.icon}</Text>
                <View>
                  <Text style={styles.habitName}>{habit.name}</Text>
                  <Text style={styles.habitDescription}>{habit.description}</Text>
                </View>
              </View>
            </View>
            
            {/* 奖励 */}
            <View style={styles.habitReward}>
              <Text
                style={[
                  styles.rewardAmount,
                  isCompleted && styles.rewardAmountCompleted,
                ]}
              >
                +{habit.starDustReward}
              </Text>
              <Text style={styles.rewardLabel}>星尘</Text>
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, habits, todayCompletions, completeHabit, uncompleteHabit } = useAppStore();
  
  // 计算今日完成进度
  const completedCount = todayCompletions.length;
  const totalCount = habits.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;
  
  // 检查习惯是否已完成
  const isHabitCompleted = useCallback(
    (habitId: string) => todayCompletions.some(c => c.habitId === habitId),
    [todayCompletions]
  );
  
  // 切换习惯完成状态
  const toggleHabit = useCallback(
    (habitId: string) => {
      if (isHabitCompleted(habitId)) {
        uncompleteHabit(habitId);
      } else {
        completeHabit(habitId);
      }
    },
    [isHabitCompleted, completeHabit, uncompleteHabit]
  );
  
  // 获取今天的日期
  const today = new Date();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const dateString = `星期${weekDays[today.getDay()]}，${today.getMonth() + 1}月${today.getDate()}日`;
  
  return (
    <View style={styles.container}>
      <StarField starCount={30} />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 头部区域 */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.dateText}>{dateString}</Text>
                <Text style={styles.greeting}>你好，{user.name} ✨</Text>
              </View>
              
              {/* 星尘余额 */}
              <View style={styles.starDustBadge}>
                <Ionicons name="sparkles" size={16} color={colors.starDust.primary} />
                <Text style={styles.starDustAmount}>
                  {user.starDust.toLocaleString()}
                </Text>
              </View>
            </View>
            
            {/* 今日任务卡片 */}
            <LinearGradient
              colors={['rgba(128, 0, 128, 0.3)', 'rgba(0, 0, 128, 0.3)']}
              style={styles.todayCard}
            >
              <View style={styles.todayCardContent}>
                <View style={styles.todayInfo}>
                  <Text style={styles.todayTitle}>今日任务</Text>
                  <Text style={styles.todaySubtitle}>
                    完成 {completedCount}/{totalCount} 个习惯
                  </Text>
                  
                  {/* 连续打卡徽章 */}
                  <View style={styles.streakBadge}>
                    <Ionicons name="flame" size={14} color="#fff" />
                    <Text style={styles.streakText}>连续 {user.streakDays} 天</Text>
                  </View>
                </View>
                
                {/* 进度环 */}
                <ProgressRing progress={progress} size={120} />
              </View>
            </LinearGradient>
          </View>
          
          {/* 习惯列表 */}
          <View style={styles.habitsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>今日习惯</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('CreateHabit', {})}
              >
                <Ionicons name="add" size={18} color={colors.primary.blue} />
                <Text style={styles.addButtonText}>添加</Text>
              </TouchableOpacity>
            </View>
            
            {habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompleted={isHabitCompleted(habit.id)}
                onToggle={() => toggleHabit(habit.id)}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 4,
  },
  starDustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.starDust.light,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  starDustAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.starDust.primary,
  },
  todayCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  todayCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todayInfo: {
    flex: 1,
  },
  todayTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  todaySubtitle: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 107, 107, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  progressRingBg: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 60,
  },
  progressRingFill: {
    position: 'absolute',
  },
  progressRingCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary.blue,
  },
  habitsSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    fontSize: 14,
    color: colors.primary.blue,
    fontWeight: '600',
  },
  habitCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  habitCardCompleted: {
    borderColor: 'rgba(76, 217, 100, 0.3)',
  },
  habitCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  checkCircleCompleted: {
    backgroundColor: colors.success.primary,
    borderColor: colors.success.primary,
  },
  habitInfo: {
    flex: 1,
  },
  habitIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  habitIcon: {
    fontSize: 28,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  habitDescription: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  habitReward: {
    alignItems: 'flex-end',
  },
  rewardAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.tertiary,
  },
  rewardAmountCompleted: {
    color: colors.starDust.primary,
  },
  rewardLabel: {
    fontSize: 10,
    color: colors.text.disabled,
  },
});

