import { 
  User, 
  Habit, 
  HabitCompletion, 
  Family, 
  FamilyTask, 
  FamilyActivity,
  Planet, 
  Decoration, 
  Medal,
  CalendarDay 
} from '../types';

// 当前用户
export const currentUser: User = {
  id: 'user-1',
  name: '小星星',
  avatar: '👦',
  level: 12,
  experience: 2450,
  experienceToNextLevel: 3000,
  starDust: 2450,
  title: '宇宙探险家 · 习惯达人',
  streakDays: 12,
  totalHabitsCompleted: 156,
  joinedAt: '2024-10-01',
  familyId: 'family-1',
  isOnline: true,
};

// 家庭成员
export const familyMembers: User[] = [
  currentUser,
  {
    id: 'user-2',
    name: '妈妈',
    avatar: '👩',
    level: 15,
    experience: 1800,
    experienceToNextLevel: 2500,
    starDust: 1120,
    title: '习惯导师',
    streakDays: 18,
    totalHabitsCompleted: 210,
    joinedAt: '2024-10-01',
    familyId: 'family-1',
    isOnline: true,
  },
  {
    id: 'user-3',
    name: '爸爸',
    avatar: '👨',
    level: 10,
    experience: 1200,
    experienceToNextLevel: 2000,
    starDust: 980,
    title: '坚持者',
    streakDays: 8,
    totalHabitsCompleted: 120,
    joinedAt: '2024-10-01',
    familyId: 'family-1',
    isOnline: true,
  },
  {
    id: 'user-4',
    name: '妹妹',
    avatar: '👧',
    level: 8,
    experience: 900,
    experienceToNextLevel: 1500,
    starDust: 780,
    title: '新星探索者',
    streakDays: 5,
    totalHabitsCompleted: 80,
    joinedAt: '2024-10-15',
    familyId: 'family-1',
    isOnline: false,
  },
];

// 家庭信息
export const family: Family = {
  id: 'family-1',
  name: '星星之家 ⭐',
  createdAt: '2024-10-01',
  members: familyMembers,
};

// 习惯列表
export const habits: Habit[] = [
  {
    id: 'habit-1',
    name: '阅读30分钟',
    icon: '📚',
    description: '每天睡前阅读',
    frequency: 'daily',
    timeSlot: 'evening',
    reminderTime: '21:00',
    reminderEnabled: true,
    starDustReward: 50,
    createdAt: '2024-10-01',
    streak: 12,
    totalCompleted: 45,
  },
  {
    id: 'habit-2',
    name: '早晚刷牙',
    icon: '🦷',
    description: '保护牙齿健康',
    frequency: 'daily',
    timeSlot: 'morning',
    reminderTime: '07:30',
    reminderEnabled: true,
    starDustReward: 30,
    createdAt: '2024-10-01',
    streak: 12,
    totalCompleted: 56,
  },
  {
    id: 'habit-3',
    name: '运动20分钟',
    icon: '🏃',
    description: '跑步或跳绳',
    frequency: 'daily',
    timeSlot: 'afternoon',
    reminderTime: '17:00',
    reminderEnabled: true,
    starDustReward: 40,
    createdAt: '2024-10-05',
    streak: 8,
    totalCompleted: 32,
  },
  {
    id: 'habit-4',
    name: '喝8杯水',
    icon: '💧',
    description: '保持身体水分',
    frequency: 'daily',
    timeSlot: 'anytime',
    reminderEnabled: false,
    starDustReward: 25,
    createdAt: '2024-10-10',
    streak: 5,
    totalCompleted: 20,
  },
  {
    id: 'habit-5',
    name: '练习钢琴',
    icon: '🎹',
    description: '每天练习30分钟',
    frequency: 'daily',
    timeSlot: 'afternoon',
    reminderTime: '16:00',
    reminderEnabled: true,
    starDustReward: 60,
    createdAt: '2024-10-15',
    streak: 0,
    totalCompleted: 15,
  },
  {
    id: 'habit-6',
    name: '整理房间',
    icon: '🛏️',
    description: '保持整洁',
    frequency: 'daily',
    timeSlot: 'morning',
    reminderTime: '08:00',
    reminderEnabled: true,
    starDustReward: 35,
    createdAt: '2024-10-20',
    streak: 0,
    totalCompleted: 10,
  },
];

