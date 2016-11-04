//画像オブジェクトに任意の画像を読み込み
var img = new Image();

//画像の読み込みが終わったら、canvasに貼付けを実行
img.onload = (function () {
    ImageToCanvas(img);
});

//画像のパス指定
img.src = pngurl;

function ImageToCanvas(im) {
    //入力欄からパラメータを取得
    var dx = document.getElementById("dx").value - 0;
    var dy = document.getElementById("dy").value - 0;

    //canvas(c1)のノードオブジェクト
    var canvas = document.getElementById('c1');

    //2Dコンテキストをctxに格納
    var ctx = canvas.getContext('2d');

    //一旦キャンバスをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //指定位置に移動
    ctx.translate(dx, dy);

    //読み込んだimgをcanvas(c1)に貼付け
    ctx.drawImage(im, 0, 0);

    //元の位置に戻す
    ctx.translate(-1 * dx, -1 * dy);

}

window.onload = (function () {
    var mo = (function () {
        ImageToCanvas(img);
    });
    document.getElementById("dx").onchange = mo;
    document.getElementById("dy").onchange = mo;
    document.getElementById("dx").onkeyup = mo;
    document.getElementById("dy").onkeyup = mo;

});