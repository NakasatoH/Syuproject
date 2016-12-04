/**
 * Created by nakasato on 2016/11/10.
 */

var dx = 0;
var dy = 0;
var old_dx = 0; // 今までの位置を保持しておくための変数old_...
var old_dy = 0;
var wCnt = 0; // 疑似プログラム内にある終了していないwhileの数を数える変数
var while_x = 0;// 最も後にドロップされたwhileイメージの位置情報
var while_y = 0;

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
        case 4:
            this.image1.src = tyagumaSrc;
            break;
        case 5:
            this.image1.src = sunagauoSrc;
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

    var bottomDiv = document.getElementById('bottom');// ドロップ先Divの位置を把握する必要がある
    var rect = bottomDiv.getBoundingClientRect();
    var btmX = rect.left;// ドロップ先boxのx座標を保持
    var bwFlg = false;// div bottom から bottom へwhile画像を繰り返しドロップすることで起こる不正な挙動を防ぐフラグ

    var x = event.clientX - rect.left;// ドロップ位置情報
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

        // ドロップ先がエディットボックス(id = "bottom")の場合

        if (currentTarget.id == "bottom") {
            for (var i = 1; i < images.length; i++) {
                if (images[i] == drag_elm.id) {
                    bwFlg = true;
                }
            }
            if (!bwFlg) {
                inputArray(id_name);// 全ての画像をもとのボックスに戻すため配列の中に入れる処理を追加
            }
            bwFlg = false;
            // while画像よりもx座標が +か -か判定して -の場合 whileのエンドマークをimages配列に挿入する
            console.log("画像ファイル : " + image1.src + ", 方向 : " + data_d + ", 数値 : " + data_n);
            console.log("ドロップ先     タグ名 : " + currentTarget.tagName + ", ID名 : " + currentTarget.id);
            console.log("追加する要素   タグ名 : " + drag_elm.tagName + ", ID名 : " + drag_elm.id);

            // キャンバス内の画像を動かす処理
            /*var cnt = 0;// 無限ループを防ぐための変数cnt
             var imageMoveInterval = setInterval(function () {// setIntervalは引数を与える場合, 無名関数  →　function(){関数名(引数1,引数2,...)}　を使用しなければならない
             if (cnt >= moveNum) {// if文を使用しないとループし続ける 移動px回ループする
             clearInterval(imageMoveInterval);
             }
             cnt++;
             ImageToCanvas(image1, data_d, data_n)// 現在は画像をドロップしただけで画像が動く必要が無いのでコメントアウト
             }, 10);*/

            // ドロップ先がコードボックス(id = "upper")の場合
        } else if (currentTarget.id == "upper") {
            outputArray(id_name);// 画像を元のボックスに戻した場合、配列をソートして詰める
        }
        currentTarget.appendChild(drag_elm);// ドロップ先にドラッグされた要素を追加をする


        // while画像がドロップされた場合 while回数を数える変数 wCnt を加算する
        if (currentTarget.id == "bottom" && data_d == "w") {
            wCnt++;
            var rect = drag_elm.getBoundingClientRect();// 一番最後にドロップしたwhileイメージの座標を保持
            while_x = Math.floor(rect.left + image1.width - btmX);
            console.log("x : " + while_x);
        }
        //imagesLog();
        event.preventDefault();// エラー回避のため、ドロップ処理の最後にdropイベントをキャンセルしておく
    }, 50);

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
            outputArray(id);// 同じbottomからbottomにD and Dされた場合一度配列を整理してから　配列の最後にidを格納
        }
        //whileイメージよりも左側にドロップした場合
        if (wCnt > 0 && while_x >= x) {
            wCnt -= 1;
            images[images.length] = "endWhile";
        }
        if (wCnt > 0) {
            var l_margin = wCnt * 32;
            drag_elm.style.marginLeft = l_margin + 'px';
        }
        images[images.length] = id;
    }

    // div#bottom から div#upperに戻したときに配列を詰める関数
    function outputArray(id) {
        var e_index;
        for (var i = 0; i < images.length; i++) {
            if (images[i] == id) {
                //取得した画像がwhileなら
                if (document.getElementById(images[i]).getAttribute("data-d") == "w") {
                    for (var j = i + 1; j < images.length; j++) {
                        if (images[j] != "endWhile") {
                            //endWhileの要素番号を保持
                            e_index = j;
                            break;
                        } else {
                            // 既についているインデントを減らす
                            var w_elm = document.getElementById(images[j]);
                            w_elm.style.marginLeft -= 32;
                        }
                    }
                    if (images[e_index]) {
                        images.splice(e_index, 1);// endWhileを削除
                    }
                    images.splice(i, 1);
                    wCnt--;
                } else {
                    if (images[i - 1]) {
                        if (document.getElementById(images[i - 1]).getAttribute("data-d") == "w") {
                            // iの一つ後が存在していて かつendWhileであるなら
                            if (images[i + 1] && images[i + 1] == "endWhile") {
                                // images[i-1]のエレメント(while画像)をupperに表示
                                currentTarget.appendChild(document.getElementById(images[i - 1]));
                                images.splice(i - 1, 3);
                                wCnt--;
                            } else {
                                images.splice(i, 1)
                            }
                        } else if (images[i - 1] == "endWhile" && !images[i + 1]) {
                            //一つ前がendWhile　かつ １つ後が存在しないなら
                            images.splice(i - 1, 2);
                            wCnt++;
                        } else {
                            images.splice(i, 1);
                        }
                    } else {
                        images.splice(i, 1);
                    }
                }
                drag_elm.style.marginLeft = 0 + "px";
               // console.log(drag_elm.style.marginLeft);
            }
        }//for (var i = 0; i < image.length; i++) End
    }

    /*function outputArray(id) {
     for (var i = 0; i < images.length; i++) {
     if (images[i] == id) {
     // whileが始まっていて終わっていない場合
     if (wCnt > 0) {
     // images[i]の２つ後に要素が存在する場合
     if (images[i + 2]) {
     // images[i]の１つ前に while画像がある　かつ　一つ後がエンドマークなら
     var left_elm = document.getElementById(images[i - 1]);
     var d = left_elm.getAttribute("data-d");
     if(d == "w" && images[i + 1] == "endWhile"){
     currentTarget.appendChild(left_elm);// ドロップ先にドラッグされた要素を追加をする
     images.splice(i - 1, 3);// "w" ドロップした要素、エンドマークすべて削除
     }else{
     images.splice(i,1);
     }
     } else {
     //２つとなりに要素が存在しない場合 ドロップしたidとエンドマークを削除
     if (images[i + 1]) {
     if (images[i + 1] = "endWhile") {
     wCnt ++;
     images.splice(i,2);
     }else{
     images.pop();
     }
     }
     }
     } else {
     // i番目から1つ要素を削除
     images.splice(i,1);
     }
     }
     }
     }*/


}// function f_drop(event) End

