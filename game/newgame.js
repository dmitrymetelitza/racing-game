let start = document.getElementById("start");
let cvs = document.getElementById("canvas");

let ctx = cvs.getContext("2d");

let taxi = new Image();
let road = new Image();
let redCar = new Image();
let blueCar = new Image();
let bornCar = new Image();
let boom = new Image();
let sprite = new Image();
let loos = new Audio();
let win = new Audio();
let tormoz = new Audio();
let speedup = new Audio();
let fonmusic = new Audio();
let ydar = new Audio();

taxi.src = "/racing-game/game/img/taxi.png";
redCar.src = "/racing-game/game/img/redcar.png";
blueCar.src = "/racing-game/game/img/bluecar.png";
bornCar.src = "/racing-game/game/img/borncar.png";
road.src = "/racing-game/game/img/Road.png";
boom.src = "/racing-game/game/img/boom.png";
sprite.src = "/racing-game/game/img/sprite.png";
loos.src = "/racing-game/game/audio/loos.mp3";
win.src = "/racing-game/game/audio/win.mp3";
tormoz.src = "/racing-game/game/audio/tormoz.mp3";
speedup.src = "/racing-game/game/audio/speedup.mp3";
fonmusic.src = "/racing-game/game/audio/lil_jon.mp3";
ydar.src = "/racing-game/game/audio/ydar.mp3";

let i = 0;
let score = 0;
let lives = 2;
let level = 0;
let timer = 0;
let carSpeed = 0;
let speed = 10;
let finish = false;
let stop = false;
let left = false;
let right = false;
let up = false;
let down = false;
let auto = [blueCar, redCar, bornCar];
let taxiXY = { x: 220, y: 525 };
let autoXY = [{ x: 50, y: -900 }];
let autoBlueXY = [{ x: 100, y: -1500 }];

let roadarr = [{ x: 0, y: 0 }];
for (i = 0; i < 1000; i++) {
  roadarr.push({ x: 0, y: -683 * (i + 1) });
}

sprite.onload = function () {
  game();
};

function game() {
  fonmusic.play();
  update();
  render();
  let anim = requestAnimationFrame(game);
  if (stop === true) {
    cancelAnimationFrame(anim);
    loos.play();
    fonmusic.pause();
    if (score > localStorage.getItem("top10", score)) {
      localStorage.setItem("top10", score);
    }
    return;
  }
  if (finish == true) {
    cancelAnimationFrame(anim);
    win.play();
    fonmusic.pause();
    if (score > localStorage.getItem("top10", score)) {
      localStorage.setItem("top10", score);
    }
    return;
  }
}

