import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';

import { useAppStore } from '../store/useAppStore';
import { colors, gradients, theme } from '../theme';
import { StarField } from '../components/common/StarField';
import { RootStackParamList, Planet } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

// 星球组件
const PlanetOrb: React.FC<{
  planet: Planet;
  position: { top: number; left: number };
  size: number;
  onPress: () => void;
}> = ({ planet, position, size, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // 浮动动画
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.15,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
  
  const planetColors = colors.planets[planet.id.replace('planet-', '') as keyof typeof colors.planets] 
    || [planet.color, planet.color];
  
  return (
    <Animated.View
      style={[
        styles.planetContainer,
        {
          top: position.top,
          left: position.left,
          transform: [
            { scale: scaleAnim },
            { translateY: floatAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View
          style={[
            styles.planet,
            {
              width: size,
              height: size,
              opacity: planet.isUnlocked ? 1 : 0.5,
            },
          ]}
        >
          <LinearGradient
            colors={planetColors as [string, string, ...string[]]}
            style={[styles.planetGradient, { borderRadius: size / 2 }]}
          />
          
          {/* 锁定图标 */}
          {!planet.isUnlocked && (
            <View style={styles.lockOverlay}>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
          )}
        </View>
        
        {/* 星球名称标签 */}
        <View style={styles.planetLabel}>
          <Text style={styles.planetLabelText}>
            {planet.icon} {planet.name}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// 进度卡片组件
const ProgressCard: React.FC<{
  nextPlanet: Planet | null;
  currentStarDust: number;
}> = ({ nextPlanet, currentStarDust }) => {
  if (!nextPlanet) {
    return (
      <LinearGradient
        colors={[colors.card.background, colors.card.backgroundLight]}
        style={styles.progressCard}
      >
        <View style={styles.progressCardContent}>
          <Text style={styles.progressTitle}>🎉 恭喜！</Text>
          <Text style={styles.progressSubtitle}>你已解锁所有星球！</Text>
        </View>
      </LinearGradient>
    );
  }
  
  const progress = Math.min(currentStarDust / nextPlanet.unlockCost, 1);
  const remaining = Math.max(0, nextPlanet.unlockCost - currentStarDust);
  
  return (
    <LinearGradient
      colors={[colors.card.background, colors.card.backgroundLight]}
      style={styles.progressCard}
    >
      <View style={styles.progressCardContent}>
        <View style={styles.progressInfo}>
          <View style={styles.nextPlanetIcon}>
            <Text style={{ fontSize: 32 }}>{nextPlanet.icon}</Text>
          </View>
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressTitle}>下一站：{nextPlanet.name}</Text>
            <Text style={styles.progressSubtitle}>
              还需 {remaining.toLocaleString()} 星尘即可解锁
            </Text>
          </View>
        </View>
        
        <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
      </View>
      
      {/* 进度条 */}
      <View style={styles.progressBar}>
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${progress * 100}%` }]}
        />
      </View>
      
      <View style={styles.progressFooter}>
        <Text style={styles.progressFooterText}>
          {currentStarDust.toLocaleString()} / {nextPlanet.unlockCost.toLocaleString()} 星尘
        </Text>
        <Text style={styles.progressFooterText}>
          预计 {Math.ceil(remaining / 150)} 天后解锁
        </Text>
      </View>
    </LinearGradient>
  );
};

export default function GalaxyScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, planets } = useAppStore();
  
  // 找到下一个未解锁的星球
  const nextPlanet = planets.find(p => !p.isUnlocked);
  
  // 已解锁的星球
  const unlockedPlanets = planets.filter(p => p.isUnlocked);
  
  // 星球位置配置
  const planetPositions = [
    { top: 320, left: width / 2 - 40 },  // 地球 - 中心底部
    { top: 250, left: width * 0.2 },     // 火星
    { top: 150, left: width * 0.55 },    // 木星
    { top: 80, left: width * 0.25 },     // 土星
    { top: 50, left: width * 0.65 },     // 海王星
    { top: 130, left: width * 0.08 },    // 神秘星球
  ];
  
  const planetSizes = [80, 60, 90, 70, 55, 50];
  
  const handlePlanetPress = (planet: Planet) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (planet.isUnlocked) {
      navigation.navigate('PlanetDetail', { planetId: planet.id });
    }
  };
  
  return (
    <View style={styles.container}>
      <StarField starCount={80} />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 头部 */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.title}>星际探索</Text>
                <Text style={styles.subtitle}>收集星尘，解锁新星球</Text>
              </View>
              
              <View style={styles.starDustBadge}>
                <Ionicons name="sparkles" size={16} color={colors.starDust.primary} />
                <Text style={styles.starDustAmount}>
                  {user.starDust.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
          
          {/* 星系地图 */}
          <View style={styles.galaxyMap}>
            {/* 轨道线 */}
            <View style={[styles.orbit, { width: 180, height: 180, top: 270, left: width / 2 - 90 }]} />
            <View style={[styles.orbit, { width: 300, height: 300, top: 210, left: width / 2 - 150 }]} />
            <View style={[styles.orbit, { width: 420, height: 420, top: 150, left: width / 2 - 210 }]} />
            
            {/* 星球 */}
            {planets.map((planet, index) => (
              <PlanetOrb
                key={planet.id}
                planet={planet}
                position={planetPositions[index]}
                size={planetSizes[index]}
                onPress={() => handlePlanetPress(planet)}
              />
            ))}
            
            {/* 飞船 */}
            <Animated.Text style={styles.spaceship}>🚀</Animated.Text>
          </View>
          
          {/* 进度卡片 */}
          <View style={styles.progressSection}>
            <ProgressCard nextPlanet={nextPlanet || null} currentStarDust={user.starDust} />
          </View>
          
          {/* 已解锁星球列表 */}
          <View style={styles.unlockedSection}>
            <Text style={styles.sectionTitle}>已解锁星球</Text>
            <View style={styles.unlockedGrid}>
              {unlockedPlanets.map(planet => (
                <TouchableOpacity
                  key={planet.id}
                  style={styles.unlockedCard}
                  onPress={() => handlePlanetPress(planet)}
                >
                  <Text style={styles.unlockedIcon}>{planet.icon}</Text>
                  <Text style={styles.unlockedName}>{planet.name}</Text>
                  <Text style={styles.unlockedInfo}>
                    {planet.id === 'planet-1' ? '起点' : `${planet.decorations.filter(d => d.isOwned).length}个装饰`}
                  </Text>
                </TouchableOpacity>
              ))}
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
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  starDustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.starDust.light,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.25)',
  },
  starDustAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.starDust.primary,
  },
  galaxyMap: {
    height: 450,
    position: 'relative',
    marginTop: 20,
  },
  orbit: {
    position: 'absolute',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 1000,
  },
  planetContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  planet: {
    borderRadius: 100,
    overflow: 'hidden',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  planetGradient: {
    flex: 1,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 100,
  },
  lockIcon: {
    fontSize: 24,
  },
  planetLabel: {
    marginTop: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  planetLabelText: {
    fontSize: 11,
    color: colors.text.primary,
    fontWeight: '600',
  },
  spaceship: {
    position: 'absolute',
    fontSize: 32,
    top: 370,
    left: width * 0.6,
    transform: [{ rotate: '-10deg' }],
  },
  progressSection: {
    paddingHorizontal: 20,
    marginTop: -20,
  },
  progressCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  progressCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nextPlanetIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTextContainer: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  progressSubtitle: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  progressPercent: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.starDust.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressFooterText: {
    fontSize: 12,
    color: colors.text.disabled,
  },
  unlockedSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  unlockedGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  unlockedCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  unlockedIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  unlockedName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
  },
  unlockedInfo: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 2,
  },
});

