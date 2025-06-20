
const canvas = document.getElementById("experimentCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 5;
const blockSize = 100;
let revealed = [];
let blockColors = [];
let startTime;

function init() {
  // 生成两种颜色
  const colors = [["#ff4444", "红"], ["#4444ff", "蓝"]];
  const [colorA, colorB] = colors[Math.floor(Math.random() * 2)];
  const otherColor = colorA === colors[0][0] ? colors[1][0] : colors[0][0];
  const numRevealed = Math.floor(Math.random() * 25) + 1;
  revealed = [];
  blockColors = new Array(25).fill(colorA);
  let indices = [...Array(25).keys()].sort(() => 0.5 - Math.random());
  let colorBcount = Math.floor(Math.random() * numRevealed);
  for (let i = 0; i < colorBcount; i++) blockColors[indices[i]] = otherColor;
  revealed = indices.slice(0, numRevealed);
  drawGrid(revealed);
  startTime = performance.now();
}

function drawGrid(revealedIdx = []) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 25; i++) {
    let row = Math.floor(i / gridSize);
    let col = i % gridSize;
    let x = col * blockSize;
    let y = row * blockSize;
    ctx.fillStyle = revealedIdx.includes(i) ? blockColors[i] : "#888888";
    ctx.fillRect(x + 10, y + 10, blockSize - 20, blockSize - 20);
  }
}

canvas.addEventListener("click", function () {
  const reactionTime = ((performance.now() - startTime) / 1000).toFixed(2);
  alert("你选择了某种颜色，反应时间: " + reactionTime + " 秒");
  document.getElementById("confidence").style.display = "block";
});

function selectConfidence(val) {
  alert("你的信度选择是：" + val);
  location.reload();
}

window.onload = init;
    