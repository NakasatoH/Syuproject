/**
 * Created by nakasato on 2016/11/10.
 */

var dx = 0;
var dy = 0;
var old_dx = 0; // canvas内 キャラクターの今までの位置を保持しておくための変数old_...
var old_dy = 0;
var indentPoint = 0;
var hMax = 33;
var wCnt = 0; // エディター内にある終了していないwhileの数を数える変数
var while_x = 0;// 最も後にドロップされたwhileイメージの位置情報
var shadowFlg = 0;// 影の表示に使うフラグ
var checkFlg = 0;// 影を表示後に座標が変更された際その都度一度だけ影を削除し、インデントを調整するための変数
var bottomDiv = document.getElementById('bottom');// ドロップ先Divの位置を把握する必要がある
var rect = bottomDiv.getBoundingClientRect();
var images = [];// ドロップした順にidを保管するための配列
var codeNums = [];// images配列に合わせてコード番号を保管する配列
var bkCodeNums = [];// codeNumsのバックアップ用配列
const moveNum = block_size;
const indent = 84;
const wWidthSize = 142;
const codeSize = 37.5;
const elmAllSize = 37;//36.22;
var goalFlg = false;// ゴールしたときに一度だけメッセージを表示するためのフラグ
var runFlg = false;// プログラム実行中に同時に2回目以降の実行を行わせないためのフラグ
// 影バグ対策　コメント調整
bottomDiv.style.zIndex = 1;

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

// 音声オブジェクト生成
var dragSound = new Audio();
dragSound.src = dragSoundSrc;

/**---------------------------------------------------------------------
 * D＆D関係
 * ----------------------------------------------------------------------
 */
var target_elm;
var target_src;
// ドラッグ開始処理
function f_dragstart(event) {
    event.dataTransfer.setData("text", event.target.id);// ドラッグするデータのid名をDataTransferオブジェクトにセット
    target_elm = event.target;
    // 影として表示する画像を設定　IMGの場合そのまま取得したsrcを設定　DIVの場合予め用意された文字列の影を設定
    if (target_elm.hasAttribute("src")) {
        target_src = target_elm.getAttribute("src");
    } else {
        target_src = ifBreakSrc;
    }
    console.log(target_src);
}

// ドラッグ要素がドロップ要素に重なっている間の処理
function f_dragover(event) {
    var btm_elm = document.getElementById("bottom");
    var side_elm = document.getElementById("sidePoint");
    var id;
    var lastCodeRect;
    var lastCodePosition = 0;// 最後に挿入したコードのy座標 + elmのheight
    var t_wCnt = wCnt;
    x = window.scrollX + event.clientX - rect.left;
    y = window.pageYOffset + event.clientY - rect.top;
    console.log("winSc : " + window.pageYOffset);
    //console.log("y :" + y + " x :" + x);
    if (images[images.length - 1]) {
        lastCodeRect = document.getElementById(images[images.length - 1]).getBoundingClientRect();
        lastCodePosition = lastCodeRect.top - rect.top + lastCodeRect.height;
    }

    /**
     * 処理概要:
     *  ドラッグ中にドラッグエレメントから座標を取得し、
     *  その座標がbottom内に存在する場合 wCnt(終了していないwhileの数) * indent よりも小さい値であるか判定し、
     *  小さいならindentの数を減らし、大きいのなら一つ前のwhile画像からindentを加算した位置にcreateElementでdiv（影）を表示する
     */
    if (!shadowFlg) {
        shadowView();
    } else if (x / indent != indentPoint) {// y / codeSize == lineNumber を追加予定
        deleteShadow();
        shadowView();
    }
    function shadowView() {
        /**
         * 影の各種css情報設定
         */
        bottomDiv.style.backgroundImage = 'url(' + target_src + ')';
        bottomDiv.style.backgroundRepeat = "no-repeat";
        bottomDiv.style.backgroundPositionX = "0";
        bottomDiv.style.backgroundPositionY = hMax + "px";

        if (target_elm.localName === "img") {
            bottomDiv.style.backgroundSize = target_elm.width + "px " + target_elm.height + "px";
        } else {
            bottomDiv.style.backgroundSize = "200px 30px";
        }
        while_x = t_wCnt * indent;


        /** x座標、前回挿入したコード（画像）を確認
         *  前回挿入したコードがwhileの場合backgroundPXの位置を固定で決定
         *  whileではない場合 x座標が indent 何個分かを while(t_wCnt > 0){}の中で求めて　位置調整、indentPointを保存
         */
        if (lastCodePosition = 0 || lastCodePosition < y) {
            if (images[images.length - 1] && document.getElementById(images[images.length - 1]).getAttribute("data-d") == "w") {
                bottomDiv.style.backgroundPositionX = t_wCnt * indent + "px";
                indentPoint = t_wCnt;
            } else {
                while (t_wCnt > 0) {
                    if (x >= 0 && x < t_wCnt * indent) {
                        t_wCnt -= 1;
                    } else {
                        break;
                    }
                }
                // ドラッグ時に移動した際影を動かすために、ポジションを保持する
                indentPoint = t_wCnt;
                bottomDiv.style.backgroundPositionX = t_wCnt * indent + "px";
            }
        } else {
            // プログラムの途中にコードを挿入する場合
            bottomDiv.style.backgroundImage = "none";
            side_elm.style.backgroundImage = "none";
            side_elm.style.backgroundImage = 'url(' + midDropSrc + ')';
            // 最後のコードでサイドバーの目印を停止させる場合
            // side_elm.style.backgroundPositionY = y - 10 + "px";
        }
        shadowFlg = true;
    }

    // 最後のコードでサイドバーの目印を止めない
    side_elm.style.backgroundPositionY = y - 10 + "px";
    // dragoverイベントをキャンセルして、ドロップ先の要素がドロップを受け付けるようにする
    event.preventDefault();
}
// 影を削除したらチェックフラグ()をTrueに 削除していない場合はFalseに
function deleteShadow() {
    if (shadowFlg) {/*
     bottomDiv.style.backgroundImage =  'url(' + target_src + ')';*/
        bottomDiv.style.backgroundImage = 'none';
        shadowFlg = false;
    }
}

