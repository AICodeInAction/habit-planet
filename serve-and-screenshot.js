const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const serveStatic = require('serve-static');

// 可用端口
const PORT = 3000;

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

  // 启动一个简单的HTTP服务器用于提供静态文件
  const app = express();
  // 将项目根目录设置为静态文件目录
  app.use(serveStatic(__dirname));
  
  // 启动服务器
  const server = http.createServer(app);
  await new Promise(resolve => {
    server.listen(PORT, () => {
      console.log(`HTTP服务器已启动: http://localhost:${PORT}`);
      resolve();
    });
  });

  try {
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
        
        // 使用本地HTTP服务器URL访问文件，而不是file://协议
        const fileUrl = `http://localhost:${PORT}/${folder}/index.html`;
        console.log(`正在访问: ${fileUrl}`);
        
        // 启用网络请求记录以便调试
        page.on('console', msg => console.log(`页面日志: ${msg.text()}`));
        
        // 设置长超时并确保资源加载完成
        await page.goto(fileUrl, { 
          waitUntil: 'networkidle0', 
          timeout: 120000 
        });
        
        // 等待内容加载
        console.log(`等待页面内容和iframe完全加载...`);
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        // 处理iframe和页面交互
        console.log(`处理页面内交互...`);
        await page.evaluate(() => {
          // 模拟用户交互：滚动页面
          const scrollStep = () => {
            let scrollPosition = 0;
            const totalHeight = document.body.scrollHeight;
            const scrollInterval = setInterval(() => {
              window.scrollTo(0, scrollPosition);
              scrollPosition += 100;
              if (scrollPosition >= totalHeight) {
                clearInterval(scrollInterval);
                window.scrollTo(0, 0);
              }
            }, 100);
          };
          scrollStep();
          
          // 点击页面上的任何tab或按钮来触发内容加载
          const clickableElements = document.querySelectorAll('button, .tab, [role="tab"], a');
          clickableElements.forEach(el => {
            try {
              el.click();
            } catch (e) {}
          });
          
          // 强制所有iframe加载内容
          const iframes = document.querySelectorAll('iframe');
          console.log(`找到 ${iframes.length} 个iframe`);
          
          iframes.forEach((iframe, index) => {
            try {
              // 尝试强制iframe加载
              if(iframe.src && iframe.src !== 'about:blank') {
                console.log(`处理iframe ${index}: ${iframe.src}`);
              } else {
                console.log(`尝试设置iframe ${index} 的内容`);
                // 如果iframe没有src，尝试直接设置内容
                try {
                  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                  iframeDoc.body.innerHTML = '<div style="text-align:center;padding:20px;background:#f0f0f0;color:#555;border-radius:5px;"><h3>Iframe Content Placeholder</h3><p>This content would normally be loaded dynamically</p></div>';
                } catch(e) { 
                  console.error('无法设置iframe内容:', e);
                }
              }
            } catch(e) {
              console.error(`处理iframe ${index} 时出错:`, e);
            }
          });
        });
        
        // 再次等待确保交互后内容加载
        await new Promise(resolve => setTimeout(resolve, 5000));
        
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
  } finally {
    // 关闭HTTP服务器
    console.log('关闭HTTP服务器...');
    server.close();
  }
  
  console.log('所有截图已完成！保存在 screenshots 文件夹中。');
}

// 执行截图脚本
takeScreenshots().catch(error => {
  console.error('截图过程出错:', error);
  process.exit(1);
}); 