function update() {
  for (i in roadarr) {
    roadarr[i].y = roadarr[i].y + speed + carSpeed;
    if (roadarr[i].y > 1000) {
      roadarr.splice(i, 1);
    }
  }
  if (left == true && taxiXY.x > 0) taxiXY.x -= 5;
  if (right == true && taxiXY.x < 450) taxiXY.x += 5;
  if (up == true) {
    taxiXY.y -= 1;
    carSpeed += 0.1;
    if (taxiXY.y <= 450) taxiXY.y = 450;
    if (carSpeed > 3) {
      carSpeed = 3;
    }
  }
  if (down == true) {
    taxiXY.y += 1.5;
    carSpeed -= 0.1;
    if (taxiXY.y >= 525) taxiXY.y = 525;
    if (carSpeed < 0) {
      carSpeed = 0;
    }
  }
  if (up === false) {
    taxiXY.y += 1;
    carSpeed -= 0.05;
    if (taxiXY.y >= 525) taxiXY.y = 525;
    if (carSpeed < 0) {
      carSpeed = 0;
    }
  }
  timer++;
  for (i in autoXY) {
    autoXY[i].y = autoXY[i].y + speed + carSpeed - 2;
    if (autoXY[i].y > 1000) {
      autoXY.splice(i, 1);
    }
    if (
      typeof autoXY[i].y !== "undefined" &&
      typeof autoXY[i].x !== "undefined" &&
      typeof taxiXY.y !== "undefined" &&
      typeof taxiXY.x !== "undefined" &&
      autoXY[i].y < taxiXY.y + 117 &&
      autoXY[i].y + 117 > taxiXY.y &&
      autoXY[i].x < taxiXY.x + 40 &&
      autoXY[i].x + 58 > taxiXY.x
    ) {
      autoXY.splice(i, 1);
      lives--;
      ydar.play();
      if (lives < 1) {
        stop = true;
      }
    }
  }
  for (i in autoBlueXY) {
    autoBlueXY[i].y = autoBlueXY[i].y + speed + carSpeed - 2;
    if (autoBlueXY[i].y > 1000) {
      autoBlueXY.splice(i, 1);
    }
    if (
      autoBlueXY[i].y < taxiXY.y + 117 &&
      autoBlueXY[i].y + 117 > taxiXY.y &&
      autoBlueXY[i].x < taxiXY.x + 40 &&
      autoBlueXY[i].x + 58 > taxiXY.x
    ) {
      autoBlueXY.splice(i, 1);
      lives--;
      ydar.play();
      if (lives < 1) {
        stop = true;
      }
    }
  }
  for (j in autoXY) {
    for (i in autoBlueXY) {
      if (
        autoBlueXY[i].x + 65 > autoXY[j].x &&
        autoBlueXY[i].x < autoXY[j].x + 50 &&
        autoBlueXY[i].y < autoXY[j].y + 120 &&
        autoBlueXY[i].y + 120 > autoXY[j].y
      ) {
        autoBlueXY.splice(i, 1);
      }
    }
  }

  if (timer % 100 == 0) {
    autoXY.push({
      x: Math.floor(Math.random() * 430),
      y: -700,
    });
    autoBlueXY.push({
      x: Math.floor(Math.random() * 430),
      y: -850,
    });
  }

  if (timer % 1000 == 0) {
    speed++;
    level++;
    if (level >= 5) {
      finish = true;
    }
  }
  // Подсчет очков
  if (timer % 10 == 0) {
    let a = (speed + carSpeed * 2) / 10;
    score = Math.floor(a) + score;
  }
}

function render() {
  for (i in roadarr) ctx.drawImage(road, roadarr[i].x, roadarr[i].y, 500, 683);
  for (j in autoXY) ctx.drawImage(auto[1], autoXY[j].x, autoXY[j].y, 70, 125);
  ctx.drawImage(taxi, taxiXY.x, taxiXY.y, 50, 125);
  for (i in autoBlueXY)
    ctx.drawImage(auto[0], autoBlueXY[i].x, autoBlueXY[i].y, 70, 125);
  ctx.fillStyle = "#000";
  ctx.font = "24px Verdana";
  ctx.fillText("Score: " + score, 10, 40);
  ctx.fillText("Level: " + level, 380, 40);
  ctx.fillText("Lives: " + lives, 200, 40);
  ctx.fillText("Best score: " + localStorage.getItem("top10"), 10, 80);
  if (stop == true) {
    ctx.font = "80px Arial";
    ctx.fillStyle = "Red";
    ctx.fillText("Game over", 50, 300);
  }
  if (finish == true) {
    ctx.font = "80px Arial";
    ctx.fillStyle = "Red";
    ctx.fillText("You Win", 100, 300);
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
document.addEventListener("keydown", function (event) {
  if (event.code == "ArrowLeft") {
    left = true;
  }
  if (event.code == "ArrowRight") {
    right = true;
  }
  if (event.code == "ArrowUp") {
    up = true;
  }
  if (event.code == "ArrowDown") {
    down = true;
    tormoz.play();
  }
});
document.addEventListener("keyup", function (event) {
  if (event.code == "ArrowLeft") {
    left = false;
  }
  if (event.code == "ArrowRight") {
    right = false;
  }
  if (event.code == "ArrowUp") {
    up = false;
  }
  if (event.code == "ArrowDown") {
    down = false;
    tormoz.currentTime = 0;
    tormoz.pause();
  }
});
