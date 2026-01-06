import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { colors, gradients, theme } from '../theme';

// 开关组件
const Toggle: React.FC<{
  value: boolean;
  onValueChange: (value: boolean) => void;
}> = ({ value, onValueChange }) => (
  <TouchableOpacity
    style={[styles.toggle, value && styles.toggleActive]}
    onPress={() => {
      Haptics.selectionAsync();
      onValueChange(!value);
    }}
  >
    <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
  </TouchableOpacity>
);

// 设置项组件
const SettingItem: React.FC<{
  icon: string;
  iconColors: [string, string];
  title: string;
  subtitle?: string;
  value?: string;
  hasToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
}> = ({
  icon,
  iconColors,
  title,
  subtitle,
  value,
  hasToggle,
  toggleValue,
  onToggle,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    disabled={hasToggle}
  >
    <LinearGradient colors={iconColors} style={styles.settingIcon}>
      <Ionicons name={icon as any} size={16} color="#fff" />
    </LinearGradient>
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    {hasToggle && onToggle ? (
      <Toggle value={toggleValue || false} onValueChange={onToggle} />
    ) : value ? (
      <View style={styles.settingValueContainer}>
        <Text style={styles.settingValue}>{value}</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.text.disabled} />
      </View>
    ) : (
      <Ionicons name="chevron-forward" size={20} color={colors.text.disabled} />
    )}
  </TouchableOpacity>
);

// 设置分区组件
const SettingsSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

export default function SettingsScreen() {
  const navigation = useNavigation();
  
  // 设置状态
  const [habitReminder, setHabitReminder] = useState(true);
  const [achievementNotification, setAchievementNotification] = useState(true);
  const [familyActivity, setFamilyActivity] = useState(true);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [animations, setAnimations] = useState(true);
  
  const handleLogout = () => {
    Alert.alert(
      '退出登录',
      '确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        { text: '退出', style: 'destructive', onPress: () => {} },
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* 导航栏 */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>设置</Text>
          <View style={{ width: 40 }} />
        </View>
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 会员横幅 */}
          <LinearGradient
            colors={['#ffd700', '#ff8c00', '#ff6347']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.premiumBanner}
          >
            <View>
              <Text style={styles.premiumTitle}>升级到星际会员 🚀</Text>
              <Text style={styles.premiumSubtitle}>解锁全部星球、无限装饰和专属奖牌</Text>
            </View>
            <TouchableOpacity style={styles.premiumBtn}>
              <Text style={styles.premiumBtnText}>立即升级</Text>
            </TouchableOpacity>
          </LinearGradient>
          
          {/* 账号设置 */}
          <SettingsSection title="账号设置">
            <SettingItem
              icon="person"
              iconColors={['#4da8ff', '#00bcd4']}
              title="个人资料"
              subtitle="编辑头像、昵称等"
              onPress={() => {}}
            />
            <SettingItem
              icon="people"
              iconColors={['#9c27b0', '#e91e63']}
              title="家庭管理"
              subtitle="管理家庭成员"
              onPress={() => {}}
            />
            <SettingItem
              icon="shield-checkmark"
              iconColors={['#4cd964', '#00bfa5']}
              title="隐私设置"
              subtitle="数据与隐私保护"
              onPress={() => {}}
            />
          </SettingsSection>
          
          {/* 通知设置 */}
          <SettingsSection title="通知与提醒">
            <SettingItem
              icon="notifications"
              iconColors={['#ff6b6b', '#ff8e53']}
              title="习惯提醒"
              subtitle="按时完成习惯打卡"
              hasToggle
              toggleValue={habitReminder}
              onToggle={setHabitReminder}
            />
            <SettingItem
              icon="trophy"
              iconColors={['#ffd700', '#ff8c00']}
              title="成就通知"
              subtitle="获得新奖牌时提醒"
              hasToggle
              toggleValue={achievementNotification}
              onToggle={setAchievementNotification}
            />
            <SettingItem
              icon="heart"
              iconColors={['#ff6b9d', '#e91e63']}
              title="家人动态"
              subtitle="家人完成习惯时提醒"
              hasToggle
              toggleValue={familyActivity}
              onToggle={setFamilyActivity}
            />
            <SettingItem
              icon="moon"
              iconColors={['#6366f1', '#8b5cf6']}
              title="免打扰模式"
              subtitle="22:00 - 08:00"
              hasToggle
              toggleValue={doNotDisturb}
              onToggle={setDoNotDisturb}
            />
          </SettingsSection>
          
          {/* 显示设置 */}
          <SettingsSection title="显示与声音">
            <SettingItem
              icon="moon"
              iconColors={['#4b5563', '#1f2937']}
              title="深色模式"
              hasToggle
              toggleValue={darkMode}
              onToggle={setDarkMode}
            />
            <SettingItem
              icon="volume-high"
              iconColors={['#06b6d4', '#0891b2']}
              title="音效"
              hasToggle
              toggleValue={soundEffects}
              onToggle={setSoundEffects}
            />
            <SettingItem
              icon="sparkles"
              iconColors={['#a855f7', '#d946ef']}
              title="动画效果"
              hasToggle
              toggleValue={animations}
              onToggle={setAnimations}
            />
            <SettingItem
              icon="language"
              iconColors={['#10b981', '#059669']}
              title="语言"
              value="简体中文"
              onPress={() => {}}
            />
          </SettingsSection>
          
          {/* 关于 */}
          <SettingsSection title="关于">
            <SettingItem
              icon="star"
              iconColors={['#4da8ff', '#6366f1']}
              title="给我们评分"
              onPress={() => {}}
            />
            <SettingItem
              icon="share"
              iconColors={['#14b8a6', '#06b6d4']}
              title="分享给朋友"
              onPress={() => {}}
            />
            <SettingItem
              icon="help-circle"
              iconColors={['#f59e0b', '#eab308']}
              title="帮助中心"
              onPress={() => {}}
            />
            <SettingItem
              icon="document-text"
              iconColors={['#6b7280', '#4b5563']}
              title="用户协议"
              onPress={() => {}}
            />
            <SettingItem
              icon="lock-closed"
              iconColors={['#78716c', '#57534e']}
              title="隐私政策"
              onPress={() => {}}
            />
          </SettingsSection>
          
          {/* 退出登录 */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color={colors.danger.primary} />
            <Text style={styles.logoutBtnText}>退出登录</Text>
          </TouchableOpacity>
          
          {/* 版本信息 */}
          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>习惯星球 v1.0.0</Text>
            <Text style={styles.versionSubtext}>Made with ❤️ for better habits</Text>
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
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  premiumBanner: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  premiumSubtitle: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.7)',
    marginTop: 4,
  },
  premiumBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  premiumBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionContent: {
    backgroundColor: colors.card.background,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  settingSubtitle: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  settingValue: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  toggle: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 4,
  },
  toggleActive: {
    backgroundColor: colors.primary.blue,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  toggleThumbActive: {
    marginLeft: 'auto',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: colors.danger.light,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
    marginTop: 10,
  },
  logoutBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.danger.primary,
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  versionText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  versionSubtext: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.3)',
    marginTop: 4,
  },
});

