
/**
 * Created by nakasato on 2016/11/16.
 */
/**------------------------------------------------------------
 * 後ろ側のキャンバス　役割：UI,MAP,障害物の設定
 * ------------------------------------------------------------
 */
// 画像オブジェクト生成
var image2 = new Image();
// 画像パスを画像obj.srcに設定
image2.src = block_bSrc;
// 画像の初回ロード時に画像を表示する
image2.onload = (function () {
    ITC2(image2);
});

var map = [
    ["*","*","*","*","*","*","*","*","*","*","*","*","*"],// (0,13)まで
    ["*","0","0","0","0","0","0","0","0","0","0","0","*"],
    ["*","0","0","0","0","0","0","0","0","0","0","0","*"],
    ["*","0","0","0","0","0","0","0","0","0","0","0","*"],
    ["*","0","0","0","0","0","0","0","0","0","0","0","*"],
    ["*","0","0","0","0","0","0","0","0","0","0","0","*"],
    ["*","0","0","0","0","0","0","0","0","0","0","0","*"],
    ["*","0","0","0","0","0","0","0","0","0","0","0","*"],
    ["*","*","*","*","*","*","*","*","*","*","*","*","*"]// (,13)まで
];
var map2 = mapData;

function arrayConverter() {
    
}
var blockWidth = image2.width;//ブロックの横幅
var blockHeight = image2.height;

function ITC2(im) {
    var dx = 0;// x座標
    var dy = 0;// y座標
    var canvas2 = document.getElementById('backCvs');
    var ctx2 = canvas2.getContext('2d');
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    /*
    for (var i = 0; dy < canvas2.height; i++) {
        ctx2.translate(dx, dy);// 座標指定　初期(0,0)から
        console.log("(dx , dy ) = (" + dx + "," + dy + ") imageSize - width :" + (dx + image2.width) + " height : " + (dy + image2.height));
        ctx2.drawImage(im, 0, 0);// 画像貼り付け
        ctx2.translate(-1 * dx, -1 * dy);
        dx = dx + blockWidth;
        if(dx > canvas2.width){
            dx = 0;
            dy += blockHeight;
        }
    }
    */
    for(var y = 0; y * image2.height< canvas2.height;y++ ){
        dy = blockHeight * y;
        for(var x = 0; x < 13;x++){
            dx = blockWidth * x;
            ctx2.translate(dx,dy);
            if(map[y][x] == "*") {
                ctx2.drawImage(im, 0, 0);
            }
            ctx2.translate(-1 * dx, -1 * dy);
        }
    }
}