/**
 * ドロップ時の処理
 * 概要：
 * @param event
 */
function f_drop(event) {
    var id_name = event.dataTransfer.getData("text");// ドラッグされたデータのid名をDataTransferオブジェクトから取得
    var drag_elm = document.getElementById(id_name);// id名からドラッグされた要素を取得

    var data_d = drag_elm.getAttribute("data-d");// 方向データ
    var data_n = drag_elm.getAttribute("data-n");// 移動量

    var bwFlg = false;// div bottom から bottom へwhile画像を繰り返しドロップすることで起こる不正な挙動を防ぐフラグ

    var x = window.scrollX + event.clientX - rect.left;// ドロップ位置情報

    var y = window.pageYOffset + event.clientY - rect.top;
    x = Math.floor(x);// 四捨五入　整数型にキャスト
    y = Math.floor(y);

    console.log("x : " + x + " y : " + y);
    /**
     * window.setTimeoutは並行処理であるため、currentTarget.appendChild()もpreventDefaultもsetTimeout内に入れる必要がある
     * また、更にその中でもevent.preventDefault()の方が処理順が速いため、currentTargetを見失ってしまう。
     * その対策として、変数に値を代入して保持しておく必要がある。
     */
    var currentTarget = event.currentTarget;// ドロップ先
    deleteShadow();

    // コード画像をドロップしたとき不自然な挙動にならないよう遅延を作る
    window.setTimeout(function () {
        // ドロップ先がエディットボックス(id = "bottom")の場合
        if (currentTarget.id == "bottom") {
            if (drag_elm.parentNode.id == "bottom") {
                bwFlg = true;
                alert("エディターの中からのドラッグアンドドロップは出来ません。")
            }
            if (!bwFlg) {
                inputArray(id_name);// bottomにドロップした画像のIDをimages配列に格納
                imagesCheck();
                // while画像がドロップされた場合 while回数を数える変数 wCnt を加算する
                if (data_d == "w") {
                    wCnt++;
                    var rect = drag_elm.getBoundingClientRect();// 一番最後にドロップしたwhileイメージの座標を保持
                    while_x = Math.floor((wCnt - 1) * indent + wWidthSize);
                }
                dragSound.play();// ドロップ時に効果音を再生
                // currentTarget.appendChild(drag_elm);// ドロップ先にドラッグされた要素を追加をする
            }
            bwFlg = false;
            // while画像よりもx座標が +か -か判定して -の場合 whileのエンドマークをimages配列に挿入する
            /*
             console.log("画像ファイル : " + image1.src + ", 方向 : " + data_d + ", 数値 : " + data_n);
             console.log("ドロップ先     タグ名 : " + currentTarget.tagName + ", ID名 : " + currentTarget.id);
             console.log("追加する要素   タグ名 : " + drag_elm.tagName + ", ID名 : " + drag_elm.id);*/
        }
        //imagesLog();
        event.preventDefault();// エラー回避のため、ドロップ処理の最後にdropイベントをキャンセルしておく
    }, 40);
    checkFlg = false;// 影の上にドラッグしているときのバグを防止するフラグ
    /**------------------------------------------------------
     * 配列処理関系
     * ------------------------------------------------------
     */
    // div#bottomにドロップされたとき、idを配列に格納する関数
    function inputArray(id) {
        var arrayFlg = false;
        var lastCodePosition = 0;
        var lastCodeRect;
        var elmHeight;
        var bkImages = images;
        if (images[images.length - 1]) {
            lastCodeRect = document.getElementById(images[images.length - 1]).getBoundingClientRect();
            lastCodePosition = lastCodeRect.top - rect.top + lastCodeRect.height + window.pageYOffset;
        }

        for (var i = 0; i < images.length; i++) {
            if (images[i] == id) {
                arrayFlg = true;
            }
        }
        if (arrayFlg == true) {
            outputArray(id);// 同じbottomからbottomにD and Dされた場合一度配列を整理してから　配列の最後にidを格納
        }
        //whileイメージよりも左側にドロップした場合 images配列にendWhileを挿入

        /**
         * 処理概要
         * ドロップ時のy座標を判別して、
         * その値に応じてコードを挿入する
         * whileは今回は途中挿入させない
         */
        if (lastCodePosition == 0 || lastCodePosition < y || document.getElementById(id).getAttribute("data-d") == "w") {

            console.log("lastCP : " + lastCodePosition);
            // wCnt = 終了していないwhileの数  , images[images.length -2] が存在する = whileを終了するか選べる状態にある
            if (wCnt > 0 && x <= while_x && images[images.length - 2]) {
                // 一つ前のドロップがwhileの場合繰り返し終了マークを挿入しない
                if (document.getElementById(images[images.length - 1]).getAttribute("data-d") != "w") {
                    whileRect = document.getElementById(images[images.length - 1]).getBoundingClientRect();
                    // エディター上にエンドマークの無いwhileが複数ある場合 ドロップ位置によりエンドマーク挿入量調整
                    while (wCnt > 1 && x <= (wCnt - 1) * indent && x >= 0) {
                        images[images.length] = "endWhile";
                        wCnt -= 1;
                    }
                    wCnt -= 1;
                    images[images.length] = "endWhile";
                }
            }
            if (wCnt >= 0) {
                var l_margin = wCnt * indent;
                drag_elm.style.marginLeft = l_margin + 'px';
            }
            document.getElementById(id).setAttribute("data-m", wCnt);//indent dataを挿入
            console.log("data-m : " + document.getElementById(id).getAttribute("data-m"));
            if (drag_elm.localName === "img") {
                elmHeight = drag_elm.height;
            } else {
                elmHeight = 30;
            }
            hMax = hMax + elmAllSize;

            images[images.length] = id;// idを挿入
            currentTarget.appendChild(document.getElementById(id));// エレメントをbottomに挿入
        } else {// 最初のコード、または最後のコードではない && whileではない
            var initVal = y - 10.6;
            console.log("-------- pointS --------" + initVal);
            if (initVal < 0) {
                // images[0]に挿入
                for (i = images.length - 1; i >= 0; i--) {
                    images[i + 1] = images[i];
                }
                images[0] = id;

                // 再配置
                hMax = 32;
                relocation(0);// upperに戻す処理 引数は最初にupperに戻すimages配列のindex
                for (i = 0; i < images.length; i++) {
                    if (images[i] != "endWhile") {
                        currentTarget.appendChild(document.getElementById(images[i]));
                        if (document.getElementById(images[i]).localName === "img") {
                            elmHeight = drag_elm.height;
                        } else {
                            elmHeight = 25;
                        }
                        hMax = hMax + elmAllSize;
                    }
                }
            } else {// コード間に挿入された場合
                var midWCnt = 0;
                var yPoint = Math.floor(initVal / 37.22);
                // images[yPoint]に挿入

                // endWhile対策
                while (images[yPoint - 1] == "endWhile") {
                    yPoint = yPoint - 1;
                }
                for (i = images.length - 1; i >= yPoint; i--) {
                    images[i + 1] = images[i];
                    if (images[i] != "endWhile") {
                        if (document.getElementById(images[i]).localName === "img") {
                            elmHeight = drag_elm.height;
                        } else {
                            elmHeight = 25;
                        }

                        hMax = hMax - elmAllSize;
                    }
                }
                images[yPoint] = id;

                for (i = 0; i < yPoint; i++) {
                    if (document.getElementById(images[i]).hasAttribute("data-d") &&
                        document.getElementById(images[i]).getAttribute("data-d") == "w") {
                        midWCnt = midWCnt + 1;
                    } else if (images[i] == "endWhile") {
                        midWCnt = midWCnt - 1;
                    }
                }
                relocation(yPoint);
                wCnt = midWCnt;
                /**
                 * 実装予定
                 * ここに　wCntが1以上の場合 x軸ごとに
                 */


                // 再配置
                for (i = yPoint; i < images.length; i++) {
                    if (images[i] != "endWhile") {
                        document.getElementById(images[i]).style.marginLeft = wCnt * indent + "px";
                        currentTarget.appendChild(document.getElementById(images[i]));
                        if (document.getElementById(images[i]).localName === "img") {
                            elmHeight = drag_elm.height;
                        } else {
                            elmHeight = 25;
                        }
                        hMax = hMax + elmAllSize;
                        if (document.getElementById(images[i]).getAttribute("data-d") == "w") {
                            wCnt++;
                            console.log(wCnt);
                        }
                    } else {
                        wCnt--;
                        console.log(wCnt);
                    }
                }
            }

        }
        //途中挿入の場合（while以外）
    }

    // div#bottom から div#upperに戻したときに配列を詰める関数
    function outputArray(id) {
        var e_index;
        for (var i = 0; i < images.length; i++) {
            if (images[i] == id) {
                //取得した画像がwhileなら
                if (document.getElementById(images[i]).getAttribute("data-d") == "w") {
                    for (var j = i + 1; j < images.length; j++) {
                        if (images[j] == "endWhile") {
                            //endWhileの要素番号を保持
                            e_index = j;
                            break;
                        } else {
                            // 既についているインデントを減らす
                            var w_elm = document.getElementById(images[j]);
                            w_elm.style.marginLeft = (wCnt - 1) * indent + "px";
                        }
                    }
                    if (images[e_index]) {
                        images.splice(e_index, 1);// endWhileを削除
                    } else {
                        // endWhileがimages内に存在する場合、wCntを減らしてはいけない
                        wCnt--;
                    }
                    images.splice(i, 1);
                } else {
                    if (images[i - 1]) {
                        if (document.getElementById(images[i - 1]).getAttribute("data-d") == "w") {
                            // iの一つ後が存在していて かつendWhileであるなら
                            if (images[i + 1] && images[i + 1] == "endWhile") {
                                // images[i-1]のエレメント(while画像)をupperに表示
                                currentTarget.appendChild(document.getElementById(images[i - 1]));
                                images.splice(i - 1, 3);
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
                document.getElementById(id).style.marginLeft = 0 + "px";
                // console.log(drag_elm.style.marginLeft);
            }
        }//for (var i = 0; i < image.length; i++) End
    }
}// function f_drop(event) End

// 表示用メソッド
function imagesLog() {
    for (var i = 0; i < images.length; i++) {
        console.log("images配列[" + i + "] : " + images[i]);
    }
}

// 全ての値の初期化は行わずにエレメントだけupperに戻す　再配置用メソッド
function relocation(firstIndex) {
    for (var i = firstIndex; i < images.length; i++) {
        if (document.getElementById(images[i]) != "endWhile") {
            document.getElementById(images[i]).style.marginTop = 0 + "px";
            document.getElementById(images[i]).style.marginLeft = 0 + "px";
            document.getElementById("upper").appendChild(document.getElementById(images[i]));
        }
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
    if (!num) {
        num = 1;
    }
    var n = parseInt(num);
    n = 1;
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
        // 画像に付与された余白を除去,初期化
        drag_elm.style.marginLeft = 0 + "px";
        drag_elm.style.paddingRight = 4 + "px";
        // コードボックス内に移動
        upper_elm.appendChild(drag_elm);
    }
    // 配列の長さを0にすることで配列を初期化（全要素を削除）
    images.length = 0;
    wCnt = 0;
    hMax = 32;
    console.log("ドロップされた画像、配列を初期化")
}

/**
 * 複数回同時実行禁止！
 */
function actionBtnOnClick() {
    var aBtn = document.getElementById("actionBtn");
    if (!runFlg && images.length > 0) {
        action();
    }
}

/**
 * 混乱注意！！
 * resetImages() = div #bottom上すべてのエレメントを#upperに戻す
 * resetImage() = クリックされたエレメントのみ#upperに戻す
 */
window.onload = function () {
    resetImage();
}();

function outputArray2(id) {
    var e_index = 0;
    for (var i = 0; i < images.length; i++) {
        if (images[i] == id) {
            //取得した画像がwhileなら
            if (document.getElementById(images[i]).getAttribute("data-d") == "w") {
                if (document.getElementById(images[i + 1])) {
                    var t_wCnt = 1;
                    while (t_wCnt > 0) {// このwhileの終了ポイントを探す
                        for (var j = i + 1; j < images.length; j++) {
                            if (images[j] == "endWhile") {
                                t_wCnt--;
                            } else if (document.getElementById(images[j]).getAttribute("data-d") == "w") {
                                t_wCnt++;
                            }
                            //while内のコードを全てインデント除去
                            if (document.getElementById(images[j]) != "endWhile") {
                                document.getElementById(images[j]).style.marginLeft = 0 + "px";
                                hMax = hMax - elmAllSize;
                            }
                            // whileの終了地点を発見した場合　終了地点を e_indexに補完
                            if (t_wCnt <= 0) {
                                e_index = j;
                                break;
                            }
                        }
                        // for文終了時、e_index == 0 の場合 e_indexに images.length - 1を代入する
                        if (e_index == 0) {
                            e_index = images.length - 1;
                            wCnt = wCnt - t_wCnt;
                            hMax = hMax - elmAllSize;
                            t_wCnt = 0;
                        }
                    }
                    for (j = i; j < e_index + 1; j++) {
                        if (document.getElementById(images[j]) != "endWhile") {
                            document.getElementById("upper").appendChild(document.getElementById(images[j]));
                        }
                    }
                    images.splice(i, e_index - i + 1);
                } else {//最後に挿入したコードがWhileの場合
                    document.getElementById(images[i]).style.marginTop = 0 + "px";
                    document.getElementById(images[i]).style.marginLeft = 0 + "px";
                    document.getElementById(images[i]).style.paddingRight = 4 + "px";
                    document.getElementById("upper").appendChild(document.getElementById(images[i]));
                    images.splice(i, 1);
                    wCnt = wCnt - 1;
                    hMax = hMax - elmAllSize;
                }
            } else {
                if (images[i - 1]) {
                    if (document.getElementById(images[i - 1]).getAttribute("data-d") == "w") {
                        // iの一つ後ろが存在していて かつWhileであるなら
                        if (images[i + 1] && images[i + 1] == "endWhile") {
                            // images[i-1]のエレメント(while画像)をupperに表示
                            document.getElementById("upper").appendChild(document.getElementById(images[i - 1]));
                            hMax = hMax - elmAllSize * 2;// images配列内のエレメントの合計heightから減算
                            images.splice(i - 1, 3);
                        } else {
                            hMax = hMax - elmAllSize;
                            images.splice(i, 1)
                        }
                    } else if (images[i - 1] == "endWhile" && !images[i + 1]) {
                        //一つ前がendWhile　かつ １つ後が存在しないなら
                        hMax = hMax - elmAllSize;
                        images.splice(i - 1, 2);
                        wCnt++;
                    } else {
                        hMax = hMax - elmAllSize;
                        images.splice(i, 1);
                    }
                } else {
                    hMax = hMax - elmAllSize;
                    images.splice(i, 1);
                }
            }
            document.getElementById(id).style.marginLeft = 0 + "px";
            // console.log(drag_elm.style.marginLeft);
            // インデント更新処理
        }
    }//for (var i = 0; i < image.length; i++) End
}


/**--------------------------------------------------------
 * ドロップされている画像群に従い、一斉に動作
 * --------------------------------------------------------
 */
function action() {
    var blockFlg = false;
    var cnt = 0;
    runFlg = true;// 排他制御にするためのフラグ
    var firstFlg = true;// action()呼び出し時、一度のみの処理に使用
    var id;// ドロップされた画像のidを格納する変数配列に格納
    var wNum = [];// images配列の中でwhileが見つかった場合data_nをwNum配列に格納
    var bkImages = [];// 処理終了後 images配列を元の状態に戻す
    var bkWCnt = 0;// 処理終了後wCnt を元の数に戻す
    var data_d;// 方向
    var old_d = "t";// 保持している過去のdata_d
    var data_n;// 移動量
    var drop_elm;// ドロップ済みエレメント
    var w_elm;// whileデータ持ちエレメント
    var whileIndex = [];// images配列の中でwhileが見つかった場合idをwhileIndex配列に格納

    for (var i = images.length - 1; i > -1; i--) {
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
    // whileを解体して"w"と"e"マークの無い配列を生成、代入
    if (firstFlg) {
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
        console.log(whileIndex[i], whileIndex.length - (whileIndex.length - i), wNum[i], whileIndex.length);
        images = wBreakDown(whileIndex[i], whileIndex.length - (whileIndex.length - i), wNum[i]);
    }
    images = dNumControl(images);
    imagesLog();
    i = 0;// 初期化
    // 内側で宣言したactionを呼び出す
    action2();
    /**
     * action2()メソッド
     * 処理概要：
     *  　　　　進行方向に壁があるか確認
     *          壁がなければ動かす
     *          images配列を動作以前の状態に戻す　（バックアップファイルで上書き）
     *          images配列上にまだ処理し終えていないデータがある場合再帰する。
     *   　　　 全ての画像を順番に動かす。
     */
    function action2() {
        // 移動量データが存在するなら
        console.log("i : " + i);
        id = images[i];
        drop_elm = document.getElementById(id);
        // 実行中コード可視化用関数sidePoint
        sidePoint(i);
        if (drop_elm.hasAttribute("data-n")) {
            // ドロップされている画像群の個数と内容を把握する
            if (i < images.length) {
                // console.log(images.length + "<- 長さ : id ->" + id);
                data_d = drop_elm.getAttribute("data-d");// 方向データ
                // 方向データを取得し、nullである場合事前に設定されていたデータを上書き
                if (data_d) {
                    old_d = data_d;
                } else {
                    data_d = old_d;
                }
                data_n = drop_elm.getAttribute("data-n");// 移動量
                switch (data_d) {
                    case "t":
                        if (map[pPositionY - 1][pPositionX] == "*") {
                            blockFlg = true;
                        } else if (map[pPositionY - 1][pPositionX] == "g") {
                            // ゴール時の処理
                            goalFlg = true;
                        } else {
                            map[pPositionY][pPositionX] = "0";
                            pPositionY -= 1;
                            map[pPositionY][pPositionX] = "p";// mapデータ上のプレイヤーの位置を移動
                        }
                        break;
                    case "r":
                        if (map[pPositionY][pPositionX + 1] == "*") {
                            blockFlg = true;
                        } else if (map[pPositionY][pPositionX + 1] == "g") {
                            goalFlg = true;
                        } else {
                            map[pPositionY][pPositionX] = "0";
                            pPositionX += 1;
                            map[pPositionY][pPositionX] = "p";// mapデータ上のプレイヤーの位置を移動
                        }
                        break;
                    case "b":
                        if (map[pPositionY + 1][pPositionX] == "*") {
                            blockFlg = true;
                        } else if (map[pPositionY + 1][pPositionX] == "g") {
                            goalFlg = true;
                        } else {
                            map[pPositionY][pPositionX] = "0";
                            pPositionY += 1;
                            map[pPositionY][pPositionX] = "p";// mapデータ上のプレイヤーの位置を移動
                        }
                        break;
                    case "l":
                        if (map[pPositionY][pPositionX - 1] == "*") {
                            blockFlg = true;
                        } else if (map[pPositionY][pPositionX - 1] == "g") {
                            goalFlg = true;
                        } else {
                            map[pPositionY][pPositionX] = "0";
                            pPositionX -= 1;
                            map[pPositionY][pPositionX] = "p";// mapデータ上のプレイヤーの位置を移動
                        }
                        break;
                }// switch (data_d) End
            }//if (i < images.length) End

            cnt = 0;// ブロックサイズ回繰り返し1pxずつずらして表示するためのカウント変数

            var itc = setInterval(function () {
                if (cnt < moveNum) {// ブロックサイズ  = moveNUM
                    if (!blockFlg) {//前に壁が無い場合
                        // 第三引数を強制的に 1に変更
                        ImageToCanvas(image1, data_d, data_n);
                    }else{
                        //音でも鳴らす？
                    }
                } else {
                    i++;
                    if (i < images.length) {// まだbottomに処理されていない画像が残っている場合
                        blockFlg = false;
                        action2();// 再帰
                    } else {
                        /**
                         * 原因不明の挙動
                         *  条件: i < images.length の else側にclearInterval()を記述すると移動動作が重複し、不自然な速度の動作になる
                         *
                         *  また、else内ではなく、clearInterval()の上に 配列のバックアップbkImagesをimagesに上書きする処理を書いた場合も
                         *  不自然な動作になる。
                         */
                        /**
                         * Action2();終了地点②
                         * 処理終了後　images配列を画面上の見た目通りに戻す
                         */
                        images = bkImages;
                        codeNums = bkCodeNums;
                        wCnt = bkWCnt;
                        document.getElementById("sidePoint").style.backgroundPositionY = 33;
                        if (goalFlg) {
                            alert("ゴール！");
                        }
                        goalFlg = false;
                        runFlg = false;
                    }
                    clearInterval(itc);// images配列内の全ての画像データを処理し終えた場合interval停止
                    sidePoint(0);
                }
                cnt++;
            }, 10);
        } else {
            // 遅延実行
            (function () {
                setTimeout(function () {
                    // 移動量データが存在しないなら 方向データを保存
                    old_d = drop_elm.getAttribute("data-d");
                    // console.log(old_d);
                    if (i < images.length) {// まだbottomに処理されていない画像が残っている場合
                        blockFlg = false;
                        action2();// 再帰
                    } else {
                        /**
                         * Action2();終了地点②
                         * 処理終了後　images配列を画面上の見た目通りに戻す
                         */
                        images = bkImages;
                        codeNums = bkCodeNums;
                        wCnt = bkWCnt;
                        document.getElementById("sidePoint").style.backgroundPositionY = 33;
                        goalFlg = false;
                        runFlg = false;
                    }
                }, 280);

                i++;
            })();
        }
    }// action2() END

    /*
     * images配列の中に"w"マークを持ったidが発見され、"e"マークを持ったidが無い場合
     * hiddenのデータを呼び出し"e"マークを持ったidを格納する
     * whileの数に対応したendWhileをimages配列の最後に挿入する
     * endWhileの数を数える
     * codeNums配列にコード番号を挿入する
     */
    function firstAction() {
        // 最後に見た目通りの配列に戻すためのバックアップを生成;
        bkImages = images;
        bkWCnt = wCnt;
        var endCnt = 0;
        var codeCnt = 0;
        for (i = 0; i < images.length; i++) {
            if (images[i] == "endWhile") {
                endCnt++;
                codeCnt--;
                codeNums[i] = codeCnt;
            } else {
                codeNums[i] = codeCnt;
            }
            codeCnt++;
        }
        if (wCnt - endCnt > 0) {
            for (i = wCnt; i < endCnt; i++) {
                console.log("wCnt , endCnt; エンドマーク挿入" + wCnt + "" + endCnt);
                images[images.length] = "endWhile";
                codeNums[codeNums.length] = codeNums[codeNums.length - 1];
            }
        }
        firstFlg = false;
        bkCodeNums = codeNums;
    }
}


/**--------------------------------------------------------
 * 繰り返し処理 wBreakDown()
 * --------------------------------------------------------
 * 予備知識、情報
 * images配列にはドロップされた画像の id が入る
 *
 * 処理概要
 *     主な機能：繰り返し処理の調査、分解、結合
 *
 *                               ↓読み込み中
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
    // images配列用
    var cnt = 0;
    var workNum = 0;
    var workNum2 = 0;
    var workArray = [];// 繰り返し処理部分を格納する配列
    var frontIsolateArray = [];// 隔離用配列(前)
    var backIsolateArray = [];// 隔離用配列(後)

    // 可視化用
    var wa2 = [];
    var fia2 = [];
    var bia2 = [];

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
            wa2[workNum] = codeNums[i];// images配列と同様にコード番号を挿入
            //console.log(workArray[workNum] + " : workArray[" + workNum + "]");
            workNum++;// workArrayの要素番号を進める
        }
    }

    // "w"マークより前のデータをfrontIsolateArrayに格納
    for (i = index - 1; i > -1; i--) {
        frontIsolateArray[i] = images[i];
        fia2[i] = codeNums[i];
        //console.log("frontIsolateArray[" + frontIsolateArray[i] + "]")
    }

    // "e"マーク以降のデータをbackIsolateArrayに格納
    if (images[index + workNum + 2]) {
        for (i = index + workNum + 2; i < images.length; i++) {// index + workNum + 1 は多分 "e"の次の要素番号
            backIsolateArray[workNum2] = images[i];
            bia2[workNum2] = codeNums[i];
            console.log(backIsolateArray[workNum2]);
            workNum2++;
        }
    }
    // frontIsolateArray配列に images配列内の"w"から"e"マークまでのデータ(workArray)を"w"のdata_n回繰り返し追加する
    for (var j = 0; j < wNum; j++) {
        for (var k = 0; k < workArray.length; k++) {
            frontIsolateArray[index + cnt] = workArray[k];
            fia2[index + cnt] = wa2[k];
            cnt++;
        }
    }
    // frontIsolateArray配列とbackIsolateArray配列を結合
    for (i = 0; i < backIsolateArray.length; i++) {
        frontIsolateArray[index + cnt + i] = backIsolateArray[i];
        fia2[index + cnt + i] = bia2[i];
        console.log("frondIso :" + frontIsolateArray[index + cnt + i]);
    }
    codeNums = fia2;
    return frontIsolateArray;
}
/**
 * dNumControl()
 * 処理概要：wBreakDownで解体されたwhileが格納されたimages配列内のdata-nに合わせて
 * images配列を拡張
 */
function dNumControl(array) {
    var num = 0;
    var workArray = [];
    for (var i = 0; i < array.length; i++) {
        if (document.getElementById(array[i]).hasAttribute("data-n")) {
            num = document.getElementById(array[i]).getAttribute("data-n");
            for (var j = 0; j < num; j++) {
                workArray[workArray.length] = array[i];
            }
        } else {
            workArray[workArray.length] = array[i];
        }
    }
    return workArray;
}

function debug() {
    console.table(map);
    console.log("wCnt:" + wCnt);
    for (var i = 0; i < images.length; i++) {
        console.log("images[" + i + "] : " + images[i]);
    }
    console.log("backgroundPositionY: " + bottomDiv.style.backgroundPositionY);
    console.log("hMax : " + hMax);
    for (i = 0; i < codeNums.length; i++) {
        console.log("codeNums[" + i + "] : " + codeNums[i]);
    }
    console.log("PositionY : " + bottomDiv.style.backgroundPositionY);
}

/**
 * 疑似プログラム実行中にリアルタイムでどのコードを実行しているか認識できるようにするための
 * 背景画像の位置を変更するメソッド
 * 処理概要：
 *              DIV sidePoint の背景画像の位置調整、及び表示
 *
 *              Action() , Action2() wBreakDown() メソッド内で同時に別の配列に、プログラムのコード番号を挿入
 *              以下のメソッドでは挿入済み配列の値に合わせて背景画像のPositionYを調整する
 */
function sidePoint(index) {
    var sideElm = document.getElementById("sidePoint");
    sideElm.style.backgroundPositionY = 33 + codeNums[index] * codeSize + "px";
}

/**
 * images配列にundefindが意図せず挿入されてしまう不具合の対策
 */
function imagesCheck() {
    var workArray = [];
    for (var i = 0; i < images.length; i++) {
        if (images[i] != undefined) {
            workArray[workArray.length] = images[i];
        }
    }
    images = workArray;
}
