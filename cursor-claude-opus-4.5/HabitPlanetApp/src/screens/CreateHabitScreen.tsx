import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
// Custom Slider Component
const CustomSlider: React.FC<{
  value: number;
  minimumValue: number;
  maximumValue: number;
  step: number;
  onValueChange: (value: number) => void;
}> = ({ value, minimumValue, maximumValue, step, onValueChange }) => {
  const progress = (value - minimumValue) / (maximumValue - minimumValue);
  
  return (
    <View style={{ width: '100%', height: 40, justifyContent: 'center' }}>
      <View style={{ 
        height: 8, 
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: 4,
        overflow: 'hidden',
      }}>
        <View style={{ 
          height: '100%', 
          width: `${progress * 100}%`,
          backgroundColor: colors.starDust.primary,
          borderRadius: 4,
        }} />
      </View>
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        marginTop: 12,
      }}>
        {[10, 25, 45, 60, 80, 100].map(v => (
          <TouchableOpacity 
            key={v}
            onPress={() => onValueChange(v)}
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              backgroundColor: value === v ? colors.starDust.light : 'transparent',
            }}
          >
            <Text style={{ 
              fontSize: 12, 
              color: value === v ? colors.starDust.primary : colors.text.disabled,
              fontWeight: value === v ? '700' : '400',
            }}>
              {v}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
import * as Haptics from 'expo-haptics';

import { useAppStore } from '../store/useAppStore';
import { colors, gradients, theme } from '../theme';
import { habitIcons, timeSlotOptions, frequencyOptions, weekDays } from '../services/mockData';
import { Habit } from '../types';

export default function CreateHabitScreen() {
  const navigation = useNavigation();
  const { addHabit, family } = useAppStore();
  
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📚');
  const [frequency, setFrequency] = useState<'daily' | 'weekdays' | 'custom'>('daily');
  const [selectedDays, setSelectedDays] = useState([0, 1, 2, 3, 4, 5, 6]);
  const [timeSlot, setTimeSlot] = useState<'morning' | 'afternoon' | 'evening' | 'anytime'>('morning');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [starDustReward, setStarDustReward] = useState(45);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  
  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('提示', '请输入习惯名称');
      return;
    }
    
    const newHabit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'totalCompleted'> = {
      name: name.trim(),
      icon: selectedIcon,
      description: `${timeSlotOptions.find(t => t.id === timeSlot)?.label || ''}完成`,
      frequency,
      customDays: frequency === 'custom' ? selectedDays : undefined,
      timeSlot,
      reminderTime: reminderEnabled ? reminderTime : undefined,
      reminderEnabled,
      starDustReward,
      familyMembers: selectedMembers.length > 0 ? selectedMembers : undefined,
    };
    
    addHabit(newHabit);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.goBack();
  };
  
  const toggleDay = (dayIndex: number) => {
    setSelectedDays(prev => 
      prev.includes(dayIndex)
        ? prev.filter(d => d !== dayIndex)
        : [...prev, dayIndex].sort()
    );
  };
  
  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* 导航栏 */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>创建新习惯</Text>
          <View style={{ width: 40 }} />
        </View>
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 习惯名称 */}
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>习惯名称</Text>
            <TextInput
              style={styles.input}
              placeholder="输入习惯名称，如：阅读30分钟"
              placeholderTextColor={colors.text.disabled}
              value={name}
              onChangeText={setName}
            />
          </View>
          
          {/* 选择图标 */}
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>选择图标</Text>
            <View style={styles.iconGrid}>
              {habitIcons.map(icon => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconItem,
                    selectedIcon === icon && styles.iconItemSelected,
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedIcon(icon);
                  }}
                >
                  <Text style={styles.iconText}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* 重复频率 */}
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>重复频率</Text>
            <View style={styles.frequencyRow}>
              {frequencyOptions.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.frequencyBtn,
                    frequency === option.id && styles.frequencyBtnSelected,
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setFrequency(option.id as typeof frequency);
                  }}
                >
                  <Text
                    style={[
                      styles.frequencyBtnText,
                      frequency === option.id && styles.frequencyBtnTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* 自定义日期 */}
            <View style={styles.daysRow}>
              {weekDays.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayBtn,
                    selectedDays.includes(index) && styles.dayBtnSelected,
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    toggleDay(index);
                  }}
                >
                  <Text
                    style={[
                      styles.dayBtnText,
                      selectedDays.includes(index) && styles.dayBtnTextSelected,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* 最佳完成时间 */}
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>最佳完成时间</Text>
            <View style={styles.timeSlotRow}>
              {timeSlotOptions.map(slot => (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.timeSlot,
                    timeSlot === slot.id && styles.timeSlotSelected,
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setTimeSlot(slot.id as typeof timeSlot);
                  }}
                >
                  <Text style={styles.timeSlotText}>
                    {slot.icon} {slot.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* 提醒设置 */}
          <View style={styles.formCard}>
            <View style={styles.toggleRow}>
              <Text style={styles.sectionTitle}>开启提醒</Text>
              <TouchableOpacity
                style={[
                  styles.toggle,
                  reminderEnabled && styles.toggleActive,
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setReminderEnabled(!reminderEnabled);
                }}
              >
                <View style={[
                  styles.toggleThumb,
                  reminderEnabled && styles.toggleThumbActive,
                ]} />
              </TouchableOpacity>
            </View>
            {reminderEnabled && (
              <TextInput
                style={[styles.input, { marginTop: 12 }]}
                placeholder="选择提醒时间"
                placeholderTextColor={colors.text.disabled}
                value={reminderTime}
                onChangeText={setReminderTime}
              />
            )}
          </View>
          
          {/* 星尘奖励 */}
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>完成奖励</Text>
            <View style={styles.rewardDisplay}>
              <Ionicons name="sparkles" size={20} color={colors.starDust.primary} />
              <Text style={styles.rewardAmount}>{starDustReward}</Text>
              <Text style={styles.rewardLabel}>星尘</Text>
            </View>
            <CustomSlider
              value={starDustReward}
              minimumValue={10}
              maximumValue={100}
              step={5}
              onValueChange={setStarDustReward}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>简单</Text>
              <Text style={styles.sliderLabel}>中等</Text>
              <Text style={styles.sliderLabel}>困难</Text>
            </View>
          </View>
          
          {/* 邀请家人 */}
          {family && (
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>邀请家人一起</Text>
              <View style={styles.membersRow}>
                {family.members.filter(m => m.id !== 'user-1').map(member => (
                  <TouchableOpacity
                    key={member.id}
                    style={styles.memberItem}
                    onPress={() => {
                      Haptics.selectionAsync();
                      toggleMember(member.id);
                    }}
                  >
                    <View
                      style={[
                        styles.memberAvatar,
                        selectedMembers.includes(member.id) && styles.memberAvatarSelected,
                      ]}
                    >
                      <Text style={styles.memberAvatarText}>{member.avatar}</Text>
                      {selectedMembers.includes(member.id) && (
                        <View style={styles.memberCheck}>
                          <Ionicons name="checkmark" size={10} color="#fff" />
                        </View>
                      )}
                    </View>
                    <Text style={styles.memberName}>{member.name}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.memberItem}>
                  <View style={styles.memberAvatarAdd}>
                    <Ionicons name="add" size={24} color={colors.text.disabled} />
                  </View>
                  <Text style={styles.memberNameAdd}>添加</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {/* 提交按钮 */}
          <TouchableOpacity onPress={handleSave}>
            <LinearGradient
              colors={gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.submitBtn}
            >
              <Ionicons name="rocket" size={20} color="#fff" />
              <Text style={styles.submitBtnText}>创建习惯</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  closeButton: {
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
  formCard: {
    backgroundColor: colors.card.background,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 14,
    color: colors.text.primary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  iconItem: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconItemSelected: {
    borderColor: colors.primary.blue,
    backgroundColor: 'rgba(77, 168, 255, 0.2)',
  },
  iconText: {
    fontSize: 24,
  },
  frequencyRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  frequencyBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  frequencyBtnSelected: {
    borderColor: colors.primary.blue,
    backgroundColor: 'rgba(77, 168, 255, 0.2)',
  },
  frequencyBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  frequencyBtnTextSelected: {
    color: colors.primary.blue,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dayBtnSelected: {
    borderColor: colors.primary.blue,
    backgroundColor: 'rgba(77, 168, 255, 0.3)',
  },
  dayBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
  },
  dayBtnTextSelected: {
    color: colors.primary.blue,
  },
  timeSlotRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeSlotSelected: {
    borderColor: colors.primary.purple,
    backgroundColor: 'rgba(196, 77, 255, 0.2)',
  },
  timeSlotText: {
    fontSize: 13,
    color: colors.text.primary,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggle: {
    width: 56,
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
  rewardDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  rewardAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.starDust.primary,
  },
  rewardLabel: {
    fontSize: 16,
    color: colors.text.tertiary,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
    color: colors.text.disabled,
  },
  membersRow: {
    flexDirection: 'row',
    gap: 16,
  },
  memberItem: {
    alignItems: 'center',
    gap: 8,
  },
  memberAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  memberAvatarSelected: {
    borderColor: colors.success.primary,
  },
  memberAvatarText: {
    fontSize: 28,
  },
  memberCheck: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 12,
    color: colors.text.primary,
  },
  memberAvatarAdd: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberNameAdd: {
    fontSize: 12,
    color: colors.text.disabled,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 8,
  },
  submitBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});

