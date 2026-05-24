const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scoreText = document.getElementById('score');
const finalScore = document.getElementById('finalScore');
const gameOverBox = document.getElementById('gameOver');
const mapName = document.getElementById('mapName');

const maps = [
{
name:'Toy City',
road:'#555',
bg:'#2c3e50'
},
{
name:'Desert Run',
road:'#775533',
bg:'#d4a373'
},
{
name:'Snow Drift',
road:'#999',
bg:'#cfe8ff'
},
{
name:'Neon Night',
road:'#222',
bg:'#0f0f2f'
}
];

let currentMap = 0;

const player = {
x: canvas.width / 2 - 35,
y: canvas.height - 180,
width:70,
height:120,
color:'#00ff99',
speed:7
};

let policeCars = [];
let score = 0;
let gameOver = false;
let roadOffset = 0;

function spawnPolice(){

const width = 70;
const height = 120;

const x = Math.random() * (canvas.width - width);

policeCars.push({
x,
y:-150,
width,
height,
speed:4 + Math.random() * 4
});

}

setInterval(() => {

if(!gameOver){
spawnPolice();
}

}, 1200);

function drawRoad(){

const map = maps[currentMap];

ctx.fillStyle = map.bg;
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.fillStyle = map.road;
ctx.fillRect(canvas.width*0.2,0,canvas.width*0.6,canvas.height);

ctx.strokeStyle='white';
ctx.lineWidth=8;
ctx.setLineDash([40,30]);
ctx.lineDashOffset = -roadOffset;

ctx.beginPath();
ctx.moveTo(canvas.width/2,0);
ctx.lineTo(canvas.width/2,canvas.height);
ctx.stroke();

roadOffset += 10;

}

function drawPlayer(){

ctx.fillStyle = player.color;

ctx.beginPath();
ctx.roundRect(player.x,player.y,player.width,player.height,20);
ctx.fill();

ctx.fillStyle='black';
ctx.fillRect(player.x+10,player.y+15,50,30);

ctx.fillStyle='yellow';

ctx.beginPath();
ctx.arc(player.x+15,player.y+100,8,0,Math.PI*2);
ctx.arc(player.x+55,player.y+100,8,0,Math.PI*2);
ctx.fill();

}

function drawPolice(car){

ctx.fillStyle='#ff4444';

ctx.beginPath();
ctx.roundRect(car.x,car.y,car.width,car.height,20);
ctx.fill();

ctx.fillStyle='blue';
ctx.fillRect(car.x+15,car.y+10,40,15);

ctx.fillStyle='black';
ctx.fillRect(car.x+10,car.y+30,50,30);

}

function updatePolice(){

for(let i=0;i<policeCars.length;i++){

const car = policeCars[i];

car.y += car.speed;

drawPolice(car);

if(
player.x < car.x + car.width &&
player.x + player.width > car.x &&
player.y < car.y + car.height &&
player.y + player.height > car.y
){
endGame();
}

if(car.y > canvas.height){

policeCars.splice(i,1);

score++;

scoreText.innerText = score;

}

}

}

function gameLoop(){

if(gameOver) return;

ctx.clearRect(0,0,canvas.width,canvas.height);

if(score > 20){
currentMap = 1;
}

if(score > 40){
currentMap = 2;
}

if(score > 60){
currentMap = 3;
}

mapName.innerText = maps[currentMap].name;

drawRoad();

drawPlayer();

updatePolice();

requestAnimationFrame(gameLoop);

}

function moveLeft(){

player.x -= player.speed * 25;

if(player.x < canvas.width*0.2){
player.x = canvas.width*0.2;
}

}

function moveRight(){

player.x += player.speed * 25;

if(player.x + player.width > canvas.width*0.8){
player.x = canvas.width*0.8 - player.width;
}

}

function endGame(){

gameOver = true;

finalScore.innerText = score;

gameOverBox.style.display='block';

}

function restartGame(){

score = 0;

policeCars = [];

player.x = canvas.width / 2 - 35;

gameOver = false;

scoreText.innerText = 0;

gameOverBox.style.display='none';

currentMap = 0;

gameLoop();

}

window.restartGame = restartGame;

document.getElementById('leftBtn').addEventListener('click',moveLeft);

document.getElementById('rightBtn').addEventListener('click',moveRight);

window.addEventListener('keydown',(e)=>{

if(e.key === 'ArrowLeft') moveLeft();

if(e.key === 'ArrowRight') moveRight();

});

gameLoop();
