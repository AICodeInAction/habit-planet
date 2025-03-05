const fs = require('fs');
const path = require('path');

function updateReadme() {
  // 要添加截图的文件夹列表
  const folders = [
    'cursor-sonnet-3.5',
    'cursor-sonnet-3.7-cn',
    'cursor-sonnet-3.7-en',
    'cusor-sonnet-3.7-thinking',
    'cusor-openai-o4',
    'trae-sonnet-3.7',
    'trae-deepseek-r1',
    'trae-deepseek-v3'
  ];

  // 读取当前的README内容
  const readmePath = path.join(__dirname, 'README.md');
  let readmeContent = fs.readFileSync(readmePath, 'utf8');

  // 检查是否已经有截图部分
  if (readmeContent.includes('## 界面截图')) {
    console.log('README已包含截图部分，将更新内容...');
    // 移除旧的截图部分（从'## 界面截图'开始到'---'结束）
    const startIndex = readmeContent.indexOf('## 界面截图');
    const endIndex = readmeContent.indexOf('---', startIndex);
    if (endIndex !== -1) {
      readmeContent = readmeContent.substring(0, startIndex) + readmeContent.substring(endIndex);
    } else {
      readmeContent = readmeContent.substring(0, startIndex);
    }
  }

  // 创建新的截图部分
  let screenshotsSection = '## 界面截图\n\n';
  screenshotsSection += '以下是各个AI模型生成的界面截图比较：\n\n';

  // 为每个文件夹添加截图
  folders.forEach(folder => {
    const screenshotPath = `screenshots/${folder}.png`;
    const modelName = {
      'cursor-sonnet-3.5': 'Cursor + Claude 3.5 Sonnet (英文)',
      'cursor-sonnet-3.7-cn': 'Cursor + Claude 3.7 Sonnet (中文)',
      'cursor-sonnet-3.7-en': 'Cursor + Claude 3.7 Sonnet (英文)',
      'cusor-sonnet-3.7-thinking': 'Cursor + Claude 3.7 Sonnet (思考过程)',
      'cusor-openai-o4': 'Cursor + OpenAI GPT-4o',
      'trae-sonnet-3.7': 'Trae + Claude 3.7 Sonnet',
      'trae-deepseek-r1': 'Trae + DeepSeek R1',
      'trae-deepseek-v3': 'Trae + DeepSeek V3'
    }[folder];

    screenshotsSection += `### ${modelName}\n\n`;
    screenshotsSection += `![${folder}](${screenshotPath})\n\n`;
  });

  // 在README末尾的"---"前添加截图部分
  const finalNotePart = '---\n\n*注：此项目仅作为演示和研究用途，所有代码均由 AI 生成。*';
  readmeContent = readmeContent.replace(finalNotePart, screenshotsSection + finalNotePart);

  // 写入更新后的README
  fs.writeFileSync(readmePath, readmeContent);
  console.log('README.md 已更新，添加了截图部分');
}

updateReadme(); 