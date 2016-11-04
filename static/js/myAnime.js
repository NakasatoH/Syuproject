/**
 * Created by varuma on 2016/11/01.
 */
const NUM = 50;
const WIDTH = 640;
const HEIGHT = 480;
var speedX = new Array(NUM);
var speedY = new Array(NUM);
var locX = new Array(NUM);
var locY = new Array(NUM);
var radius = new Array(NUM);
var r = new Array(NUM);
var g = new Array(NUM);
var b = new Array(NUM);
var ctx;

function init() {
    var canvas = document.getElementById('yukimi');
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        for (var i = 0; i < NUM; i++) {
            speedX[i] = Math.random() * 8.0 - 4.0;
            speedY[i] = Math.random() * 8.0 - 4.0;
            locX[i] = WIDTH / 2;
            locY[i] = HEIGHT / 2;
            radius[i] = Math.random() * 8.0 + 1.0;
            r[i] = Math.floor(Math.random() * 64);
            g[i] = Math.floor(Math.random() * 64);
            b[i] = Math.floor(Math.random() * 64);
        }
        setInterval(draw, 33);
    }
}

function draw() {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(8,8,12,.1)";// 通った跡の色
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.globalCompositeOperation = "xor";

    for (var i = 0; i < NUM; i++) {
        //位置を更新
        locX[i] += speedX[i];
        locY[i] += speedY[i];

        if (locX[i] < 0 || locX[i] > WIDTH) {
            speedX[i] *= -1.0;
        }

        if (locY[i] < 0 || locY[i] > HEIGHT) {
            speedY[i] *= -1.0;
        }

        //更新した座標で円を描く
        ctx.beginPath();
        ctx.fillStyle = 'rgb(' + r[i] + ',' + g[i] + ',' + b[i] + ')';//それぞれの色固定
        ctx.arc(locX[i], locY[i], 50, 0, Math.PI * 2.0, true);
        ctx.fill();
    }
}