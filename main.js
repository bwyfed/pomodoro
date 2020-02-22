const { app, BrowserWindow, Notification, ipcMain } = require('electron');

// 窗口需要全局变量，避免垃圾回收
let win;
app.on('ready', () => {
  win = new BrowserWindow({
    width: 300,
    height: 300,
    webPreferences: {
      nodeIntegration: true // 设置开启node
    }
  });
  win.loadFile('./index.html');
  handleIPC(); // 处理IPC
});

function handleIPC() {
  ipcMain.handle('work-notification', async function() {
    let res = await new Promise((resolve, reject) => {
      let notification = new Notification({
        title: '任务结束',
        body: '是否开始休息',
        actions: [{ text: '开始休息', type: 'button' }], // macOS only
        closeButtonText: '继续工作' // macOS only
      });
      notification.show();
      // 响应点击事件 action 和 close
      notification.on('action', () => {
        resolve('rest');
      });
      notification.on('close', () => {
        resolve('work');
      });
    });
    return res;
  });
}