// 表示用関数
function imagesLog() {
    for (var i = 0; i < images.length; i++) {
        console.log("images配列[" + i + "] : " + images[i]);
    }
}
/**------------------------------------------------------
 * 画像処理関係
 *
 *    画像を動かす処理 引数は(イメージファイル,方向データ,数値)
 * ------------------------------------------------------------
 */
function ImageToCanvas(im, direction, num) {
    dx = 0;
    dy = 0;
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
        // 画像に付与された余白を除去
        drag_elm.style.marginLeft = 0 + "px";
        // コードボックス内に移動
        upper_elm.appendChild(drag_elm);
    }
    // 配列の長さを0にすることで配列を初期化（全要素を削除）
    images.length = 0;
    wCnt = 0;
    console.log("ドロップされた画像、配列を初期化")
}

/**--------------------------------------------------------
 * ドロップされている画像群に従い、一斉に動作
 * --------------------------------------------------------
 */


function action() {
    var firstFlg = true;// action()呼び出し時、一度のみの処理に使用
    var id;// ドロップされた画像のidを格納する変数
    var data_d;// 方向
    var data_n;// 移動量
    var drop_elm;// ドロップ済みエレメント
    var w_elm;// whileデータ持ちエレメント
    var cnt = 0;// 無限ループを防ぐための変数cnt この変数は再利用有り
    var i = 0;
    var blockFlg = false;
    var whileIndex = [];// images配列の中でwhileが見つかった場合idをwhileIndex配列に格納
    var wNum = [];// images配列の中でwhileが見つかった場合data_nをwNum配列に格納
    var bkImages = [];// 処理終了後 images配列を元の状態に戻す


    for (i = images.length - 1; i > -1; i--) {
        // 抽出したデータが"w"ならば
        if (document.getElementById(images[i]).getAttribute("data-d") == "w") {
            whileIndex[cnt] = i;
            w_elm = document.getElementById(images[whileIndex[cnt]]);
            //console.log(images.length + "<- 長さ : id ->" + whileIndex[cnt]);
            data_n = w_elm.getAttribute("data-n");
            wNum[cnt] = data_n;// 繰り返し画像がドロップされている場合 繰り返し回数data_nを変数wNumに保持
            cnt++;// whileマークの数を数える変数cnt この変数は再利用有り
            //console.log("data-d : w 検出 : while開始");
        }
    }

    // 最後に見た目通りの配列に戻すためのバックアップを生成;
    bkImages = images;
    // whileを解体して"w"と"e"マークの無い配列を生成、代入
    if(firstFlg) {
        firstAction();
    }
    for (i = 0; i < whileIndex.length; i++) {
        /**
         * 引数説明：　
         *       引数１＝ while画像の要素番号を格納した配列のi番目
         *       引数２は images配列のより後ろにあるwhileから見ていくため、今見ているWhileよりも後ろの位置にあるwhileの数を送る  例： w1 w2 w3 で　w2を解体している場合 whileは w3 一個のため 引数2 = 1になる
         *       引数３は引数１に対応したwhileのエレメントが持つ繰り返し回数のデータ
         */
        // whileマークが検出された場合配列を解体し、作り直す
        images = wBreakDown(whileIndex[i], whileIndex.length - (whileIndex.length - i), wNum[i], whileIndex.length);
    }
    imagesLog();
    i = 0;// 初期化
    // 内側で宣言したactionを呼び出す
    action2();
    // 全ての画像を順番に動かす。
    function action2() {
        //console.log("----------SecondAction--------------");
        // ドロップされている画像群の個数と内容を把握する
        if (i < images.length) {
            id = images[i];
            drop_elm = document.getElementById(id);
            //console.log(images.length + "<- 長さ : id ->" + id);
            // 表示用　削除項目
            for (var z = 0; z < images.length; z++) {
                //console.log("images[" + z + "]" + images[z]);
            }
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
            }// switch (data_d) End
        }//if (i < images.length) End

        // Console上で2次元配列を表示　※デベロッパーツールのサイズが小さいとテーブルの中身が上手く表示されない場合がある
        //console.table(map);
        //console.log("");
        cnt = 0;// ブロックサイズ回繰り返し1pxずつずらして表示するためのカウント変数
        var itc = setInterval(function () {
            if (cnt < moveNum) {
                if (!blockFlg) {//前に壁が無い場合
                    ImageToCanvas(image1, data_d, data_n);
                }
            } else {
                i++;
                if (i < images.length) {// まだbottomに処理されていない画像が残っている場合
                    blockFlg = false;
                    action2();
                } else {
                    /**
                     * 原因不明の挙動
                     *  条件: i < images.length の else側にclearInterval()を記述すると移動動作が重複し、不自然な速度の動作になる
                     *
                     *  また、else内ではなく、clearInterval()の上に 配列のバックアップbkImagesをimagesに上書きする処理を書いた場合も
                     *  不自然な動作になる。
                     */
                    // 処理終了後　images配列を画面上の見た目通りに戻す
                    images = bkImages;
                }
                clearInterval(itc);// images配列内の全ての画像データを処理し終えた場合interval停止

            }
            cnt++;
        }, 10);
    }
        /*
     * images配列の中に"w"マークを持ったidが発見され、"e"マークを持ったidが無い場合
     * hiddenのデータを呼び出し"e"マークを持ったidを格納する
     * whileの数に対応したendWhileをimages配列の最後に挿入する
     * endWhileの数を数える
     */

    function firstAction(){
        var endCnt = 0;
        for (i = 0; i < images.length; i++) {
            if (images[i] == "endWhile") {
                endCnt++;
            }
        }
        for (i = 0; i < endCnt; i++) {
            images[images.length] = "endWhile";
        }
        imagesLog();
        firstFlg = false;
    }
}

