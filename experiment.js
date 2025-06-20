
const canvas = document.getElementById("experimentCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 5;
const blockSize = 100;
const totalTrials = 5;

let trial = 0;
let trialData = [];
let revealed = [];
let blockColors = [];
let startTime;

function drawGrid(revealedIdx = []) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 25; i++) {
    let row = Math.floor(i / gridSize);
    let col = i % gridSize;
    let x = col * (blockSize / 1.5);
    let y = row * (blockSize / 1.5);
    ctx.fillStyle = revealedIdx.includes(i) ? blockColors[i] : "#888888";
    ctx.fillRect(x + 10, y + 10, blockSize - 30, blockSize - 30);
  }
}

function startTrial() {
  const colorA = "#ff4444";
  const colorB = "#4444ff";
  const numReveal = Math.floor(Math.random() * 25) + 1;
  revealed = [];
  blockColors = new Array(25).fill(colorA);
  let indices = [...Array(25).keys()].sort(() => 0.5 - Math.random());
  let blueCount = Math.floor(Math.random() * numReveal);
  for (let i = 0; i < blueCount; i++) blockColors[indices[i]] = colorB;
  revealed = indices.slice(0, numReveal);
  drawGrid(revealed);
  document.getElementById("confidence").style.display = "none";
  startTime = performance.now();
  canvas.onclick = () => {
    const rt = ((performance.now() - startTime) / 1000).toFixed(2);
    document.getElementById("confidence").style.display = "block";
    canvas.onclick = null;
    trialData.push({
      trial: trial + 1,
      red: revealed.filter(i => blockColors[i] === colorA).length,
      blue: revealed.filter(i => blockColors[i] === colorB).length,
      rt: rt,
      confidence: null
    });
  };
}

function selectConfidence(val) {
  document.getElementById("confidence").style.display = "none";
  trialData[trial].confidence = val;
  trial++;
  if (trial < totalTrials) {
    startTrial();
  } else {
    document.getElementById("resultArea").style.display = "block";
    alert("实验结束，请下载结果。");
  }
}

function downloadCSV() {
  const headers = "Trial,Red,Blue,RT,Confidence\n";
  const rows = trialData.map(d => [d.trial, d.red, d.blue, d.rt, d.confidence].join(",")).join("\n");
  const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "decision_experiment_results.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

window.onload = startTrial;
    