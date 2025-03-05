const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const http = require('http');
const handler = require('serve-handler');

// 定义要截图的目录
const directories = [
  'cursor-gpt4',
  'trae-claude3',
  'trae-deepseek-v3'  // 新增的目录
];

async function captureScreenshots() {
  // 创建一个简单的HTTP服务器来提供文件
  const server = http.createServer((request, response) => {
    return handler(request, response);
  });
  
  // 启动服务器在随机端口
  const port = 3000;
  await new Promise((resolve) => server.listen(port, resolve));
  console.log(`Server running at http://localhost:${port}`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,1600']
  });

  try {
    for (const dir of directories) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 1600, deviceScaleFactor: 2 });
      
      // 导航到HTTP服务器上的页面
      const url = `http://localhost:${port}/${dir}/index.html`;
      console.log(`Navigating to ${url}`);
      
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
      
      // 等待内容完全加载，包括所有iframe
      await page.waitForTimeout(5000);
      
      // 对于有iframe的页面，确保iframe内容也已加载
      const iframes = await page.$$('iframe');
      if (iframes.length > 0) {
        for (const iframe of iframes) {
          try {
            const frame = await iframe.contentFrame();
            if (frame) {
              // 等待iframe的主要内容加载
              await frame.waitForSelector('body', { timeout: 5000 });
            }
          } catch (error) {
            console.warn(`Warning: Could not wait for iframe content in ${dir}: ${error.message}`);
          }
        }
      }
      
      // 创建screenshots目录（如果不存在）
      const screenshotsDir = path.join(process.cwd(), 'screenshots');
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir);
      }

      // 保存截图
      const screenshotPath = path.join(screenshotsDir, `${dir}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Captured screenshot: ${screenshotPath}`);
      
      await page.close();
    }
  } catch (error) {
    console.error('Error during screenshots:', error);
  } finally {
    await browser.close();
    server.close();
    console.log('Server stopped');
  }
}

captureScreenshots().catch(console.error); 