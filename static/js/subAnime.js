/**
 * Created by varuma on 2016/10/16.
 */

var speedX = Math.floor(Math.random() * 40);
var speedY = Math.floor(Math.random() * 40);
var locX = 200;
var locY = 150;

function init() {
    var canvas = document.getElementById("yukimi");
    ctx = canvas.getContext('2d');
    setInterval(draw, 80);
}

function draw() {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(8,8,12,.2)";
    ctx.fillRect(0, 0, 400, 300);
    ctx.globalCompositeOperation = "lighter";

    //位置を更新
    locX += speedX;
    locY += speedY;

    if (locX < 0 || locX > 400) {
        speedX *= -1;
    }

    if (locY < 0 || locY > 300) {
        speedY *= -1;
    }

    //更新した座標で円を描く

    ctx.beginPath();
    ctx.fillStyle = '#33FF99';
    ctx.arc(locX, locY, 4, 0, Math.PI * 2.0, true);
    ctx.fill();

}
