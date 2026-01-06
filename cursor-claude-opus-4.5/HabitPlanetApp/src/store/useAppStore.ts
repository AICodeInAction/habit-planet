import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  User, 
  Habit, 
  HabitCompletion, 
  Family, 
  FamilyTask,
  FamilyActivity,
  Planet, 
  Medal,
  CalendarDay 
} from '../types';
import {
  currentUser as mockUser,
  habits as mockHabits,
  todayCompletions as mockCompletions,
  family as mockFamily,
  familyTasks as mockFamilyTasks,
  familyActivities as mockActivities,
  planets as mockPlanets,
  medals as mockMedals,
  generateCalendarData,
} from '../services/mockData';

interface AppState {
  // 用户状态
  user: User;
  isLoading: boolean;
  
  // 习惯相关
  habits: Habit[];
  todayCompletions: HabitCompletion[];
  
  // 家庭相关
  family: Family | null;
  familyTasks: FamilyTask[];
  familyActivities: FamilyActivity[];
  
  // 星球相关
  planets: Planet[];
  
  // 奖牌相关
  medals: Medal[];
  
  // 日历数据
  calendarData: CalendarDay[];
  
  // Actions
  initializeApp: () => Promise<void>;
  
  // 习惯操作
  completeHabit: (habitId: string) => void;
  uncompleteHabit: (habitId: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'totalCompleted'>) => void;
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  deleteHabit: (habitId: string) => void;
  
  // 星球操作
  unlockPlanet: (planetId: string) => boolean;
  purchaseDecoration: (planetId: string, decorationId: string) => boolean;
  
  // 家庭操作
  likeActivity: (activityId: string) => void;
  updateFamilyTaskProgress: (taskId: string, increment: number) => void;
  
  // 用户操作
  updateStarDust: (amount: number) => void;
  addExperience: (amount: number) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // 初始状态
  user: mockUser,
  isLoading: true,
  habits: mockHabits,
  todayCompletions: mockCompletions,
  family: mockFamily,
  familyTasks: mockFamilyTasks,
  familyActivities: mockActivities,
  planets: mockPlanets,
  medals: mockMedals,
  calendarData: generateCalendarData(2024, 10), // 11月数据
  
  // 初始化应用
  initializeApp: async () => {
    try {
      // 模拟加载延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 这里可以从 AsyncStorage 加载持久化数据
      // const savedData = await AsyncStorage.getItem('appData');
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to initialize app:', error);
      set({ isLoading: false });
    }
  },
  
  // 完成习惯
  completeHabit: (habitId: string) => {
    const { habits, todayCompletions, user } = get();
    const habit = habits.find(h => h.id === habitId);
    
    if (!habit) return;
    
    // 检查今天是否已完成
    const alreadyCompleted = todayCompletions.some(c => c.habitId === habitId);
    if (alreadyCompleted) return;
    
    const completion: HabitCompletion = {
      id: `c-${Date.now()}`,
      habitId,
      userId: user.id,
      completedAt: new Date().toISOString(),
      starDustEarned: habit.starDustReward,
    };
    
    set(state => ({
      todayCompletions: [...state.todayCompletions, completion],
      habits: state.habits.map(h => 
        h.id === habitId 
          ? { ...h, streak: h.streak + 1, totalCompleted: h.totalCompleted + 1 }
          : h
      ),
      user: {
        ...state.user,
        starDust: state.user.starDust + habit.starDustReward,
        totalHabitsCompleted: state.user.totalHabitsCompleted + 1,
      },
    }));
    
    // 更新连续打卡天数
    get().addExperience(habit.starDustReward);
  },
  
  // 取消完成习惯
  uncompleteHabit: (habitId: string) => {
    const { todayCompletions, habits } = get();
    const completion = todayCompletions.find(c => c.habitId === habitId);
    
    if (!completion) return;
    
    set(state => ({
      todayCompletions: state.todayCompletions.filter(c => c.habitId !== habitId),
      habits: state.habits.map(h =>
        h.id === habitId
          ? { ...h, streak: Math.max(0, h.streak - 1), totalCompleted: Math.max(0, h.totalCompleted - 1) }
          : h
      ),
      user: {
        ...state.user,
        starDust: Math.max(0, state.user.starDust - completion.starDustEarned),
        totalHabitsCompleted: Math.max(0, state.user.totalHabitsCompleted - 1),
      },
    }));
  },
  
