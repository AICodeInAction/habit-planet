import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAppStore } from '../store/useAppStore';
import { colors, gradients, theme } from '../theme';
import { generateCalendarData } from '../services/mockData';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

// 日历组件
const HabitCalendar: React.FC = () => {
  const calendarData = generateCalendarData(2024, 10); // 11月
  const weekDays = ['一', '二', '三', '四', '五', '六', '日'];
  
  // 计算本月第一天是星期几
  const firstDayOfMonth = new Date(2024, 10, 1).getDay();
  const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  const levelColors = [
    'rgba(255, 255, 255, 0.05)',  // level 0
    'rgba(76, 217, 100, 0.2)',    // level 1
    'rgba(76, 217, 100, 0.4)',    // level 2
    'rgba(76, 217, 100, 0.6)',    // level 3
    'rgba(76, 217, 100, 0.9)',    // level 4
  ];
  
  return (
    <View style={styles.calendarContainer}>
      {/* 星期标题 */}
      <View style={styles.weekDaysRow}>
        {weekDays.map(day => (
          <Text key={day} style={styles.weekDayText}>{day}</Text>
        ))}
      </View>
      
      {/* 日期格子 */}
      <View style={styles.calendarGrid}>
        {/* 空白格子 */}
        {Array.from({ length: offset }).map((_, i) => (
          <View key={`empty-${i}`} style={styles.calendarDayEmpty} />
        ))}
        
        {/* 日期 */}
        {calendarData.map((day, index) => {
          const dayNum = index + 1;
          const isToday = dayNum === 26; // 今天
          
          return (
            <View
              key={day.date}
              style={[
                styles.calendarDay,
                { backgroundColor: levelColors[day.completionLevel] },
                isToday && styles.calendarDayToday,
              ]}
            >
              <Text style={[styles.calendarDayText, isToday && styles.calendarDayTextToday]}>
                {dayNum}
              </Text>
            </View>
          );
        })}
      </View>
      
      {/* 图例 */}
      <View style={styles.legend}>
        <Text style={styles.legendLabel}>少</Text>
        {levelColors.map((color, i) => (
          <View key={i} style={[styles.legendBox, { backgroundColor: color }]} />
        ))}
        <Text style={styles.legendLabel}>多</Text>
      </View>
    </View>
  );
};