// 今日完成记录
export const todayCompletions: HabitCompletion[] = [
  { id: 'c-1', habitId: 'habit-1', userId: 'user-1', completedAt: '2024-11-26T08:30:00', starDustEarned: 50 },
  { id: 'c-2', habitId: 'habit-2', userId: 'user-1', completedAt: '2024-11-26T07:30:00', starDustEarned: 30 },
  { id: 'c-3', habitId: 'habit-3', userId: 'user-1', completedAt: '2024-11-26T17:00:00', starDustEarned: 40 },
  { id: 'c-4', habitId: 'habit-4', userId: 'user-1', completedAt: '2024-11-26T12:00:00', starDustEarned: 25 },
];

// 家庭任务
export const familyTasks: FamilyTask[] = [
  {
    id: 'task-1',
    familyId: 'family-1',
    name: '一起种一棵树',
    icon: '🌳',
    description: '累计完成100次习惯',
    targetCount: 100,
    currentCount: 78,
    participants: ['user-1', 'user-2', 'user-3', 'user-4'],
    reward: 500,
    isCompleted: false,
  },
  {
    id: 'task-2',
    familyId: 'family-1',
    name: '家庭阅读周',
    icon: '📖',
    description: '每人本周阅读5小时',
    targetCount: 20, // 4人 x 5小时
    currentCount: 9,
    participants: ['user-1', 'user-2'],
    deadline: '2024-11-29',
    reward: 300,
    isCompleted: false,
  },
];

// 家庭动态
export const familyActivities: FamilyActivity[] = [
  {
    id: 'act-1',
    userId: 'user-1',
    type: 'habit_complete',
    content: '完成了 阅读30分钟',
    timestamp: '2024-11-26T08:30:00',
    likes: 2,
    likedBy: ['user-2', 'user-3'],
  },
  {
    id: 'act-2',
    userId: 'user-2',
    type: 'medal_earned',
    content: '获得了 坚持之星 奖牌',
    timestamp: '2024-11-26T08:00:00',
    likes: 3,
    likedBy: ['user-1', 'user-3', 'user-4'],
  },
  {
    id: 'act-3',
    userId: 'user-3',
    type: 'like',
    content: '给 小星星 点了赞',
    timestamp: '2024-11-26T07:30:00',
    likes: 0,
    likedBy: [],
  },
  {
    id: 'act-4',
    userId: 'user-4',
    type: 'planet_unlocked',
    content: '解锁了 火星',
    timestamp: '2024-11-25T20:00:00',
    likes: 5,
    likedBy: ['user-1', 'user-2', 'user-3'],
  },
];

