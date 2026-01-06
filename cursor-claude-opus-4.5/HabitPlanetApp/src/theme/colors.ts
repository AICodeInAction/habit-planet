// 习惯星球主题色彩系统
export const colors = {
  // 主色调
  primary: {
    blue: '#4da8ff',
    purple: '#c44dff',
    pink: '#ff6b9d',
  },
  
  // 背景色
  background: {
    dark: '#0a0e27',
    medium: '#1a1a3e',
    light: '#0f1629',
  },
  
  // 星尘金色
  starDust: {
    primary: '#ffd700',
    secondary: '#ff8c00',
    light: 'rgba(255, 215, 0, 0.2)',
  },
  
  // 成功/完成状态
  success: {
    primary: '#4cd964',
    secondary: '#34c759',
    light: 'rgba(76, 217, 100, 0.2)',
  },
  
  // 警告/提示
  warning: {
    primary: '#ffcc00',
    secondary: '#ff9500',
  },
  
  // 错误/危险
  danger: {
    primary: '#ff3b30',
    secondary: '#ff453a',
    light: 'rgba(255, 59, 48, 0.1)',
  },
  
  // 文字颜色
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    tertiary: 'rgba(255, 255, 255, 0.5)',
    disabled: 'rgba(255, 255, 255, 0.3)',
  },
  
  // 边框和分隔线
  border: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
  },
  
  // 卡片背景
  card: {
    background: 'rgba(255, 255, 255, 0.08)',
    backgroundLight: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
  },
  
  // 星球颜色
  planets: {
    earth: ['#4da8ff', '#2e7d32', '#1565c0'],
    mars: ['#ff6b6b', '#c62828', '#bf360c'],
    jupiter: ['#ffb74d', '#ff8f00', '#e65100'],
    saturn: ['#ffe082', '#ffc107', '#ff8f00'],
    neptune: ['#64b5f6', '#1976d2', '#0d47a1'],
    mystery: ['#9c27b0', '#6a1b9a', '#4a148c'],
  },
  
  // 奖牌颜色
  medals: {
    gold: ['#ffd700', '#ff8c00'],
    silver: ['#c0c0c0', '#808080'],
    bronze: ['#cd7f32', '#8b4513'],
    special: ['#9c27b0', '#e91e63'],
  },
  
  // Tab Bar
  tabBar: {
    background: 'rgba(10, 14, 39, 0.95)',
    active: '#4da8ff',
    inactive: 'rgba(255, 255, 255, 0.5)',
  },
};

// 渐变色预设
export const gradients = {
  primary: ['#4da8ff', '#c44dff'],
  starDust: ['#ffd700', '#ff8c00'],
  success: ['#4cd964', '#34c759'],
  danger: ['#ff6b6b', '#ff8e53'],
  purple: ['#9c27b0', '#e91e63'],
  card: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'],
  background: ['#0a0e27', '#1a1a3e', '#0f1629'],
};

export default colors;