/**--------------------------------------------------------
 * 繰り返し処理 wBreakDown()
 * --------------------------------------------------------
 * 予備知識、情報
 * images配列にはドロップされた画像の id が入る
 *
 * 処理概要                      ↓読み込み中
 *   イメージ : images [0]:"t"1 [1]"w"2 [2]"l"1 [3]"t"1 [4]"e"0 [5]"r"1
 *                               ↓処理開始
 *     処理後 →images [0]:"t"1 [1]"l"1 [2]"t"1 [3]"l"1 [4]"t"1 [5]"r"1
 *
 *     workArray = [0]"l"1 [1]"t"1 繰り返される部分
 *     frontIsolateArray = [0]"t"1 配列の前部分　　   =>  結合
 *     backIsolateArray = [0]"r"1　配列の後部分
 *
 * 処理手順
 *   images配列内の"w"マークの数を数え、その数と同じ数の"e"マークが検出されない場合、足りない数分 images配列に"e"マークを追加する
 *   images配列内の"w"マークから"e"マークまでの間にあるデータ（繰返される処理）をworkArrayに格納する <- 改良
 *                    改良内容：
 *                           抽出した"w"マークから最初に発見した"e"マークまでに他の"w"マークが複数確認できた場合
 *                           発見した"w"マークの数だけ"e"マークをスルーする
 *
 *   images配列内の"w"マーク以前のデータをfrontIsolateArrayに格納する
 *   images配列内の読み込んだ"w"マークの次にある"e"マークより後の処理をbackIsolateArrayに格納する
 *   frontIsolateArray配列に images配列内の"w"から"e"マークまでのデータ(workArray)を"w"のdata_n回繰り返し追加する
 *   frontIsolateArray配列にbackIsolateArrayを結合する
 *   初期化したimages配列に 結合済みfrontIsolateArrayを代入する
 */