// 星球数据
export const planets: Planet[] = [
  {
    id: 'planet-1',
    name: '地球',
    icon: '🌍',
    color: '#4da8ff',
    description: '我们的起点，蓝色星球',
    unlockCost: 0,
    isUnlocked: true,
    level: 5,
    unlockedAt: '2024-10-01',
    decorations: [],
  },
  {
    id: 'planet-2',
    name: '火星',
    icon: '🔴',
    color: '#ff6b6b',
    description: '红色星球，勇气与探索的象征',
    unlockCost: 1000,
    isUnlocked: true,
    level: 3,
    unlockedAt: '2024-10-27',
    bonus: {
      type: 'courage',
      description: '完成运动类习惯获得 +20% 星尘',
      multiplier: 1.2,
    },
    decorations: [
      { id: 'd-1', name: '小火箭', icon: '🚀', cost: 0, isOwned: true, planetId: 'planet-2' },
      { id: 'd-2', name: '飞碟', icon: '🛸', cost: 0, isOwned: true, planetId: 'planet-2' },
      { id: 'd-3', name: '金星', icon: '🌟', cost: 0, isOwned: true, planetId: 'planet-2' },
      { id: 'd-4', name: '星星', icon: '⭐', cost: 0, isOwned: true, planetId: 'planet-2' },
      { id: 'd-5', name: '小土星', icon: '🪐', cost: 0, isOwned: true, planetId: 'planet-2' },
      { id: 'd-6', name: '月亮', icon: '🌙', cost: 200, isOwned: false, planetId: 'planet-2' },
      { id: 'd-7', name: '彗星', icon: '☄️', cost: 300, isOwned: false, planetId: 'planet-2' },
      { id: 'd-8', name: '星云', icon: '🌌', cost: 500, isOwned: false, planetId: 'planet-2' },
    ],
  },
  {
    id: 'planet-3',
    name: '木星',
    icon: '🟠',
    color: '#ffb74d',
    description: '巨大的气态行星，智慧的象征',
    unlockCost: 1500,
    isUnlocked: true,
    level: 2,
    unlockedAt: '2024-11-10',
    bonus: {
      type: 'wisdom',
      description: '完成学习类习惯获得 +15% 星尘',
      multiplier: 1.15,
    },
    decorations: [
      { id: 'd-9', name: '望远镜', icon: '🔭', cost: 0, isOwned: true, planetId: 'planet-3' },
      { id: 'd-10', name: '宇航员', icon: '🧑‍🚀', cost: 0, isOwned: true, planetId: 'planet-3' },
      { id: 'd-11', name: '卫星', icon: '🛰️', cost: 0, isOwned: true, planetId: 'planet-3' },
    ],
  },
  {
    id: 'planet-4',
    name: '土星',
    icon: '🪐',
    color: '#ffe082',
    description: '美丽的光环，坚持的象征',
    unlockCost: 3000,
    isUnlocked: false,
    level: 0,
    bonus: {
      type: 'persistence',
      description: '连续打卡奖励 +25%',
      multiplier: 1.25,
    },
    decorations: [],
  },
  {
    id: 'planet-5',
    name: '海王星',
    icon: '🔵',
    color: '#64b5f6',
    description: '深邃的蓝色，平静的象征',
    unlockCost: 5000,
    isUnlocked: false,
    level: 0,
    decorations: [],
  },
  {
    id: 'planet-6',
    name: '神秘星球',
    icon: '🟣',
    color: '#9c27b0',
    description: '未知的领域，等待探索',
    unlockCost: 10000,
    isUnlocked: false,
    level: 0,
    decorations: [],
  },
];

