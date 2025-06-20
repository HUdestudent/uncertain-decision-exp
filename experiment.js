
const canvas = document.getElementById("experimentCanvas");
const ctx = canvas.getContext("2d");

let trial = 0;
const totalTrials = 5;
const gridSize = 5;
const blockSize = 80;
let revealed = [];
let colors = [];
let trialData = [];
let decisionStartTime;

function updateProgress() {
  document.getElementById("progress").innerText = `第 ${trial + 1} / ${totalTrials} 轮`;
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 25; i++) {
    let row = Math.floor(i / gridSize);
    let col = i % gridSize;
    let x = col * 95 + 10;
    let y = row * 95 + 10;
    ctx.fillStyle = revealed.includes(i) ? colors[i] : "#aaaaaa";
    ctx.fillRect(x, y, blockSize, blockSize);
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(x, y, blockSize, blockSize);
  }
}

function startTrial() {
  updateProgress();
  document.getElementById("colorChoice").style.display = "flex";
  document.getElementById("confidenceArea").style.display = "none";
  document.getElementById("resultBlock").innerHTML = "";

  document.getElementById("redBlock").classList.remove("highlight");
  document.getElementById("blueBlock").classList.remove("highlight");

  const red = "#ff4d4d";
  const blue = "#4d6dff";
  colors = new Array(25).fill(red);
  const numReveal = Math.floor(Math.random() * 15) + 5;
  let indices = [...Array(25).keys()].sort(() => 0.5 - Math.random()).slice(0, numReveal);
  const blueCount = Math.floor(Math.random() * numReveal);
  for (let i = 0; i < blueCount; i++) colors[indices[i]] = blue;
  revealed = indices;
  drawGrid();

  decisionStartTime = performance.now();
}

function recordDecision(choice) {
  const rt = ((performance.now() - decisionStartTime) / 1000).toFixed(2);
  document.getElementById("colorChoice").style.display = "none";
  document.getElementById("confidenceArea").style.display = "block";

  if (choice === '红色') {
    document.getElementById("redBlock").classList.add("highlight");
  } else {
    document.getElementById("blueBlock").classList.add("highlight");
  }

  document.getElementById("resultBlock").innerHTML = `你选择的是：<span style="color:${choice === '红色' ? '#ff4d4d' : '#4d6dff'}">${choice}</span>`;

  const redCount = revealed.filter(i => colors[i] === "#ff4d4d").length;
  const blueCount = revealed.filter(i => colors[i] === "#4d6dff").length;

  trialData.push({
    trial: trial + 1,
    red: redCount,
    blue: blueCount,
    decision: choice,
    rt: rt,
    confidence: null
  });
}

function recordConfidence(score) {
  trialData[trial].confidence = score;
  trial++;
  document.getElementById("confidenceArea").style.display = "none";

  if (trial < totalTrials) {
    startTrial();
  } else {
    document.getElementById("downloadArea").style.display = "block";
    document.getElementById("progress").innerText = "实验完成！";
    alert("实验完成！你可以下载结果。");
  }
}

function downloadCSV() {
  let header = "Trial,Red,Blue,Decision,RT,Confidence\n";
  let rows = trialData.map(d => [d.trial, d.red, d.blue, d.decision, d.rt, d.confidence].join(",")).join("\n");
  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "colorblock_progress_data.csv";
  link.click();
}

window.onload = startTrial;
