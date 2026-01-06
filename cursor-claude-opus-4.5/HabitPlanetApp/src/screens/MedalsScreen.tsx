import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useAppStore } from '../store/useAppStore';
import { colors, gradients, theme } from '../theme';
import { Medal } from '../types';

// 奖牌卡片组件
const MedalCard: React.FC<{ medal: Medal }> = ({ medal }) => {
  const tierColors = colors.medals[medal.tier];
  
  return (
    <View
      style={[
        styles.medalCard,
        medal.isEarned && styles.medalCardEarned,
        !medal.isEarned && styles.medalCardLocked,
        medal.isNew && styles.medalCardNew,
      ]}
    >
      {medal.isNew && <View style={styles.newBadge}><Text style={styles.newBadgeText}>NEW</Text></View>}
      
      <LinearGradient
        colors={medal.isEarned ? tierColors as [string, string] : ['#333', '#222']}
        style={styles.medalIcon}
      >
        {medal.isEarned && <View style={styles.shineEffect} />}
        <Text style={styles.medalIconText}>{medal.icon}</Text>
      </LinearGradient>
      
      <Text style={styles.medalName}>{medal.name}</Text>
      <Text style={styles.medalDescription}>{medal.description}</Text>
      
      <View style={styles.progressBadge}>
        {medal.isEarned ? (
          <>
            <Ionicons name="checkmark" size={12} color={colors.success.primary} />
            <Text style={styles.progressComplete}>已完成</Text>
          </>
        ) : (
          <Text style={styles.progressText}>
            {medal.progress}/{medal.requirement}
          </Text>
        )}
      </View>
    </View>
  );
};

// 分类标题组件
const CategoryTitle: React.FC<{ icon: string; title: string; color: string }> = ({
  icon,
  title,
  color,
}) => (
  <View style={styles.categoryTitle}>
    <Ionicons name={icon as any} size={18} color={color} />
    <Text style={styles.categoryTitleText}>{title}</Text>
  </View>
);

export default function MedalsScreen() {
  const { medals } = useAppStore();
  const [selectedTab, setSelectedTab] = useState<'all' | 'streak' | 'milestone' | 'special'>('all');
  
  // 统计奖牌
  const earnedMedals = medals.filter(m => m.isEarned);
  const goldCount = earnedMedals.filter(m => m.tier === 'gold').length;
  const silverCount = earnedMedals.filter(m => m.tier === 'silver').length;
  const bronzeCount = earnedMedals.filter(m => m.tier === 'bronze').length;
  
  // 过滤奖牌
  const filteredMedals = selectedTab === 'all'
    ? medals
    : medals.filter(m => m.category === selectedTab);
  
  const tabs = [
    { id: 'all', label: '全部' },
    { id: 'streak', label: '连续打卡' },
    { id: 'milestone', label: '里程碑' },
    { id: 'special', label: '特殊' },
  ];
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 头部统计 */}
          <View style={styles.header}>
            <Text style={styles.medalCount}>{earnedMedals.length}</Text>
            <Text style={styles.medalCountLabel}>已获得奖牌</Text>
            
            <View style={styles.tierStats}>
              <View style={styles.tierStat}>
                <Text style={[styles.tierCount, { color: colors.starDust.primary }]}>{goldCount}</Text>
                <Text style={styles.tierLabel}>金牌</Text>
              </View>
              <View style={styles.tierStat}>
                <Text style={[styles.tierCount, { color: '#c0c0c0' }]}>{silverCount}</Text>
                <Text style={styles.tierLabel}>银牌</Text>
              </View>
              <View style={styles.tierStat}>
                <Text style={[styles.tierCount, { color: '#cd7f32' }]}>{bronzeCount}</Text>
                <Text style={styles.tierLabel}>铜牌</Text>
              </View>
            </View>
          </View>
          
          {/* Tab 选择器 */}
          <View style={styles.tabSelector}>
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabBtn,
                  selectedTab === tab.id && styles.tabBtnActive,
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedTab(tab.id as typeof selectedTab);
                }}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    selectedTab === tab.id && styles.tabBtnTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* 连续打卡成就 */}
          {(selectedTab === 'all' || selectedTab === 'streak') && (
            <View style={styles.section}>
              <CategoryTitle
                icon="flame"
                title="连续打卡成就"
                color="#ff6b6b"
              />
              <View style={styles.medalsGrid}>
                {filteredMedals
                  .filter(m => m.category === 'streak')
                  .map(medal => (
                    <MedalCard key={medal.id} medal={medal} />
                  ))}
              </View>
            </View>
          )}
          
          {/* 里程碑成就 */}
          {(selectedTab === 'all' || selectedTab === 'milestone') && (
            <View style={styles.section}>
              <CategoryTitle
                icon="flag"
                title="里程碑成就"
                color={colors.primary.blue}
              />
              <View style={styles.medalsGrid}>
                {filteredMedals
                  .filter(m => m.category === 'milestone')
                  .map(medal => (
                    <MedalCard key={medal.id} medal={medal} />
                  ))}
              </View>
            </View>
          )}
          
          {/* 特殊成就 */}
          {(selectedTab === 'all' || selectedTab === 'special') && (
            <View style={styles.section}>
              <CategoryTitle
                icon="diamond"
                title="特殊成就"
                color={colors.primary.purple}
              />
              <View style={styles.medalsGrid}>
                {filteredMedals
                  .filter(m => m.category === 'special')
                  .map(medal => (
                    <MedalCard key={medal.id} medal={medal} />
                  ))}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a0a',
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
    alignItems: 'center',
    paddingVertical: 30,
  },
  medalCount: {
    fontSize: 72,
    fontWeight: '800',
    color: colors.starDust.primary,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 40,
  },
  medalCountLabel: {
    fontSize: 18,
    color: colors.text.tertiary,
  },
  tierStats: {
    flexDirection: 'row',
    gap: 48,
    marginTop: 24,
  },
  tierStat: {
    alignItems: 'center',
  },
  tierCount: {
    fontSize: 24,
    fontWeight: '700',
  },
  tierLabel: {
    fontSize: 12,
    color: colors.text.disabled,
    marginTop: 4,
  },
  tabSelector: {
    flexDirection: 'row',
    gap: 8,
    padding: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  tabBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.tertiary,
  },
  tabBtnTextActive: {
    color: colors.starDust.primary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  categoryTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  categoryTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  medalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  medalCard: {
    width: '48%',
    backgroundColor: colors.card.background,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
    position: 'relative',
    overflow: 'hidden',
  },
  medalCardEarned: {
    // 已获得状态
  },
  medalCardLocked: {
    opacity: 0.5,
  },
  medalCardNew: {
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  medalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  shineEffect: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  medalIconText: {
    fontSize: 36,
  },
  medalName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
  },
  medalDescription: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: 4,
  },
  progressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  progressComplete: {
    fontSize: 12,
    color: colors.success.primary,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 12,
    color: colors.starDust.primary,
    fontWeight: '600',
  },
});

