/**
 * Created by nakasato on 2016/11/10.
 */

var dx = 0;
var dy = 0;
var old_dx = 0; // canvas内 キャラクターの今までの位置を保持しておくための変数old_...
var old_dy = 0;
var indentPoint = 0;
var hMax = 32;
var wCnt = 0; // エディター内にある終了していないwhileの数を数える変数
var while_x = 0;// 最も後にドロップされたwhileイメージの位置情報
var shadowFlg = 0;// 影の表示に使うフラグ
var checkFlg = 0;// 影を表示後に座標が変更された際その都度一度だけ影を削除し、インデントを調整するための変数
var bottomDiv = document.getElementById('bottom');// ドロップ先Divの位置を把握する必要がある
var rect = bottomDiv.getBoundingClientRect();
var images = [];// ドロップした順にidを保管するための配列
const moveNum = block_size;
const indent = 83;
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
        case 6:
            this.image1.src = ebataSrc;
            break;
    }
}

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
    if (target_elm.getAttribute("src")) {
        target_src = target_elm.getAttribute("src");
    }else{
        target_src = ifBreakSrc;
    }
    console.log(target_src);
}

// ドラッグ要素がドロップ要素に重なっている間の処理
function f_dragover(event) {
    var btm_elm = document.getElementById("bottom");
    var id;
    var t_wCnt = wCnt;
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
    /**
     * 処理概要:
     *  ドラッグ中にドラッグエレメントから座標を取得し、
     *  その座標がbottom内に存在する場合 wCnt(終了していないwhileの数) * indent よりも小さい値であるか判定し、
     *  小さいならindentの数を減らし、大きいのなら一つ前のwhile画像からindentを加算した位置にcreateElementでdiv（影）を表示する
     */
    if (!shadowFlg) {
        shadowView();
    } else if (x / indent != indentPoint) {
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
            while_x = Math.floor((t_wCnt - 1) * indent + target_elm.width);
        } else {
            bottomDiv.style.backgroundSize = "200px 30px";
            while_x = Math.floor((t_wCnt - 1) * indent + 200);
        }

        // x座標、前回挿入したコードを確認
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
        shadowFlg = true;

    }

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

// ドロップ時の処理
function f_drop(event) {
    var id_name = event.dataTransfer.getData("text");// ドラッグされたデータのid名をDataTransferオブジェクトから取得
    var drag_elm = document.getElementById(id_name);// id名からドラッグされた要素を取得

    var data_d = drag_elm.getAttribute("data-d");// 方向データ
    var data_n = drag_elm.getAttribute("data-n");// 移動量

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

    var currentTarget = event.currentTarget;// ドロップ先
    deleteShadow();
    // コード画像をドロップしたとき不自然な挙動にならないよう遅延を作る
    window.setTimeout(function () {
        // ドロップ先がエディットボックス(id = "bottom")の場合
        if (currentTarget.id == "bottom") {
            for (var i = 1; i < images.length; i++) {
                // bottomからbottomへドロップした場合処理を実行しない
                if (images[i] == drag_elm.id) {
                    bwFlg = true;
                }
            }
            if (!bwFlg) {
                inputArray(id_name);// bottomにドロップした画像のIDをimages配列に格納
                // while画像がドロップされた場合 while回数を数える変数 wCnt を加算する
                if (data_d == "w") {
                    wCnt++;
                    var rect = drag_elm.getBoundingClientRect();// 一番最後にドロップしたwhileイメージの座標を保持
                    while_x = Math.floor((wCnt - 1) * indent + drag_elm.width);
                    wWidthSize = drag_elm.width;
                }
                dragSound.play();// ドロップ時に効果音を再生
                currentTarget.appendChild(drag_elm);// ドロップ先にドラッグされた要素を追加をする
            }
            bwFlg = false;
            // while画像よりもx座標が +か -か判定して -の場合 whileのエンドマークをimages配列に挿入する
            console.log("画像ファイル : " + image1.src + ", 方向 : " + data_d + ", 数値 : " + data_n);
            console.log("ドロップ先     タグ名 : " + currentTarget.tagName + ", ID名 : " + currentTarget.id);
            console.log("追加する要素   タグ名 : " + drag_elm.tagName + ", ID名 : " + drag_elm.id);
            // ドロップ先がコードボックス(id = "upper")の場合
        }
        /* else if (currentTarget.id == "upper") {
         outputArray(id_name);// 画像を元のボックスに戻した場合、配列をソートして詰める
         currentTarget.appendChild(drag_elm);// ドロップ先にドラッグされた要素を追加をする
         }*/
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
        for (var i = 0; i < images.length; i++) {
            if (images[i] == id) {
                arrayFlg = true;
            }
        }
        if (arrayFlg == true) {
            outputArray(id);// 同じbottomからbottomにD and Dされた場合一度配列を整理してから　配列の最後にidを格納
        }
        //whileイメージよりも左側にドロップした場合
        console.log(while_x);
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
                console.log("エンドマーク挿入2");
                images[images.length] = "endWhile";
            }
        }
        console.log("wCnt" + wCnt);

        if (wCnt >= 0) {
            var l_margin = wCnt * indent;
            drag_elm.style.marginLeft = l_margin + 'px';
        }
        document.getElementById(id).setAttribute("data-m", wCnt);//indent dataを挿入

        var elmHeight;
        if(drag_elm.localName === "img"){
            elmHeight = drag_elm.height;
        }else{
            elmHeight = 30;
        }
        hMax = hMax + elmHeight + 2;
        images[images.length] = id;// idを挿入
        console.log("data-m : " + document.getElementById(id).getAttribute("data-m"));
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
    hMax = 32;
    console.log("ドロップされた画像、配列を初期化")
}

