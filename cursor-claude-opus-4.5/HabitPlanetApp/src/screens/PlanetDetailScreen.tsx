import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { useAppStore } from '../store/useAppStore';
import { colors, gradients, theme } from '../theme';
import { StarField } from '../components/common/StarField';
import { RootStackParamList, Decoration } from '../types';

type RouteProps = RouteProp<RootStackParamList, 'PlanetDetail'>;

const { width } = Dimensions.get('window');

// 装饰品卡片
const DecorationCard: React.FC<{
  decoration: Decoration;
  onPurchase: () => void;
  starDust: number;
}> = ({ decoration, onPurchase, starDust }) => {
  const canAfford = starDust >= decoration.cost;
  
  return (
    <TouchableOpacity
      style={[
        styles.decorationCard,
        decoration.isOwned && styles.decorationCardOwned,
        !decoration.isOwned && !canAfford && styles.decorationCardLocked,
      ]}
      onPress={!decoration.isOwned ? onPurchase : undefined}
      disabled={decoration.isOwned}
    >
      <Text style={styles.decorationIcon}>{decoration.icon}</Text>
      <Text style={styles.decorationName}>{decoration.name}</Text>
      {decoration.isOwned ? (
        <Text style={styles.decorationOwned}>已拥有</Text>
      ) : (
        <Text style={[styles.decorationCost, !canAfford && styles.decorationCostLocked]}>
          {decoration.cost}星尘
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default function PlanetDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const { planetId } = route.params;
  
  const { planets, user, purchaseDecoration } = useAppStore();
  const planet = planets.find(p => p.id === planetId);
  
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // 星球旋转动画
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  
  if (!planet) {
    return null;
  }
  
  const planetColors = colors.planets[planet.id.replace('planet-', '') as keyof typeof colors.planets]
    || [planet.color, planet.color];
  
  const ownedCount = planet.decorations.filter(d => d.isOwned).length;
  const totalCount = planet.decorations.length;
  
  const handlePurchase = (decoration: Decoration) => {
    if (user.starDust < decoration.cost) {
      Alert.alert('星尘不足', '继续完成习惯来获取更多星尘吧！');
      return;
    }
    
    Alert.alert(
      '购买装饰',
      `确定花费 ${decoration.cost} 星尘购买「${decoration.name}」吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '购买',
          onPress: () => {
            const success = purchaseDecoration(planetId, decoration.id);
            if (success) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          },
        },
      ]
    );
  };
  
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <View style={styles.container}>
      <StarField starCount={60} />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* 导航栏 */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>{planet.name}</Text>
          <View style={{ width: 40 }} />
        </View>
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 星球展示区 */}
          <View style={styles.planetHero}>
            {/* 装饰物 */}
            <Text style={[styles.decoration, { top: 40, left: 40 }]}>🚀</Text>
            <Text style={[styles.decoration, { top: 60, right: 50 }]}>🛸</Text>
            <Text style={[styles.decoration, { bottom: 80, left: 60 }]}>🌟</Text>
            <Text style={[styles.decoration, { bottom: 60, right: 40 }]}>⭐</Text>
            
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <LinearGradient
                colors={planetColors as [string, string, ...string[]]}
                style={styles.planetOrb}
              />
            </Animated.View>
          </View>
          
          {/* 星球信息卡片 */}
          <View style={styles.infoSection}>
            <LinearGradient
              colors={[`${planet.color}30`, `${planet.color}10`]}
              style={styles.infoCard}
            >
              <View style={styles.infoHeader}>
                <View>
                  <Text style={styles.planetName}>{planet.icon} {planet.name}</Text>
                  <Text style={styles.planetDescription}>{planet.description}</Text>
                </View>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>Lv.{planet.level}</Text>
                  <Text style={styles.levelLabel}>星球等级</Text>
                </View>
              </View>
              
              <View style={styles.statsBadges}>
                <View style={styles.statBadge}>
                  <Ionicons name="calendar-outline" size={16} color={colors.success.primary} />
                  <Text style={styles.statText}>
                    解锁于 {planet.unlockedAt ? Math.floor((Date.now() - new Date(planet.unlockedAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}天前
                  </Text>
                </View>
                <View style={styles.statBadge}>
                  <Ionicons name="diamond-outline" size={16} color={colors.primary.purple} />
                  <Text style={styles.statText}>{ownedCount}/{totalCount} 收集</Text>
                </View>
              </View>
              
              <Text style={styles.descriptionText}>
                {planet.description}
              </Text>
            </LinearGradient>
          </View>
          
          {/* 装饰品收集 */}
          {planet.decorations.length > 0 && (
            <View style={styles.decorationsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>星球装饰</Text>
                <Text style={styles.sectionSubtitle}>{ownedCount}/{totalCount} 已解锁</Text>
              </View>
              
              <View style={styles.decorationsGrid}>
                {planet.decorations.map(decoration => (
                  <DecorationCard
                    key={decoration.id}
                    decoration={decoration}
                    onPurchase={() => handlePurchase(decoration)}
                    starDust={user.starDust}
                  />
                ))}
              </View>
            </View>
          )}
          
          {/* 星球加成 */}
          {planet.bonus && (
            <View style={styles.bonusSection}>
              <Text style={styles.sectionTitle}>星球加成</Text>
              <LinearGradient
                colors={['rgba(156, 39, 176, 0.3)', 'rgba(233, 30, 99, 0.2)']}
                style={styles.bonusCard}
              >
                <View style={styles.bonusIcon}>
                  <Text style={{ fontSize: 28 }}>⚡</Text>
                </View>
                <View style={styles.bonusInfo}>
                  <Text style={styles.bonusTitle}>{planet.bonus.type === 'courage' ? '勇气加成' : planet.bonus.type}</Text>
                  <Text style={styles.bonusDescription}>{planet.bonus.description}</Text>
                </View>
              </LinearGradient>
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
    backgroundColor: '#1a0a0a',
  },
  safeArea: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  planetHero: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  decoration: {
    position: 'absolute',
    fontSize: 28,
  },
  planetOrb: {
    width: 180,
    height: 180,
    borderRadius: 90,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginTop: -20,
  },
  infoCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planetName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  planetDescription: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  levelBadge: {
    alignItems: 'flex-end',
  },
  levelText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ff6b6b',
  },
  levelLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  statsBadges: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statText: {
    fontSize: 13,
    color: colors.text.primary,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  decorationsSection: {
    paddingHorizontal: 20,
    marginTop: 24,
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
  sectionSubtitle: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  decorationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  decorationCard: {
    width: (width - 64) / 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  decorationCardOwned: {
    borderColor: 'rgba(76, 217, 100, 0.3)',
    backgroundColor: 'rgba(76, 217, 100, 0.1)',
  },
  decorationCardLocked: {
    opacity: 0.5,
  },
  decorationIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  decorationName: {
    fontSize: 11,
    color: colors.text.primary,
    textAlign: 'center',
  },
  decorationOwned: {
    fontSize: 10,
    color: colors.success.primary,
    marginTop: 4,
  },
  decorationCost: {
    fontSize: 10,
    color: colors.starDust.primary,
    marginTop: 4,
  },
  decorationCostLocked: {
    color: colors.text.disabled,
  },
  bonusSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  bonusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(156, 39, 176, 0.2)',
    marginTop: 16,
  },
  bonusIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(156, 39, 176, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bonusInfo: {
    flex: 1,
  },
  bonusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  bonusDescription: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 4,
  },
});