  // 添加新习惯
  addHabit: (habitData) => {
    const newHabit: Habit = {
      ...habitData,
      id: `habit-${Date.now()}`,
      createdAt: new Date().toISOString(),
      streak: 0,
      totalCompleted: 0,
    };
    
    set(state => ({
      habits: [...state.habits, newHabit],
    }));
  },
  
  // 更新习惯
  updateHabit: (habitId, updates) => {
    set(state => ({
      habits: state.habits.map(h =>
        h.id === habitId ? { ...h, ...updates } : h
      ),
    }));
  },
  
  // 删除习惯
  deleteHabit: (habitId) => {
    set(state => ({
      habits: state.habits.filter(h => h.id !== habitId),
      todayCompletions: state.todayCompletions.filter(c => c.habitId !== habitId),
    }));
  },
  
  // 解锁星球
  unlockPlanet: (planetId: string) => {
    const { planets, user } = get();
    const planet = planets.find(p => p.id === planetId);
    
    if (!planet || planet.isUnlocked || user.starDust < planet.unlockCost) {
      return false;
    }
    
    set(state => ({
      planets: state.planets.map(p =>
        p.id === planetId
          ? { ...p, isUnlocked: true, unlockedAt: new Date().toISOString(), level: 1 }
          : p
      ),
      user: {
        ...state.user,
        starDust: state.user.starDust - planet.unlockCost,
      },
    }));
    
    return true;
  },
  
  // 购买装饰
  purchaseDecoration: (planetId: string, decorationId: string) => {
    const { planets, user } = get();
    const planet = planets.find(p => p.id === planetId);
    const decoration = planet?.decorations.find(d => d.id === decorationId);
    
    if (!decoration || decoration.isOwned || user.starDust < decoration.cost) {
      return false;
    }
    
    set(state => ({
      planets: state.planets.map(p =>
        p.id === planetId
          ? {
              ...p,
              decorations: p.decorations.map(d =>
                d.id === decorationId ? { ...d, isOwned: true } : d
              ),
            }
          : p
      ),
      user: {
        ...state.user,
        starDust: state.user.starDust - decoration.cost,
      },
    }));
    
    return true;
  },
  
  // 点赞动态
  likeActivity: (activityId: string) => {
    const { user } = get();
    
    set(state => ({
      familyActivities: state.familyActivities.map(a =>
        a.id === activityId
          ? {
              ...a,
              likes: a.likedBy.includes(user.id) ? a.likes - 1 : a.likes + 1,
              likedBy: a.likedBy.includes(user.id)
                ? a.likedBy.filter(id => id !== user.id)
                : [...a.likedBy, user.id],
            }
          : a
      ),
    }));
  },
  
  // 更新家庭任务进度
  updateFamilyTaskProgress: (taskId: string, increment: number) => {
    set(state => ({
      familyTasks: state.familyTasks.map(t =>
        t.id === taskId
          ? {
              ...t,
              currentCount: Math.min(t.targetCount, t.currentCount + increment),
              isCompleted: t.currentCount + increment >= t.targetCount,
            }
          : t
      ),
    }));
  },
  
  // 更新星尘
  updateStarDust: (amount: number) => {
    set(state => ({
      user: {
        ...state.user,
        starDust: Math.max(0, state.user.starDust + amount),
      },
    }));
  },
  
  // 添加经验值
  addExperience: (amount: number) => {
    set(state => {
      let newExp = state.user.experience + amount;
      let newLevel = state.user.level;
      let expToNext = state.user.experienceToNextLevel;
      
      // 检查是否升级
      while (newExp >= expToNext) {
        newExp -= expToNext;
        newLevel += 1;
        expToNext = Math.floor(expToNext * 1.2); // 每级需要更多经验
      }
      
      return {
        user: {
          ...state.user,
          experience: newExp,
          level: newLevel,
          experienceToNextLevel: expToNext,
        },
      };
    });
  },
}));

export default useAppStore;

