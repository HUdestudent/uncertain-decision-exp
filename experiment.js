
const canvas = document.getElementById("experimentCanvas");
const ctx = canvas.getContext("2d");

let trial = 0;
const totalTrials = 5;
const gridSize = 5;
const boxSize = 90;
let revealed = [];
let colors = [];
let startTime;
let data = [];

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 25; i++) {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    const x = col * 100 + 10;
    const y = row * 100 + 10;
    ctx.fillStyle = revealed.includes(i) ? colors[i] : "#ccc";
    ctx.fillRect(x, y, boxSize, boxSize);
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(x, y, boxSize, boxSize);
  }
}

function startTrial() {
  document.getElementById("choiceArea").style.display = "none";
  document.getElementById("confidenceArea").style.display = "none";
  const colorA = "#e74c3c"; // red
  const colorB = "#27ae60"; // green
  colors = new Array(25).fill(colorA);
  const numReveal = Math.floor(Math.random() * 15) + 5;
  const idx = [...Array(25).keys()].sort(() => 0.5 - Math.random()).slice(0, numReveal);
  const bCount = Math.floor(Math.random() * numReveal);
  for (let i = 0; i < bCount; i++) colors[idx[i]] = colorB;
  revealed = idx;
  drawGrid();
  startTime = performance.now();
  canvas.onclick = () => {
    canvas.onclick = null;
    document.getElementById("choiceArea").style.display = "block";
  };
}

function makeChoice(choice) {
  const rt = ((performance.now() - startTime) / 1000).toFixed(2);
  document.getElementById("choiceArea").style.display = "none";
  document.getElementById("confidenceArea").style.display = "block";
  data.push({
    trial: trial + 1,
    red: revealed.filter(i => colors[i] === "#e74c3c").length,
    green: revealed.filter(i => colors[i] === "#27ae60").length,
    rt: rt,
    choice: choice,
    confidence: null
  });
}

function selectConfidence(val) {
  data[trial].confidence = val;
  trial++;
  document.getElementById("confidenceArea").style.display = "none";
  if (trial < totalTrials) {
    startTrial();
  } else {
    document.getElementById("downloadArea").style.display = "block";
    alert("实验结束，请下载结果。");
  }
}

function downloadCSV() {
  const headers = "Trial,Red,Green,RT,Choice,Confidence\n";
  const rows = data.map(d => [d.trial, d.red, d.green, d.rt, d.choice, d.confidence].join(",")).join("\n");
  const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "colored_decision_results.csv";
  link.click();
}

window.onload = startTrial;
