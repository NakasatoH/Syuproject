/**
 * Created by nakasato on 2016/11/07.
 */
// 画像オブジェクト生成
var lemImage = new Image();

var i = 0;
// 画像パスを画像obj.srcに設定
lemImage.src = lemSrc;

// 画像の初回ロード時に画像を表示する
lemImage.onload = (function () {   
    ImageToCanvas(lemImage);
});

function ImageToCanvas(im) {
    var canvas = document.getElementById('cvs');
    var ctx = canvas.getContext('2d');

    for(var j = 0;j < 10; j ++){
        i += j;
        // キャンバスをクリア
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.translate(i,i);
        ctx.drawImage(im, 0, 0);
        ctx.translate(-1 * i,-1 * i);
    }
}
