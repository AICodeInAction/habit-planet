import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useAppStore } from '../store/useAppStore';
import { colors, gradients, theme } from '../theme';
import { FamilyTask, FamilyActivity, User } from '../types';

// 家庭任务卡片
const FamilyTaskCard: React.FC<{ task: FamilyTask; members: User[] }> = ({ task, members }) => {
  const progress = task.currentCount / task.targetCount;
  const participants = members.filter(m => task.participants.includes(m.id));
  
  return (
    <LinearGradient
      colors={[colors.success.light, 'rgba(76, 217, 100, 0.05)']}
      style={styles.taskCard}
    >
      <View style={styles.taskHeader}>
        <View style={styles.taskInfo}>
          <Text style={styles.taskIcon}>{task.icon}</Text>
          <View>
            <Text style={styles.taskName}>{task.name}</Text>
            <Text style={styles.taskDescription}>{task.description}</Text>
          </View>
        </View>
        <Text style={styles.taskProgress}>{Math.round(progress * 100)}%</Text>
      </View>
      
      <View style={styles.progressBar}>
        <LinearGradient
          colors={[colors.success.primary, colors.success.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${progress * 100}%` }]}
        />
      </View>
      
      <View style={styles.taskFooter}>
        <View style={styles.participantAvatars}>
          {participants.slice(0, 4).map((member, index) => (
            <View
              key={member.id}
              style={[styles.miniAvatar, { marginLeft: index > 0 ? -8 : 0 }]}
            >
              <Text style={styles.miniAvatarText}>{member.avatar}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.taskCount}>
          {task.deadline ? `剩余 ${Math.ceil((new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} 天` : `${task.currentCount}/${task.targetCount} 次`}
        </Text>
      </View>
    </LinearGradient>
  );
};

// 排行榜项
const LeaderboardItem: React.FC<{
  member: User;
  rank: number;
  weeklyHabits: number;
  weeklyStarDust: number;
  onEncourage?: () => void;
}> = ({ member, rank, weeklyHabits, weeklyStarDust, onEncourage }) => {
  const rankColors = ['', colors.starDust.primary, '#c0c0c0', '#cd7f32'];
  const rankBgColors = ['', 'rgba(255, 215, 0, 0.2)', 'rgba(192, 192, 192, 0.2)', 'rgba(205, 127, 50, 0.2)'];
  
  return (
    <View
      style={[
        styles.leaderboardItem,
        rank === 1 && styles.leaderboardItemFirst,
      ]}
    >
      <View
        style={[
          styles.rankBadge,
          { backgroundColor: rankBgColors[rank] || 'rgba(255, 255, 255, 0.1)' },
        ]}
      >
        <Text style={[styles.rankText, rank <= 3 && { color: rankColors[rank] }]}>
          {rank}
        </Text>
      </View>
      
      <View style={[styles.memberAvatar, member.isOnline && styles.memberAvatarOnline]}>
        <Text style={styles.memberAvatarText}>{member.avatar}</Text>
      </View>
      
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{member.name}</Text>
        <Text style={styles.memberStats}>完成 {weeklyHabits} 个习惯</Text>
      </View>
      
      <View style={styles.memberStarDust}>
        <Text style={[styles.starDustAmount, rank <= 3 && { color: rankColors[rank] || colors.text.primary }]}>
          {weeklyStarDust.toLocaleString()}
        </Text>
        <Text style={styles.starDustLabel}>星尘</Text>
      </View>
      
      {rank > 2 && onEncourage && (
        <TouchableOpacity style={styles.encourageBtn} onPress={onEncourage}>
          <Ionicons name="heart" size={14} color="#fff" />
          <Text style={styles.encourageBtnText}>加油</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// 动态项
const ActivityItem: React.FC<{
  activity: FamilyActivity;
  member: User;
  onLike: () => void;
  currentUserId: string;
}> = ({ activity, member, onLike, currentUserId }) => {
  const isLiked = activity.likedBy.includes(currentUserId);
  
  const activityColors: Record<string, string> = {
    habit_complete: colors.success.primary,
    medal_earned: colors.starDust.primary,
    planet_unlocked: colors.primary.purple,
    like: colors.primary.pink,
  };
  
  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityAvatar, { backgroundColor: activityColors[activity.type] + '30' }]}>
        <Text style={styles.activityAvatarText}>{member.avatar}</Text>
      </View>
      
      <View style={styles.activityContent}>
        <Text style={styles.activityText}>
          <Text style={styles.activityName}>{member.name}</Text>
          {' '}{activity.content}
        </Text>
        <Text style={styles.activityTime}>
          {getRelativeTime(activity.timestamp)}
        </Text>
      </View>
      
      <TouchableOpacity
        style={styles.likeBtn}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onLike();
        }}
      >
        <Ionicons
          name={isLiked ? 'heart' : 'heart-outline'}
          size={18}
          color={isLiked ? colors.primary.pink : colors.text.tertiary}
        />
        {activity.likes > 0 && (
          <Text style={[styles.likeCount, isLiked && { color: colors.primary.pink }]}>
            {activity.likes}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

// 获取相对时间
const getRelativeTime = (timestamp: string) => {
  const now = Date.now();
  const time = new Date(timestamp).getTime();
  const diff = now - time;
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  return `${days} 天前`;
};

export default function FamilyScreen() {
  const { user, family, familyTasks, familyActivities, likeActivity } = useAppStore();
  
  if (!family) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>暂未加入家庭</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }
  
  // 模拟每周数据
  const weeklyData = family.members.map((member, index) => ({
    member,
    weeklyHabits: [28, 25, 22, 18][index] || 10,
    weeklyStarDust: [1240, 1120, 980, 780][index] || 500,
  })).sort((a, b) => b.weeklyStarDust - a.weeklyStarDust);
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 页面标题 */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>家庭空间</Text>
              <Text style={styles.subtitle}>全家一起养成好习惯</Text>
            </View>
          </View>
          
          {/* 家庭横幅 */}
          <LinearGradient
            colors={[colors.success.light, 'rgba(76, 217, 100, 0.1)']}
            style={styles.familyBanner}
          >
            <View style={styles.bannerHeader}>
              <View>
                <Text style={styles.familyName}>{family.name}</Text>
                <Text style={styles.familyInfo}>
                  {family.members.length}位成员 · 创建于{Math.floor((Date.now() - new Date(family.createdAt).getTime()) / (1000 * 60 * 60 * 24))}天前
                </Text>
              </View>
              <TouchableOpacity style={styles.manageBtn}>
                <Ionicons name="settings-outline" size={16} color={colors.text.primary} />
                <Text style={styles.manageBtnText}>管理</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.membersList}>
              {family.members.map(member => (
                <View
                  key={member.id}
                  style={[styles.memberAvatarLarge, member.isOnline && styles.memberAvatarOnline]}
                >
                  <Text style={styles.memberAvatarLargeText}>{member.avatar}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
          
          {/* 家庭任务 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="flag" size={18} color={colors.success.primary} />
              <Text style={styles.sectionTitle}>家庭共同任务</Text>
            </View>
            
            {familyTasks.map(task => (
              <FamilyTaskCard key={task.id} task={task} members={family.members} />
            ))}
          </View>
          
          {/* 排行榜 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="trophy" size={18} color={colors.starDust.primary} />
              <Text style={styles.sectionTitle}>本周排行榜</Text>
            </View>
            
            {weeklyData.map((data, index) => (
              <LeaderboardItem
                key={data.member.id}
                member={data.member}
                rank={index + 1}
                weeklyHabits={data.weeklyHabits}
                weeklyStarDust={data.weeklyStarDust}
                onEncourage={index > 1 ? () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success) : undefined}
              />
            ))}
          </View>
          
          {/* 家庭动态 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="flash" size={18} color={colors.primary.blue} />
              <Text style={styles.sectionTitle}>最新动态</Text>
            </View>
            
            <View style={styles.activitiesCard}>
              {familyActivities.map(activity => {
                const member = family.members.find(m => m.id === activity.userId);
                if (!member) return null;
                
                return (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    member={member}
                    onLike={() => likeActivity(activity.id)}
                    currentUserId={user.id}
                  />
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1a27',
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
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  familyBanner: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(76, 217, 100, 0.2)',
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  familyName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  familyInfo: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  manageBtnText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  membersList: {
    flexDirection: 'row',
    gap: 16,
  },
  memberAvatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarOnline: {
    borderWidth: 3,
    borderColor: colors.success.primary,
  },
  memberAvatarLargeText: {
    fontSize: 28,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  taskCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 217, 100, 0.3)',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskIcon: {
    fontSize: 32,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  taskDescription: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  taskProgress: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.success.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantAvatars: {
    flexDirection: 'row',
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0a1a27',
  },
  miniAvatarText: {
    fontSize: 14,
  },
  taskCount: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    marginBottom: 10,
  },
  leaderboardItemFirst: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    fontSize: 24,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  memberStats: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  memberStarDust: {
    alignItems: 'flex-end',
  },
  starDustAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  starDustLabel: {
    fontSize: 12,
    color: colors.text.disabled,
  },
  encourageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary.pink,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  encourageBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  activitiesCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  activityAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityAvatarText: {
    fontSize: 18,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  activityName: {
    fontWeight: '700',
  },
  activityTime: {
    fontSize: 12,
    color: colors.text.disabled,
    marginTop: 4,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeCount: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.tertiary,
  },
});

