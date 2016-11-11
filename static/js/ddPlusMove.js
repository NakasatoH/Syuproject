/**
 * Created by nakasato on 2016/11/10.
 */
var old_dx = 0;
var old_dy = 0;
var images = [];
// ドラッグ開始処理
function f_dragstart(event) {
    // ドラッグするデータのid名をDataTransferオブジェクトにセット
    event.dataTransfer.setData("text", event.target.id);
    console.log(event.dataTransfer.getData("text"));
}
// ドラッグ要素がドロップ要素に重なっている間の処理
function f_dragover(event) {
    //dragoverイベントをキャンセルして、ドロップ先の要素がドロップを受け付けるようにする
    event.preventDefault();
}
// ドロップ時の処理
function f_drop(event) {
    // ドラッグされたデータのid名をDataTransferオブジェクトから取得
    var id_name = event.dataTransfer.getData("text");

    // id名からドラッグされた要素を取得
    var drag_elm = document.getElementById(id_name);
    var data_d = drag_elm.getAttribute("data-d");
    var data_n = drag_elm.getAttribute("data-n");

    /**
     * window.setTimeoutは並行処理であるため、currentTarget.appendChild()もpreventDefaultもsetTimeout内に入れる必要がある
     * また、更にその中でもevent.preventDefault()の方が処理順が速いため、currentTargetを見失ってしまう。
     * その対策として、変数に値を代入して保持して億必要がある。
     */
    var currentTarget = event.currentTarget;
    window.setTimeout(function () {
        // ドロップ先にドラッグされた要素を追加をする
        if (currentTarget.id == "bottom") {
            // 全ての画像をもとのボックスに戻すため配列の中に入れる処理を追加
            inputArray(id_name);

            console.log("画像ファイル : " + lemImage.src + ", 方向 : " + data_d + ", 数値 : " + data_n);
            console.log("ドロップ先     タグ名 : " + currentTarget.tagName + ", ID名 : " + currentTarget.id);
            console.log("追加する要素   タグ名 : " + drag_elm.tagName + ", ID名 : " + drag_elm.id);

            // キャンバスに影響を与える
            ImageToCanvas(lemImage, data_d, data_n);
        } else if (currentTarget.id == "upper") {
            // 画像を元のボックスに戻した場合、配列をソートして詰める
            outputArray(id_name);
        }
        currentTarget.appendChild(drag_elm);
        // エラー回避のため、ドロップ処理の最後にdropイベントをキャンセルしておく
        event.preventDefault();
    }, 150);
}

/**------------------------------------------------------
 * 配列処理関系
 * ------------------------------------------------------
 */
function inputArray(id) {
    var arrayFlg = false;
    for (var i = 0; i < images.length; i++) {
        if (images[i] == id) {
            arrayFlg = true;
        }
    }
    if (arrayFlg == false) {
        images[images.length] = id;
    }
    // 表示用
    for (i = 0; i < images.length; i++) {
        console.log("images配列[" + i + "] : " + images[i]);
    }
}
function outputArray(id) {
    for (var i = 0; i < images.length; i++) {
        if (images[i] == id) {
            for(i; i < images.length; i++){
                if(i + 1 < images.length) {
                    images[i] = images[i + 1]
                }
            }
        }
    }
    images.pop();
    // 表示用
    for (i = 0; i < images.length; i++) {
        console.log("images配列[" + i + "] : " + images[i]);
    }
}

/**------------------------------------------------------
 * 画像処理関係
 * ------------------------------------------------------
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

function ImageToCanvas(im, direction, num) {
    var dx = 0;
    var dy = 0;
    var n = parseInt(num);
    var canvas = document.getElementById('cvs');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    switch (direction) {
        case "t":
            dy = -1 * n;
            break;
        case "r":
            dx = n;
            break;
        case "b":
            dy = n;
            break;
        case "l":
            dx = -1 * n;
    }
    dx += old_dx;
    dy += old_dy;
    old_dx = dx;
    old_dy = dy;
    console.log("dx : " + dx + "  dy : " + dy);
    ctx.translate(dx, dy);
    ctx.drawImage(im, 0, 0);
    ctx.translate(-1 * dx, -1 * dy);
}