/**
 * window.onload
 * エディター上の画像がクリックされた場合コードボックスに画像を戻す
 *
 */
window.onload = function () {
    resetImage();
    actionBtnOnClick();
};
// 未実装！！
function actionBtnOnClick() {
    var aBtn = document.getElementById("actionBtn");
    aBtn.addEventListener("click", function () {
        if (!runFlg && images.length > 0) {
            action();
        }
    })
}

/**
 * 混乱注意！！
 * resetImages() = div #bottom上すべてのエレメントを#upperに戻す
 * resetImage() = クリックされたエレメントのみ#upperに戻す
 */
function resetImage() {
    var upper_elm = document.getElementById("upper");
    var bottom_elm = document.getElementById("bottom");
    bottom_elm.addEventListener("click", function (e) {
        var target = e.target;
        console.log(target.localName);
        if (target.localName !== ("img") && target.className != ("div"))
            return;
        outputArray2(target.id);
        upper_elm.appendChild(target);
    })
}


function outputArray2(id) {
    var e_index;
    for (var i = 0; i < images.length; i++) {
        if (images[i] == id) {

            //取得した画像がwhileなら
            if (document.getElementById(images[i]).getAttribute("data-d") == "w") {
                for (var j = i; j < images.length; j++) {
                    if (images[j] == "endWhile") {
                        //endWhileの要素番号を保持
                        e_index = j;
                        break;
                    } else {
                        // 既についているインデントを減らす
                        var w_elm = document.getElementById(images[j]);
                        w_elm.style.marginLeft = (w_elm.getAttribute("data-m") - 1) * indent + "px";
                        console.log("wCnt: " + wCnt + " indent: " + indent);
                    }
                }
                if (images[e_index]) {
                    images.splice(e_index, 1);// endWhileを削除
                    if (images[e_index]) {
                        var workArray = [];
                        for (var k = images.length - 1; k > e_index; k--) {
                            // 未実装

                        }
                        for (k = e_index; k < images.length; k++) {
                            w_elm = document.getElementById(images[k]);
                            if (w_elm.getAttribute("data-m") > 0) {
                                w_elm.style.marginLeft = (w_elm.getAttribute("data-m") - 1) * indent + "px";
                            }
                        }
                    }
                } else {
                    // endWhileがimages内に存在する場合、wCntを減らしてはいけない
                    wCnt--;
                }
                hMax = hMax - document.getElementById(images[i]).height - 2;
                images.splice(i, 1);
                console.log(wCnt);

                // 選択したコードがwhileではない場合
            } else {
                if (images[i - 1]) {
                    if (document.getElementById(images[i - 1]).getAttribute("data-d") == "w") {
                        // iの一つ後が存在していて かつWhileであるなら
                        if (images[i + 1] && images[i + 1] == "endWhile") {
                            // images[i-1]のエレメント(while画像)をupperに表示
                            document.getElementById("upper").appendChild(document.getElementById(images[i - 1]));
                            hMax = hMax - (document.getElementById(images[i - 1]).height + document.getElementById(images[i]).height + 4);// images配列内のエレメントの合計heightから減算
                            images.splice(i - 1, 3);
                        } else {
                            console.log("ここ１" + hMax + "documentByIDImage[i].height : " + document.getElementById(images[i]).height);
                            hMax = hMax - document.getElementById(images[i]).height - 2;
                            console.log("ここ２" + hMax);
                            images.splice(i, 1)
                        }
                        console.log("前がwhile後がendWhile インデントは " + indent + " : wcnt : " + wCnt);
                    } else if (images[i - 1] == "endWhile" && !images[i + 1]) {
                        //一つ前がendWhile　かつ １つ後が存在しないなら
                        hMax = hMax - document.getElementById(images[i]).height - 2;
                        images.splice(i - 1, 2);
                        wCnt++;
                    } else {
                        hMax = hMax - document.getElementById(images[i]).height - 2;
                        images.splice(i, 1);
                    }
                } else {
                    hMax = hMax - document.getElementById(images[i]).height - 2;
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

    // 最後に見た目通りの配列に戻すためのバックアップを生成;
    bkImages = images;
    bkWCnt = wCnt;
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
        images = wBreakDown(whileIndex[i], whileIndex.length - (whileIndex.length - i), wNum[i], whileIndex.length);
    }

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
     *
     *
     */
    function action2() {
        //console.log("----------SecondAction--------------");
        // ドロップされている画像群の個数と内容を把握する
        if (i < images.length) {
            id = images[i];
            drop_elm = document.getElementById(id);
            //console.log(images.length + "<- 長さ : id ->" + id);
            data_d = drop_elm.getAttribute("data-d");// 方向データ
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
                    action2();// 再帰
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
                    wCnt = bkWCnt;
                    if (goalFlg) {
                        alert("ゴール！！１１！！！！１！！");
                    }
                    goalFlg = false;
                    runFlg = false;
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
    function firstAction() {
        var endCnt = 0;
        for (i = 0; i < images.length; i++) {
            if (images[i] == "endWhile") {
                endCnt++;
            }
        }
        if (wCnt - endCnt > 0) {
            for (i = wCnt; i < endCnt; i++) {
                console.log("wCnt , endCnt; エンドマーク挿入" + wCnt + "" + endCnt);
                images[images.length] = "endWhile";
            }
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
function debug() {
    console.table(map);
    console.log("wCnt:" + wCnt);
    for (var i = 0; i < images.length; i++) {
        console.log("images[" + i + "] : " + images[i]);
    }
    console.log("backgroundPositionY: " + bottomDiv.style.backgroundPositionY);
    console.log("hMax : " + hMax);
}