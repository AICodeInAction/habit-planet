// 习惯类型定义
export interface Habit {
  id: string;
  name: string;
  icon: string;
  description: string;
  frequency: 'daily' | 'weekdays' | 'custom';
  customDays?: number[]; // 0-6, 0 = 周一
  timeSlot: 'morning' | 'afternoon' | 'evening' | 'anytime';
  reminderTime?: string; // HH:mm 格式
  reminderEnabled: boolean;
  starDustReward: number;
  createdAt: string;
  familyMembers?: string[]; // 关联的家庭成员ID
  streak: number; // 连续打卡天数
  totalCompleted: number; // 总完成次数
}

// 习惯完成记录
export interface HabitCompletion {
  id: string;
  habitId: string;
  userId: string;
  completedAt: string;
  starDustEarned: number;
}

// 用户类型定义
export interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  starDust: number;
  title: string;
  streakDays: number;
  totalHabitsCompleted: number;
  joinedAt: string;
  familyId?: string;
  isOnline?: boolean;
}

// 家庭类型定义
export interface Family {
  id: string;
  name: string;
  createdAt: string;
  members: User[];
}

// 家庭任务
export interface FamilyTask {
  id: string;
  familyId: string;
  name: string;
  icon: string;
  description: string;
  targetCount: number;
  currentCount: number;
  participants: string[]; // 用户ID
  deadline?: string;
  reward: number;
  isCompleted: boolean;
}

// 家庭动态
export interface FamilyActivity {
  id: string;
  userId: string;
  type: 'habit_complete' | 'medal_earned' | 'planet_unlocked' | 'like';
  content: string;
  timestamp: string;
  likes: number;
  likedBy: string[];
}

// 星球类型定义
export interface Planet {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  unlockCost: number;
  isUnlocked: boolean;
  level: number;
  unlockedAt?: string;
  bonus?: {
    type: string;
    description: string;
    multiplier: number;
  };
  decorations: Decoration[];
}

// 装饰物
export interface Decoration {
  id: string;
  name: string;
  icon: string;
  cost: number;
  isOwned: boolean;
  planetId: string;
}

// 奖牌类型定义
export interface Medal {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'streak' | 'milestone' | 'special';
  tier: 'gold' | 'silver' | 'bronze';
  requirement: number;
  progress: number;
  isEarned: boolean;
  earnedAt?: string;
  isNew?: boolean;
}

// 打卡日历数据
export interface CalendarDay {
  date: string;
  completionLevel: 0 | 1 | 2 | 3 | 4; // 0=未完成, 4=全部完成
  habitsCompleted: number;
  totalHabits: number;
}

// 导航类型
export type RootStackParamList = {
  MainTabs: undefined;
  PlanetDetail: { planetId: string };
  CreateHabit: { habitId?: string };
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Galaxy: undefined;
  Medals: undefined;
  Family: undefined;
  Profile: undefined;
};

