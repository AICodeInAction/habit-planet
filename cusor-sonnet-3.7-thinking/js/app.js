// 习惯星球App - 基础交互脚本

// 设置当前时间
function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const timeElements = document.querySelectorAll('.status-bar-time');
  
  timeElements.forEach(element => {
    element.textContent = `${hours}:${minutes}`;
  });
}

// 习惯打卡功能
function initHabitCheckboxes() {
  const checkboxes = document.querySelectorAll('.habit-checkbox');
  
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', function() {
      this.classList.toggle('checked');
      
      // 切换图标
      const icon = this.querySelector('i');
      if (icon) {
        if (this.classList.contains('checked')) {
          icon.className = 'fas fa-check';
        } else {
          icon.className = '';
        }
      }
      
      // 如果有连续天数元素，更新连续天数
      const habitItem = this.closest('.habit-item');
      const streakElement = habitItem ? habitItem.querySelector('.habit-streak') : null;
      
      if (streakElement && this.classList.contains('checked')) {
        const currentStreak = parseInt(streakElement.getAttribute('data-streak') || '0');
        const newStreak = currentStreak + 1;
        streakElement.setAttribute('data-streak', newStreak.toString());
        streakElement.textContent = `已连续完成 ${newStreak} 天`;
      }
    });
  });
}

// 星球旋转效果
function initPlanetAnimation() {
  const planets = document.querySelectorAll('.planet');
  
  planets.forEach((planet, index) => {
    // 添加一个微小的动画延迟，使每个星球的动画开始时间不同
    const delay = index * 0.5;
    planet.style.animation = `rotate 20s linear ${delay}s infinite`;
  });
}

// 初始化徽章展示
function initBadges() {
  const badges = document.querySelectorAll('.badge');
  
  badges.forEach(badge => {
    badge.addEventListener('click', function() {
      // 显示徽章详情（在真实应用中会打开一个模态框）
      const badgeName = this.querySelector('.badge-name').textContent;
      alert(`徽章详情: ${badgeName}`);
    });
  });
}

// 家庭成员互动
function initFamilyInteraction() {
  const familyMembers = document.querySelectorAll('.family-member');
  
  familyMembers.forEach(member => {
    member.addEventListener('click', function() {
      const name = this.querySelector('.family-name').textContent;
      alert(`查看 ${name} 的习惯完成情况`);
    });
  });
}

// 表单提交处理
function initForms() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('表单已提交!');
      // 在真实应用中这里会处理表单数据
    });
  });
}

// 添加星球装饰
function initDecorations() {
  const decorations = document.querySelectorAll('.decoration-item');
  
  decorations.forEach(decoration => {
    decoration.addEventListener('click', function() {
      const decorationName = this.querySelector('.decoration-name').textContent;
      alert(`已添加装饰: ${decorationName}`);
    });
  });
}

// 页面加载时初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
  updateTime();
  setInterval(updateTime, 60000); // 每分钟更新一次时间
  
  // 检查是否存在相关元素，然后初始化功能
  if (document.querySelector('.habit-checkbox')) {
    initHabitCheckboxes();
  }
  
  if (document.querySelector('.planet')) {
    initPlanetAnimation();
  }
  
  if (document.querySelector('.badge')) {
    initBadges();
  }
  
  if (document.querySelector('.family-member')) {
    initFamilyInteraction();
  }
  
  if (document.querySelector('form')) {
    initForms();
  }
  
  if (document.querySelector('.decoration-item')) {
    initDecorations();
  }
}); 