/**
 * Created by nakasato on 2017/02/10.
 */
/**
 * Created by nakasato on 2016/11/16.
 */
/**------------------------------------------------------------
 * 後ろ側のキャンバス　役割：UI,MAP,障害物の設定
 * ------------------------------------------------------------
 */

// 画像オブジェクト生成
var imageB = new Image();
var imageG = new Image();
var imageP = new Image();
var haikei = new Image();

// 全ての画像のロードが完了してから描画するためのフラグ
var iBFlg = false;
var iGFlg = false;
var iPFlg = false;
var haikeiFlg = false;

// 画像パスを画像obj.srcに設定
imageB.src = block_bSrc;
imageG.src = goalSrc;
imageP.src = akitoSrc;
haikei.src = umiSrc + "?" + new Date().getTime();

// 画像の初回ロード時に画像を表示する
imageB.onload = (function () {
    iBFlg = true;
});
imageG.onload = (function () {
    iGFlg = true;
});
imageP.onload = (function () {
    iPFlg = true;
});
haikei.onload = (function () {
    haikeiFlg = true;
});

var map = mapData;
var blockWidth = imageB.width;//ブロックの横幅
var blockHeight = imageB.height;

var times = setInterval(function () {
    ITC2(imageB, imageG, imageP);

    if (iBFlg && iGFlg && haikeiFlg) {
        clearInterval(times);
    }
}, 50);

function ITC2(imgB, imgG, imgP) {
    var dx = 0;// x座標
    var dy = 0;// y座標
    var canvas2 = document.getElementById('backCvs');
    var ctx2 = canvas2.getContext('2d');
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    ctx2.drawImage(haikei, 0, 0);
    for (var y = 0; y * imgB.height < canvas2.height; y++) {
        dy = blockHeight * y;

        for (var x = 0; x < 10; x++) {
            dx = blockWidth * x;
            ctx2.translate(dx, dy);
            console.log("xy:"+ x,y,map[y][x]);
            if (map[y][x] == "*") {
                ctx2.drawImage(imgB, 0, 0);
            }
            if (map[y][x] == "g") {
                ctx2.drawImage(imgG, 0, 0);
            }
            if (map[y][x] == "p"){
                ctx2.drawImage(imgP, 0, 0);
            }
            ctx2.translate(-1 * dx, -1 * dy);
        }
    }
}