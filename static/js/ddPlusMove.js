/**
 * Created by nakasato on 2016/11/10.
 */

var dx = 0;
var dy = 0;
var old_dx = 0; // 今までの位置を保持しておくための変数old_...
var old_dy = 0;
var images = [];// ドロップした順にidを保管するための配列
const moveNum = block_size;

// 画像オブジェクト生成
var image1 = new Image();

// 画像パスを画像obj.srcに設定
image1.src = mainImageSrc;

// 画像の初回ロード時に画像を表示する
image1.onload = (function () {
    var canvas = document.getElementById('cvs');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dx = pPositionX * block_size;
    dy = ( pPositionY + 1 ) * block_size - image1.height;
    old_dx = dx;
    old_dy = dy;
    ctx.translate(dx, dy);
    ctx.drawImage(image1, 0, 0);
    ctx.translate(-1 * dx, -1 * dy);
});

function changeCharacter() {
    var charElm = document.getElementById("characters");
    ImageToCanvas(image1);// 画像を表示してからイメージ画像のsrcを変更することで不自然な挙動を解消
    switch (charElm.selectedIndex) {
        case 0:
            break;
        case 1:
            this.image1.src = lemSrc;
            break;
        case 2:
            this.image1.src = t26e5Src;
            break;
        case 3:
            this.image1.src = masaruSrc;
            break;
    }
}

/**---------------------------------------------------------------------
 * D＆D関係
 * ----------------------------------------------------------------------
 */
// ドラッグ開始処理
function f_dragstart(event) {
    event.dataTransfer.setData("text", event.target.id);// ドラッグするデータのid名をDataTransferオブジェクトにセット
}

// ドラッグ要素がドロップ要素に重なっている間の処理
function f_dragover(event) {
    // dragoverイベントをキャンセルして、ドロップ先の要素がドロップを受け付けるようにする
    event.preventDefault();
}

// ドロップ時の処理
function f_drop(event) {
    var id_name = event.dataTransfer.getData("text");// ドラッグされたデータのid名をDataTransferオブジェクトから取得
    var drag_elm = document.getElementById(id_name);// id名からドラッグされた要素を取得

    var data_d = drag_elm.getAttribute("data-d");// 方向データ
    var data_n = drag_elm.getAttribute("data-n");// 移動量

    var canvas = document.getElementById('cvs');
    var bottomDiv = document.getElementById('bottom');// ドロップ先Divの位置を把握する必要がある
    var rect = bottomDiv.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    x = Math.floor(x);// 四捨五入　整数型にキャスト
    y = Math.floor(y);
    console.log("x : " + x + " y : " + y);

    /**
     * window.setTimeoutは並行処理であるため、currentTarget.appendChild()もpreventDefaultもsetTimeout内に入れる必要がある
     * また、更にその中でもevent.preventDefault()の方が処理順が速いため、currentTargetを見失ってしまう。
     * その対策として、変数に値を代入して保持しておく必要がある。
     */
    var currentTarget = event.currentTarget;
    // コード画像をドロップしたとき不自然な挙動にならないよう遅延を作る
    window.setTimeout(function () {
        if (currentTarget.id == "bottom") {
            inputArray(id_name);// 全ての画像をもとのボックスに戻すため配列の中に入れる処理を追加

            console.log("画像ファイル : " + image1.src + ", 方向 : " + data_d + ", 数値 : " + data_n);
            console.log("ドロップ先     タグ名 : " + currentTarget.tagName + ", ID名 : " + currentTarget.id);
            console.log("追加する要素   タグ名 : " + drag_elm.tagName + ", ID名 : " + drag_elm.id);

            /**
             * キャンバス内の画像を動かす処理
             */

            var cnt = 0;// 無限ループを防ぐための変数cnt
            var imageMoveInterval = setInterval(function () {// setIntervalは引数を与える場合, 無名関数  →　function(){関数名(引数1,引数2,...)}　を使用しなければならない
                if (cnt >= moveNum) {// if文を使用しないとループし続ける 移動px回ループする
                    clearInterval(imageMoveInterval);
                }
                cnt++;
                //----------------------------------------------------------------------------------
                //ImageToCanvas(image1, data_d, data_n)// 現在は画像をドロップしただけで画像が動く必要が無いのでコメントアウト
                //----------------------------------------------------------------------------------
            }, 10);
        } else if (currentTarget.id == "upper") {
            outputArray(id_name);// 画像を元のボックスに戻した場合、配列をソートして詰める
        }
        imagesLog();

        /** -------------------------------------------------------------------------------
         *  while,if文の後にmarginを加える処理実装予定
         *  -------------------------------------------------------------------------------
         */
        // drag_elm.style.marginLeft = '30px';
        currentTarget.appendChild(drag_elm);// ドロップ先にドラッグされた要素を追加をする
        event.preventDefault();// エラー回避のため、ドロップ処理の最後にdropイベントをキャンセルしておく
    }, 50);
}

/**------------------------------------------------------
 * 配列処理関系
 * ------------------------------------------------------
 */
// div#bottomにドロップされたとき、idを配列に格納する関数
function inputArray(id) {
    var arrayFlg = false;
    for (var i = 0; i < images.length; i++) {
        if (images[i] == id) {
            arrayFlg = true;
        }
    }
    if (arrayFlg == true) {
        outputArray(id);
    }
    images[images.length] = id;
}

