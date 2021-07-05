const { ipcRenderer } = require('electron');
const Timer = require('timer.js');

function startWork() {
  let workTimer = new Timer({
    ontick: ms => { // ms: 剩余的毫秒数
      updateTime(ms);
    },
    onend: () => {
      notification();
    }
  });
  workTimer.start(10); // start a timer for 10 seconds
}
// 处理倒计时
function updateTime(ms) {
  // ms 剩余的毫秒数
  let timerContainer = document.getElementById('timer-container');
  // formats a number using fixed-point notation. 四舍五入，定点数展示。
  // ms = 123456789 --> 123456.789 --> "123457"
  let s = (ms / 1000).toFixed(0); // 总毫秒数转成总秒数
  let ss = s % 60;  // 秒数
  let mm = (s / 60).toFixed(0); // 分钟数
  // 使用 padStart 进行补位，前面补0
  timerContainer.innerText = `${mm
    .toString()
    .padStart(2, 0)} : ${ss.toString().padStart(2, 0)}`;
}
// 实现通知主线程
async function notification() {
  let res = await ipcRenderer.invoke('work-notification');
  if (res === 'rest') {
    setTimeout(() => {
      alert('休息');
      // 后续需要对“休息”做进一步处理
    }, 5 * 1000);
  } else if (res === 'work') {
    // 继续工作
    startWork();
  }
}

startWork();