function wBreakDown(index, wIdx, wNum) {
    var cnt = 0;
    var workNum = 0;
    var workNum2 = 0;
    var workArray = [];// 繰り返し処理部分を格納する配列
    var frontIsolateArray = [];// 隔離用配列(前)
    var backIsolateArray = [];// 隔離用配列(後)
    // 繰り返される処理をworkArray配列に格納
    for (var i = index + 1; i < images.length; i++) {
        if (images[i] == "endWhile") {
            //console.log("i break: " + i);
            wIdx--;
            if (wIdx < 1) {
                break;
            }
        } else {
            //console.log("i : " + i);
            workArray[workNum] = images[i];// images配列の要素を格納
            //console.log(workArray[workNum] + " : workArray[" + workNum + "]");
            workNum++;// workArrayの要素番号を進める
        }
    }

    // "w"マークより前のデータをfrontIsolateArrayに格納
    for (i = index - 1; i > -1; i--) {
        frontIsolateArray[i] = images[i];
        //console.log("frontIsolateArray[" + frontIsolateArray[i] + "]")
    }

    // "e"マーク以降のデータをbackIsolateArrayに格納
    if (images[index + workNum + 2]) {
        console.log("くまくまぽいんと" + images[index + workNum + 2]);
        for (i = index + workNum + 2; i < images.length; i++) {// index + workNum + 1 は多分 "e"の次の要素番号
            backIsolateArray[workNum2] = images[i];
            console.log(backIsolateArray[workNum2]);
            workNum2++;
        }
    }
    // frontIsolateArray配列に images配列内の"w"から"e"マークまでのデータ(workArray)を"w"のdata_n回繰り返し追加する
    for (var j = 0; j < wNum; j++) {
        for (var k = 0; k < workArray.length; k++) {
            frontIsolateArray[index + cnt] = workArray[k];
            cnt++;
        }
    }
    // frontIsolateArray配列とbackIsolateArray配列を結合
    for (i = 0; i < backIsolateArray.length; i++) {
        frontIsolateArray[index + cnt + i] = backIsolateArray[i];
        console.log(frontIsolateArray[index + cnt + i]);
    }

    // images配列中身確認
    //console.log("-------------");
    for (var x = 0; x < images.length; x++) {
        console.log(x + "images[" + x + "] : " + images[x]);
    }
    return frontIsolateArray;
}