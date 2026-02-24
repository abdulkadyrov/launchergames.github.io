let imageData = "";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let drawing = false;
let brushColor = "#000000";
let brushSize = 8;
let currentTool = "brush";
let drawInterval;

// ===== Экран =====
function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ===== Resize =====
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}

window.addEventListener("resize", resizeCanvas);

// ===== Загрузка фото =====
document.getElementById("upload").onchange = function(e){
  const reader = new FileReader();
  reader.onload = function(event){
    imageData = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
};

// ===== Таймер показа =====
function startMemory(){
  if(!imageData){
    alert("Выбери фото!");
    return;
  }

  showScreen("memoryScreen");

  let img = document.getElementById("memoryImage");
  img.src = imageData;

  let time = parseInt(document.getElementById("viewTime").value);
  let timer = document.getElementById("memoryTimer");
  timer.innerText = time;

  let interval = setInterval(()=>{
    time--;
    timer.innerText = time;
    if(time <= 0){
      clearInterval(interval);
      startDrawing();
    }
  },1000);
}

// ===== Таймер рисования =====
function startDrawing(){
  showScreen("drawScreen");
  resizeCanvas();

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  setBrush();

  let time = parseInt(document.getElementById("drawTime").value);
  let timer = document.getElementById("drawTimer");
  timer.innerText = time;

  drawInterval = setInterval(()=>{
    time--;
    timer.innerText = time;
    if(time <= 0){
      clearInterval(drawInterval);
      finishDrawing();
    }
  },1000);
}

// ===== Рисование =====
canvas.addEventListener("touchstart", startDraw);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopDraw);

function getTouchPos(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.touches[0].clientX - rect.left) * scaleX,
    y: (e.touches[0].clientY - rect.top) * scaleY
  };
}

function startDraw(e){
  drawing = true;
  draw(e);
}

function draw(e){
  if(!drawing) return;
  e.preventDefault();

  const pos = getTouchPos(e);

  if(currentTool === "eraser"){
    ctx.globalCompositeOperation = "destination-out";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = brushColor;
  }

  ctx.beginPath();
  ctx.arc(pos.x, pos.y, brushSize, 0, Math.PI * 2);
  ctx.fill();
}

function stopDraw(){
  drawing = false;
}

// ===== Инструменты =====
document.getElementById("colorPicker").oninput = function(){
  brushColor = this.value;
};

document.getElementById("brushSize").oninput = function(){
  brushSize = this.value;
};

function setBrush(){
  currentTool = "brush";
  document.getElementById("brushBtn").classList.add("activeTool");
  document.getElementById("eraserBtn").classList.remove("activeTool");
}

function setEraser(){
  currentTool = "eraser";
  document.getElementById("eraserBtn").classList.add("activeTool");
  document.getElementById("brushBtn").classList.remove("activeTool");
}

function clearCanvas(){
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,canvas.width,canvas.height);
}

// ===== Конец =====
function finishDrawing(){
  clearInterval(drawInterval);
  ctx.globalCompositeOperation = "source-over";
  showScreen("resultScreen");

  document.getElementById("originalResult").src = imageData;
  document.getElementById("drawingResult").src = canvas.toDataURL("image/png");
}
