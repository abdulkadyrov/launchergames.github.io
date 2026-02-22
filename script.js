let imageData = "";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let drawing = false;
let brushColor = "#000000";
let brushSize = 8;
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

  // Белый фон для холста
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

// ===== Координаты =====
function getTouchPos(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.touches[0].clientX - rect.left) * scaleX,
    y: (e.touches[0].clientY - rect.top) * scaleY
  };
}

// ===== Рисование =====
canvas.addEventListener("touchstart", startDraw);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopDraw);

function startDraw(e){
  drawing = true;
  draw(e);
}

function draw(e){
  if(!drawing) return;
  e.preventDefault();

  const pos = getTouchPos(e);

  ctx.fillStyle = brushColor;

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

function setEraser(){
  brushColor = "white"; // ластик просто закрашивает белым
}

function clearCanvas(){
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,canvas.width,canvas.height);
}

// ===== Конец =====
function finishDrawing(){
  clearInterval(drawInterval);
  showScreen("resultScreen");

  document.getElementById("originalResult").src = imageData;
  document.getElementById("drawingResult").src = canvas.toDataURL("image/png");
}