// div#bottom から div#upperに戻したときに配列を詰める関数
function outputArray(id) {
    for (var i = 0; i < images.length; i++) {
        if (images[i] == id) {
            for (i; i < images.length; i++) {
                if (i + 1 < images.length) {
                    images[i] = images[i + 1]
                }
            }
        }
    }
    images.pop();
}

// 表示用関数
function imagesLog() {
    for (i = 0; i < images.length; i++) {
        console.log("images配列[" + i + "] : " + images[i]);
    }
}

/**------------------------------------------------------
 * 画像処理関係
 * ------------------------------------------------------
 */
/*
 * if(map[pPositionY][pPositionX + 1] != "*") {
 map[pPositionY][pPositionX] = "0";
 pPositionX += 1;
 map[pPositionY][pPositionX] = "p";// mapデータ上のプレイヤーの位置を移動
 dx = n;
 }else{
 blockFlg = true;
 }
 * */

/**------------------------------------------------------------
 *  画像を動かす処理 引数は(イメージファイル,方向データ,数値)
 * ------------------------------------------------------------
 */
function ImageToCanvas(im, direction, num) {
    dx = 0;
    dy = 0;
    blockFlg = false;
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
            break;
        // case "w":
        //     wAction(data_n);
        //     break;
    }
    dx += old_dx;
    dy += old_dy;
    if (dx < 0) {
        dx = 0;
    } else if (dx > canvas.width - im.width) {
        dx = canvas.width - im.width;
    }
    if (dy < 0) {
        dy = 0;
    } else if (dy > canvas.height - im.height) {
        dy = canvas.height - im.height;
    }

    old_dx = dx;
    old_dy = dy;
    ctx.translate(dx, dy);
    ctx.drawImage(im, 0, 0);
    ctx.translate(-1 * dx, -1 * dy);
}

/**-------------------------------------------------------
 * ドロップされたIMG群を全て元の位置に戻す処理
 * -------------------------------------------------------
 */
function resetImages() {
    var upper_elm = document.getElementById("upper");
    for (var i = 0; i < images.length; i++) {
        var drag_elm = document.getElementById(images[i]);
        upper_elm.appendChild(drag_elm);
    }
    // 配列の長さを0にすることで配列を初期化（全要素を削除）
    images.length = 0;
    console.log("ドロップされた画像、配列を初期化")
}

/**--------------------------------------------------------
 * ドロップされている画像群に従い、一斉に動作
 * --------------------------------------------------------
 */
function action() {
    var id;// ドロップされた画像のidを格納する変数
    var data_d;// 方向
    var data_n;// 移動量
    var drop_elm;// ドロップ済みエレメント

    var cnt = 0;// 無限ループを防ぐための変数cnt
    var i = 0;
    var blockFlg = false;
    action();
    // 全ての画像を順番に動かす。
    function action() {
        // ドロップされている画像群の個数と内容を把握する
        if (i < images.length) {
            id = images[i];
            drop_elm = document.getElementById(id);
            data_d = drop_elm.getAttribute("data-d");// 方向データ
            data_n = drop_elm.getAttribute("data-n");// 移動量
            switch (data_d) {
                case "t":
                    if (map[pPositionY - 1][pPositionX] != "*") {
                        map[pPositionY][pPositionX] = "0";
                        pPositionY -= 1;
                        map[pPositionY][pPositionX] = "p";// mapデータ上のプレイヤーの位置を移動
                    } else {
                        blockFlg = true;
                    }
                    break;
                case "r":
                    if (map[pPositionY][pPositionX + 1] != "*") {
                        map[pPositionY][pPositionX] = "0";
                        pPositionX += 1;
                        map[pPositionY][pPositionX] = "p";// mapデータ上のプレイヤーの位置を移動
                    } else {
                        blockFlg = true;
                    }
                    break;
                case "b":
                    if (map[pPositionY + 1][pPositionX] != "*") {
                        map[pPositionY][pPositionX] = "0";
                        pPositionY += 1;
                        map[pPositionY][pPositionX] = "p";// mapデータ上のプレイヤーの位置を移動
                    } else {
                        blockFlg = true;
                    }
                    break;
                case "l":
                    if (map[pPositionY][pPositionX - 1] != "*") {
                        map[pPositionY][pPositionX] = "0";
                        pPositionX -= 1;
                        map[pPositionY][pPositionX] = "p";// mapデータ上のプレイヤーの位置を移動
                    } else {
                        blockFlg = true;
                    }
                    break;
            }
            cnt = 0;
        }
        console.table(map);
        console.log("");
        //debugData(map);//console.tableかどっちか
        var itc = setInterval(function () {
                if (cnt < moveNum) {
                    if (!blockFlg) {//前に壁が無い場合
                        ImageToCanvas(image1, data_d, data_n);
                    }
                } else {
                    i++;
                    if (i < images.length) {// まだbottomに処理されていない画像が残っている場合
                        blockFlg = false;
                        action();
                    }
                    clearInterval(itc);// images配列内の全ての画像データを処理し終えた場合interval停止
                }
                cnt++;
            },
            10
        );
    }
}

// ２次元配列表示用関数
function debugData(data) {
    if (data == null) {
        debug('データはnullです');
    } else {
        for (var i = 0; i < data.length; i++) {
            var ent = data[i];
            if (ent == null) {
                console.log('エンティティはnull');
            } else {
                msg = ent.join(',');
                console.log(msg + " : " + i + "列目");
            }
        }
    }
}

// // While処理実装
// function wAction() {
//
// }