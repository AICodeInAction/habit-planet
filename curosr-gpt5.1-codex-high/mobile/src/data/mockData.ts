export type FamilyMember = {
  id: string;
  name: string;
  avatar: string;
  streak: number;
  points: number;
};

export type HabitTask = {
  id: string;
  title: string;
  category: string;
  cover: string;
  status: "pending" | "in-progress" | "done";
  points: number;
  members: string[];
};

export type Planet = {
  id: string;
  name: string;
  status: "unlocked" | "building" | "locked";
  description: string;
  cover: string;
  progress: number;
  requiredPoints: number;
  perks: string[];
};

export type FamilyMessage = {
  id: string;
  sender: string;
  avatar: string;
  body: string;
  timestamp: string;
  likes: number;
};

export type Medal = {
  id: string;
  name: string;
  rarity: "SSR" | "SR" | "R";
  requirement: string;
  reward: string;
  progress: number;
};

export type Routine = {
  id: string;
  slot: string;
  title: string;
  completion: number;
};

export const familyMembers: FamilyMember[] = [
  {
    id: "m1",
    name: "Yoyo",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
    streak: 18,
    points: 38
  },
  {
    id: "m2",
    name: "Mom",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    streak: 12,
    points: 31
  },
  {
    id: "m3",
    name: "Dad",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
    streak: 10,
    points: 24
  }
];

export const habitTasks: HabitTask[] = [
  {
    id: "h1",
    title: "晨读 15 分钟",
    category: "家庭晨间",
    cover: "https://images.unsplash.com/photo-1468717755208-4adaa8843cff?auto=format&fit=crop&w=300&q=80",
    status: "pending",
    points: 16,
    members: ["m1", "m2"]
  },
  {
    id: "h2",
    title: "户外骑行",
    category: "运动升空",
    cover: "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=700&q=80",
    status: "in-progress",
    points: 12,
    members: ["m1"]
  },
  {
    id: "h3",
    title: "厨房记忆相簿",
    category: "亲子共创",
    cover: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=80",
    status: "done",
    points: 20,
    members: ["m1", "m2", "m3"]
  }
];

export const planets: Planet[] = [
  {
    id: "p1",
    name: "晨读星",
    status: "unlocked",
    description: "点亮 8 件星球装饰，解锁故事动画",
    cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
    progress: 0.74,
    requiredPoints: 320,
    perks: ["光尘 +18", "灵感祝福"]
  },
  {
    id: "p2",
    name: "活力星",
    status: "building",
    description: "运动 + 家务加成星球，建造完成可得皮肤",
    cover: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80",
    progress: 0.52,
    requiredPoints: 400,
    perks: ["家庭体力额外奖励"]
  },
  {
    id: "p3",
    name: "勇气星",
    status: "locked",
    description: "完成 3 次家庭演讲即可解锁",
    cover: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&w=1200&q=80",
    progress: 0.18,
    requiredPoints: 500,
    perks: ["剧情盲盒"]
  }
];

export const familyMessages: FamilyMessage[] = [
  {
    id: "fm1",
    sender: "Dad",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
    body: "如果把今天最想感谢的人写下来，今晚我们就把他写进勇气星的石碑上。",
    timestamp: "35 秒前",
    likes: 3
  },
  {
    id: "fm2",
    sender: "Mom",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    body: "厨房日记第二天已经上传，你们的笑声是最棒的配料！",
    timestamp: "3 分钟前",
    likes: 7
  }
];

export const medals: Medal[] = [
  {
    id: "md1",
    name: "勇气星勋章",
    rarity: "SSR",
    requirement: "晨读连续 10 天",
    reward: "+120 光尘",
    progress: 1
  },
  {
    id: "md2",
    name: "星际工程师",
    rarity: "SR",
    requirement: "装饰晨曦星 8/8",
    reward: "家庭剧情动画",
    progress: 0.68
  },
  {
    id: "md3",
    name: "亲子共创盲盒",
    rarity: "R",
    requirement: "累计 3 次亲子共创",
    reward: "随机星球皮肤",
    progress: 0.4
  }
];

export const routines: Routine[] = [
  { id: "r1", slot: "早晨 06:40", title: "晨光拉伸 + 喝水", completion: 0.9 },
  { id: "r2", slot: "晚餐 19:30", title: "数学 + 星球日记", completion: 0.76 },
  { id: "r3", slot: "睡前 21:10", title: "感恩卡片 + 共读", completion: 0.88 }
];

