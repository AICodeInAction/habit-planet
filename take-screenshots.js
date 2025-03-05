const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function takeScreenshots() {
  // 列出所有需要截图的文件夹
  const folders = [
    'cursor-sonnet-3.5',
    'cursor-sonnet-3.7-cn',
    'cursor-sonnet-3.7-en',
    'cusor-sonnet-3.7-thinking',
    'cusor-openai-o4',
    'trae-sonnet-3.7',
    'trae-deepseek-r1'
  ];

  // 创建截图文件夹（如果不存在）
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  // 启动浏览器
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: {
      width: 1920,
      height: 1080
    }
  });

  console.log('开始生成截图...');

  // 为每个文件夹截图
  for (const folder of folders) {
    try {
      const htmlFilePath = path.join(__dirname, folder, 'index.html');
      
      // 检查文件是否存在
      if (!fs.existsSync(htmlFilePath)) {
        console.error(`❌ ${folder}/index.html 文件不存在，跳过此文件夹`);
        continue;
      }
      
      const page = await browser.newPage();
      
      // 使用文件协议访问本地HTML文件
      const fileUrl = `file://${htmlFilePath}`;
      console.log(`正在访问: ${fileUrl}`);
      
      // 设置更长的导航超时
      await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 90000 });
      
      // 等待更长的时间确保所有内容都加载
      console.log(`等待页面内容和iframe完全加载...`);
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      // 处理iframe加载
      const frames = page.frames();
      console.log(`页面中发现 ${frames.length} 个框架`);
      
      // 尝试与页面交互，确保内容渲染
      await page.evaluate(() => {
        // 滚动到页面底部然后回到顶部，触发懒加载内容
        window.scrollTo(0, document.body.scrollHeight);
        setTimeout(() => window.scrollTo(0, 0), 1000);
        
        // 尝试加载所有iframe
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
          // 尝试访问iframe内容触发加载
          try {
            if(iframe.contentWindow) {
              iframe.contentWindow.document;
            }
          } catch(e) {
            console.error('无法访问iframe内容:', e);
          }
        });
      });
      
      // 再等待一段时间确保交互后的内容加载
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 捕获整个页面的截图
      const screenshotPath = path.join(screenshotsDir, `${folder}.png`);
      console.log(`正在截图 ${folder}...`);
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: true 
      });
      
      console.log(`✅ 已保存截图: ${screenshotPath}`);
      await page.close();
    } catch (error) {
      console.error(`❌ 处理 ${folder} 时出错:`, error.message);
    }
  }

  await browser.close();
  console.log('所有截图已完成！保存在 screenshots 文件夹中。');
}

takeScreenshots().catch(console.error); 