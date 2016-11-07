/**
 * Created by nakasato on 2016/11/07.
 */
// 画像オブジェクト生成
var lemImage = new Image();

// 画像パスを画像obj.srcに設定
lemImage.src = pngurl;

// 画像の初回ロード時に画像を表示する
lemImage.onload = (function () {   
    ImageToCanvas(lemImage);
});

function ImageToCanvas(im) {
        
}