// 奖牌数据
export const medals: Medal[] = [
  // 连续打卡成就
  {
    id: 'medal-1',
    name: '坚持之星',
    icon: '🔥',
    description: '连续打卡7天',
    category: 'streak',
    tier: 'bronze',
    requirement: 7,
    progress: 12,
    isEarned: true,
    earnedAt: '2024-11-20',
    isNew: true,
  },
  {
    id: 'medal-2',
    name: '习惯达人',
    icon: '⚡',
    description: '连续打卡14天',
    category: 'streak',
    tier: 'silver',
    requirement: 14,
    progress: 12,
    isEarned: false,
  },
  {
    id: 'medal-3',
    name: '月度冠军',
    icon: '🌟',
    description: '连续打卡30天',
    category: 'streak',
    tier: 'gold',
    requirement: 30,
    progress: 12,
    isEarned: false,
  },
  {
    id: 'medal-4',
    name: '习惯大师',
    icon: '👑',
    description: '连续打卡100天',
    category: 'streak',
    tier: 'gold',
    requirement: 100,
    progress: 12,
    isEarned: false,
  },
  // 里程碑成就
  {
    id: 'medal-5',
    name: '启航者',
    icon: '🚀',
    description: '完成第一个习惯',
    category: 'milestone',
    tier: 'bronze',
    requirement: 1,
    progress: 156,
    isEarned: true,
    earnedAt: '2024-10-01',
  },
  {
    id: 'medal-6',
    name: '小书虫',
    icon: '📚',
    description: '阅读累计50小时',
    category: 'milestone',
    tier: 'silver',
    requirement: 50,
    progress: 38,
    isEarned: false,
  },
  {
    id: 'medal-7',
    name: '运动健将',
    icon: '💪',
    description: '运动累计100次',
    category: 'milestone',
    tier: 'gold',
    requirement: 100,
    progress: 100,
    isEarned: true,
    earnedAt: '2024-11-15',
  },
  {
    id: 'medal-8',
    name: '星际探险家',
    icon: '🌍',
    description: '解锁5个星球',
    category: 'milestone',
    tier: 'gold',
    requirement: 5,
    progress: 3,
    isEarned: false,
  },
  // 特殊成就
  {
    id: 'medal-9',
    name: '全家总动员',
    icon: '👨‍👩‍👧‍👦',
    description: '全家同时完成任务',
    category: 'special',
    tier: 'gold',
    requirement: 1,
    progress: 1,
    isEarned: true,
    earnedAt: '2024-11-10',
  },
  {
    id: 'medal-10',
    name: '完美主义者',
    icon: '🎯',
    description: '单日100%完成率',
    category: 'special',
    tier: 'silver',
    requirement: 1,
    progress: 1,
    isEarned: true,
    earnedAt: '2024-11-05',
  },
  {
    id: 'medal-11',
    name: '彩虹收集者',
    icon: '🌈',
    description: '收集所有星球装饰',
    category: 'special',
    tier: 'gold',
    requirement: 100,
    progress: 28,
    isEarned: false,
  },
  {
    id: 'medal-12',
    name: '传奇',
    icon: '🏆',
    description: '获得所有其他奖牌',
    category: 'special',
    tier: 'gold',
    requirement: 50,
    progress: 18,
    isEarned: false,
  },
];

// 生成日历数据
export const generateCalendarData = (year: number, month: number): CalendarDay[] => {
  const days: CalendarDay[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const today = new Date();
    const currentDate = new Date(year, month, day);
    
    // 模拟完成数据
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (currentDate <= today) {
      // 为过去的日期生成随机完成级别
      const random = Math.random();
      if (day >= 15) {
        level = random > 0.1 ? 4 : random > 0.05 ? 3 : 2;
      } else if (day >= 10) {
        level = random > 0.3 ? 4 : random > 0.2 ? 3 : random > 0.1 ? 2 : 1;
      } else {
        level = random > 0.4 ? 3 : random > 0.2 ? 2 : random > 0.1 ? 1 : 0;
      }
    }
    
    days.push({
      date,
      completionLevel: level,
      habitsCompleted: level * 2,
      totalHabits: 6,
    });
  }
  
  return days;
};

// 习惯图标选项
export const habitIcons = [
  '📚', '🏃', '💧', '✍️', '🎹', '🧘',
  '🦷', '😴', '🍎', '🎨', '🌱', '⭐',
  '🎯', '💪', '🧠', '🎵', '📝', '🏊',
  '🚴', '⚽', '🏀', '🎾', '🧹', '🍳',
];

// 时间段选项
export const timeSlotOptions = [
  { id: 'morning', label: '早晨', icon: '🌅' },
  { id: 'afternoon', label: '上午', icon: '☀️' },
  { id: 'evening', label: '下午', icon: '🌤️' },
  { id: 'night', label: '晚上', icon: '🌙' },
  { id: 'anytime', label: '随时', icon: '⭐' },
];

// 频率选项
export const frequencyOptions = [
  { id: 'daily', label: '每天' },
  { id: 'weekdays', label: '工作日' },
  { id: 'custom', label: '自定义' },
];

// 周几选项
export const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

