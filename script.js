let cvs = document.getElementById("canvas");
let ctx = cvs.getContext("2d");

let taxi = new Image();
let road = new Image();
let redCar = new Image();
let blueCar = new Image();
let bornCar = new Image();
let boom = new Image();
let sprite = new Image();

taxi.src = "/img/taxi.png";
redCar.src = "/img/redcar.png";
blueCar.src = "/img/bluecar.png";
bornCar.src = "/img/borncar.png";
road.src = "/img/Road.png";
boom.src = "/img/boom.png";
sprite.src = "/img/sprite.png";

let score = 0;
let level = 0;
let timer = 0;
let speed = 10;
let expl = [];

// Дорога бесконечна
let roadarr = [{ x: 0, y: 0 }];
for (let i = 0; i < 1000; i++) {
  roadarr.push({ x: 0, y: -683 * (i + 1) });
}

let auto = [blueCar, redCar, bornCar];
// Taxi XY
let taxiXY = { x: 200, y: 425 };
// Auto XY
let autoXY = [{ x: 50, y: -900 }];

road.onload = function () {
  game();
};
// Основной игровой цикл
function game() {
  update();
  render();
  requestAnimationFrame(game);
}

// Физика и данные
function update() {
  // Движение дороги
  for (i in roadarr) {
    roadarr[i].y = roadarr[i].y + speed;
  }
  //  Движение автомобилей
  for (j in autoXY) {
    autoXY[j].y = autoXY[j].y + speed - 2;

    // условие проигрыша
    if (
      autoXY[j].x + 58 > taxiXY.x &&
      autoXY[j].x < taxiXY.x + 40 &&
      autoXY[j].y < taxiXY.y + 117 &&
      autoXY[j].y + 117 > taxiXY.y
    ) {
      // взрыв
      expl.push({
        x: autoXY[j].x,
        y: autoXY[j].y,
        animx: 0,
        animy: 0,
      });
    }
  }
  // анимация взрыва
  for (i in expl) {
    expl[i].animx = expl[i].animx + 0.1;
    if (expl[i].animx > 8) {
      expl[i].animy++;
      expl[i].animx = 0;
    }
    if (expl[i].animy > 6) {
      expl.slice(i, 1);
    }
  }
  // добавление автомобилей в случайном порадке
  timer++;
  if (timer % 150 == 0) {
    autoXY.push({
      x: Math.floor(Math.random() * (200 + 1)),
      y: -Math.floor(100 + Math.random() * (1800 + 1 - 100)),
    });
    autoXY.push({
      x: Math.floor(200 + Math.random() * (430 + 1 - 200)),
      y: -Math.floor(100 + Math.random() * (1800 + 1 - 100)),
    });
  }
  // Переход на следующий уровень
  if (timer % 1000 == 0) {
    speed++;
    level++;
  }
  // Подсчет очков
  if (timer % 10 == 0) {
    score++;
  }
}

// Отрисовка
function render() {
  for (i in roadarr) ctx.drawImage(road, roadarr[i].x, roadarr[i].y, 500, 683);
  ctx.drawImage(taxi, taxiXY.x, taxiXY.y, 50, 125);
  for (j in autoXY) {
    ctx.drawImage(auto[1], autoXY[j].x, autoXY[j].y, 70, 125);
  }
  for (i in expl)
    ctx.drawImage(
      sprite,
      256 * Math.floor(expl[i].animx),
      256 * Math.floor(expl[i].animx),
      256,
      256,
      expl[i].x,
      expl[i].y,
      40,
      40
    );
  // Отображения уровня и счета
  ctx.fillStyle = "#000";
  ctx.font = "24px Verdana";
  ctx.fillText("Score: " + score, 10, 40);
  ctx.fillText("Level: " + level, 380, 40);
}

// перемещение такси в стороны
document.addEventListener("keydown", leftGo);
function leftGo(event) {
  if (event.code == "ArrowLeft") {
    taxiXY.x -= 40;
  }
  if (event.code == "ArrowRight") {
    taxiXY.x += 40;
  }
  if (taxiXY.x > 450) {
    taxiXY.x = 450;
  }
  if (taxiXY.x < 0) {
    taxiXY.x = 0;
  }
}
cvs.addEventListener("mousemove", leftG);
function leftG(event) {
  taxiXY.x = event.offsetX;
  if (taxiXY.x > 450) {
    taxiXY.x = 450;
  }
  if (taxiXY.x < 0) {
    taxiXY.x = 0;
  }
}