// 菜单项组件
const MenuItem: React.FC<{
  icon: string;
  iconColors: [string, string];
  title: string;
  subtitle: string;
  onPress: () => void;
}> = ({ icon, iconColors, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <LinearGradient colors={iconColors} style={styles.menuIcon}>
      <Ionicons name={icon as any} size={20} color="#fff" />
    </LinearGradient>
    <View style={styles.menuContent}>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuSubtitle}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={colors.text.disabled} />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, medals, planets } = useAppStore();
  
  const earnedMedals = medals.filter(m => m.isEarned);
  const unlockedPlanets = planets.filter(p => p.isUnlocked);
  
  const progress = user.experience / user.experienceToNextLevel;
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 设置按钮 */}
          <View style={styles.topBar}>
            <View />
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Ionicons name="settings-outline" size={24} color={colors.text.tertiary} />
            </TouchableOpacity>
          </View>
          
          {/* 个人信息头部 */}
          <View style={styles.profileHero}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={[colors.primary.pink, colors.primary.purple]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>{user.avatar}</Text>
              </LinearGradient>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>Lv.{user.level}</Text>
              </View>
              <TouchableOpacity style={styles.editBtn}>
                <Ionicons name="pencil" size={12} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userTitle}>{user.title}</Text>
            
            {/* 经验值进度 */}
            <View style={styles.xpContainer}>
              <View style={styles.xpHeader}>
                <Text style={styles.xpLabel}>等级进度</Text>
                <Text style={styles.xpValue}>
                  {user.experience.toLocaleString()} / {user.experienceToNextLevel.toLocaleString()} XP
                </Text>
              </View>
              <View style={styles.xpBar}>
                <LinearGradient
                  colors={[colors.primary.purple, colors.primary.pink]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.xpFill, { width: `${progress * 100}%` }]}
                />
              </View>
            </View>
          </View>
          
          {/* 统计卡片 */}
          <View style={styles.statsCard}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user.streakDays}</Text>
                <Text style={styles.statLabel}>连续天数</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user.totalHabitsCompleted}</Text>
                <Text style={styles.statLabel}>完成习惯</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{earnedMedals.length}</Text>
                <Text style={styles.statLabel}>奖牌</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{unlockedPlanets.length}</Text>
                <Text style={styles.statLabel}>星球</Text>
              </View>
            </View>
          </View>
          
          {/* 打卡日历 */}
          <View style={styles.calendarCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar" size={18} color={colors.primary.blue} />
              <Text style={styles.sectionTitle}>11月打卡记录</Text>
            </View>
            <HabitCalendar />
          </View>
          
          {/* 最近成就 */}
          <View style={styles.achievementsCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="trophy" size={18} color={colors.starDust.primary} />
              <Text style={styles.sectionTitle}>最近成就</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.achievementsScroll}
            >
              {earnedMedals.slice(0, 5).map(medal => (
                <View key={medal.id} style={styles.achievementItem}>
                  <View style={styles.achievementIcon}>
                    <Text style={styles.achievementIconText}>{medal.icon}</Text>
                  </View>
                  <Text style={styles.achievementName}>{medal.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          
          {/* 菜单列表 */}
          <View style={styles.menuSection}>
            <MenuItem
              icon="stats-chart"
              iconColors={['#4da8ff', '#00bcd4']}
              title="数据统计"
              subtitle="查看详细统计报告"
              onPress={() => {}}
            />
            <MenuItem
              icon="gift"
              iconColors={['#9c27b0', '#e91e63']}
              title="星尘商店"
              subtitle="兑换精美装饰"
              onPress={() => {}}
            />
            <MenuItem
              icon="share-social"
              iconColors={['#4cd964', '#00bfa5']}
              title="分享成就"
              subtitle="和朋友分享你的进步"
              onPress={() => {}}
            />
            <MenuItem
              icon="help-circle"
              iconColors={['#ff9500', '#ff5722']}
              title="帮助与反馈"
              subtitle="联系我们"
              onPress={() => {}}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0a27',
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  profileHero: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(196, 77, 255, 0.5)',
  },
  avatarText: {
    fontSize: 50,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: colors.starDust.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000',
  },
  editBtn: {
    position: 'absolute',
    top: 0,
    right: -5,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 16,
  },
  userTitle: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  xpContainer: {
    width: width - 80,
    marginTop: 16,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpLabel: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  xpValue: {
    fontSize: 14,
    color: colors.primary.purple,
  },
  xpBar: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    borderRadius: 5,
  },
  statsCard: {
    marginHorizontal: 20,
    backgroundColor: colors.card.background,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary.blue,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  calendarCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: colors.card.background,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  calendarContainer: {},
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekDayText: {
    fontSize: 12,
    color: colors.text.disabled,
    width: 36,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  calendarDay: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayEmpty: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
  },
  calendarDayToday: {
    borderWidth: 2,
    borderColor: colors.primary.blue,
  },
  calendarDayText: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: '600',
  },
  calendarDayTextToday: {
    color: colors.primary.blue,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 16,
  },
  legendLabel: {
    fontSize: 12,
    color: colors.text.disabled,
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  achievementsCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: colors.card.background,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  achievementsScroll: {
    gap: 16,
  },
  achievementItem: {
    alignItems: 'center',
    gap: 8,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementIconText: {
    fontSize: 24,
  },
  achievementName: {
    fontSize: 12,
    color: colors.text.primary,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    marginBottom: 10,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  menuSubtitle: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginTop: 2,
  },
});

