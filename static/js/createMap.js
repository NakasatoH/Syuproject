/**
 * Created by varuma on 2017/02/02.
 */
// map初期化
mapData = [
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]
];

// html取得
var root = document.documentElement;

// 各Canvasをインスタンス化, コンテキストを取得
var cBackCvs = document.getElementById("backCreateCvs");
var c_bk_ctx = cBackCvs.getContext('2d');
var cCvs = document.getElementById("createCvs");
var c_ctx = cCvs.getContext('2d');
var cMiddleCvs = document.getElementById("middleCreateCvs");
var c_mid_ctx = cMiddleCvs.getContext('2d');

// 各ボタンをインスタンス化
var blockBtn = document.getElementById("blockBtn");
var characterBtn = document.getElementById("characterBtn");
var goalBtn = document.getElementById("goalBtn");
var submitBtn = document.getElementById("submitBtn");
var deleteBtn = document.getElementById("deleteBtn");

// 一度だけ描画するためのフラグ
var charBlockFlg = false;
var goalBlockFlg = false;

// 現在のdrawItemImageを指定する変数
var select_i = 0;

// 前回のカーソルのポジションを保存するための変数
var c_old_x = undefined;
var c_old_y = undefined;

// mapData用　x, yそれぞれ 40分の1
var map_x = 0;
var map_y = 0;

// キャンバスの位置情報を取得
var rect = cCvs.getBoundingClientRect();

// 背景用イメージの作成
var c_haikei_img = new Image();
var block_img = new Image();// ブロックイメージ作成
var c_select_img = new Image();

// イメージファイルのソースを代入
c_haikei_img.src = cBGImageSrc + "?" + new Date().getTime();
block_img.src = block_bSrc + "?" + new Date().getTime();
c_select_img.src = c_selectSrc + "?" + new Date().getTime();

// 画像が読み込まれたときに背景画像に描画
c_haikei_img.onload = (function () {
    c_bk_ctx.drawImage(c_haikei_img, 0, 0);
});


var drawItemImage = [];

// 描画するブロック画像を配列で管理
drawItemImage[0] = new Image();
drawItemImage[0].src = block_bSrc + "?" + new Date().getTime();
drawItemImage[1] = new Image();
drawItemImage[1].src = akitoSrc + "?" + new Date().getTime();
drawItemImage[2] = new Image();
drawItemImage[2].src = goalSrc + "?" + new Date().getTime();


// ------------------------------------------------------------
// マウスボタンの入力状態を調べるコンストラクタ
// ------------------------------------------------------------
function InputMouseButton(window_obj) {

    // ------------------------------------------------------------
    // 初期化
    // ------------------------------------------------------------
    var self = this;
    var document_obj = window_obj.document;
    var mouse_handler;
    var blur_handler;
    var button_tbl = [0, 2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    var event_type_down = {"mousedown": true, "dragstart": true};
    var event_type_move = {"mousemove": true, "drag": true};
    var event_type_up = {"mouseup": true, "dragend": true};
    self.buttons = 0;

    // ------------------------------------------------------------
    // イベント
    // ------------------------------------------------------------
    blur_handler = function () {
        self.buttons = 0;
    };
    if (window_obj.addEventListener) {
        mouse_handler = function (e) {
            if (event_type_down[e.type]) {
                self.buttons |= (0x1 << button_tbl[e.button]);
            } else if (event_type_up[e.type]) {
                self.buttons &= ~(0x1 << button_tbl[e.button]);
            } else if (event_type_move[e.type]) {
                if (e.buttons !== undefined) {
                    self.buttons = e.buttons;
                }
            }
        };
        window_obj.addEventListener("mousedown", mouse_handler, true);
        window_obj.addEventListener("mouseup", mouse_handler, false);
        window_obj.addEventListener("mousemove", mouse_handler, true);
        window_obj.addEventListener("dragstart", mouse_handler, true);
        window_obj.addEventListener("dragend", mouse_handler, false);
        window_obj.addEventListener("drag", mouse_handler, true);
        window_obj.addEventListener("blur", blur_handler);

    } else if (window_obj.attachEvent) {
        mouse_handler = function (e) {
            if (event_type_up[e.type]) {
                self.buttons &= ~(e.button);
            } else {
                self.buttons = (e.button);
            }
        };
        document_obj.attachEvent("onmousedown", mouse_handler);
        document_obj.attachEvent("onmouseup", mouse_handler);
        document_obj.attachEvent("onmousemove", mouse_handler);
        document_obj.attachEvent("ondragstart", mouse_handler);
        document_obj.attachEvent("ondragend", mouse_handler);
        document_obj.attachEvent("ondrag", mouse_handler);
        window_obj.attachEvent("onblur", blur_handler);
    }

    // ------------------------------------------------------------
    // マウス左ボタンの押下状態を調べる
    // ------------------------------------------------------------
    this.isDownLeft = function () {
        return (this.buttons & (0x1)) ? true : false;
    };

    // ------------------------------------------------------------
    // マウス右ボタンの押下状態を調べる
    // ------------------------------------------------------------
    this.isDownRight = function () {
        return (this.buttons & (0x2)) ? true : false;
    };

    /***
     * キャンバス内でカーソルを移動した際選択中のブロックに強調画像を表示する
     * 「　丁　←こんなの
     *  L　」
     * @param e
     */
    this.selectEvent = function (e) {

        // マウス位置を取得する
        var scrollX = window.pageXOffset || root.left;
        var scrollY = window.pageYOffset || root.top;

        // スクロールが無い場合 0を代入
        if (scrollX == undefined) {
            scrollX = 0;
        }
        if (scrollY == undefined) {
            scrollY = 0;
        }
        var x = scrollX + e.pageX - rect.left;
        var y = scrollY + e.pageY - rect.top;
        x = Math.floor(x / 40) * 40;
        y = Math.floor(y / 40) * 40;

        if (c_old_x || c_old_x == 0) {
            c_ctx.clearRect(c_old_x, c_old_y, 40, 40)
        }
        c_old_x = x;
        c_old_y = y;
        map_x = Math.floor(x / 40);
        map_y = Math.floor(y / 40);
        console.log("x : " + x + " y : " + y);
        c_ctx.drawImage(c_select_img, x, y);

        // cvs上にカーソルがある場合動作
        if (map_x >= 0 && map_x <= 9 && map_y >= 0 && map_y <= 9) {
            //　マウス左ボタンを押されている場合
            if (this.isDownLeft() && !this.isDownRight()) {
                // 選択画像がキャラクターの場合
                if (select_i == 1 && !charBlockFlg) {
                    itemClear();
                    c_mid_ctx.drawImage(drawItemImage[select_i], x, y);
                    mapData[map_y][map_x] = "p";
                    charBlockFlg = true;
                    // 選択画像がゴールの場合
                } else if (select_i == 2 && !goalBlockFlg) {
                    itemClear();
                    c_mid_ctx.drawImage(drawItemImage[select_i], x, y);
                    mapData[map_y][map_x] = "g";
                    goalBlockFlg = true;
                    // 選択画像がブロックの場合
                } else if (select_i == 0) {
                    itemClear();
                    c_mid_ctx.drawImage(drawItemImage[select_i], x, y);
                    mapData[map_y][map_x] = "*";
                }

            } else if (this.isDownRight()) {
                itemClear();
                mapData[map_y][map_x] = "0";
                // 中間キャンバスのブロックを削除 同じくmapも変
            }
        }
        /**
         * itemClear関数
         * 仕様：1, 上書きする場所のmapDataをチェック、それぞれキャラクター、ゴールの場合はフラグを切り替える
         *           2, 上書きする場所を一度clearRectしてから選択されている画像をドローする
         */
        function itemClear() {
            switch (mapData[map_y][map_x]) {
                case "p":
                    charBlockFlg = false;
                    break;
                case "g":
                    goalBlockFlg = false;
                    break;
                default:
                    break;
            }
            // 画像の重複を防ぐため一度clear
            c_mid_ctx.clearRect(x, y, 40, 40);
        }
    };
}

var input_mouse_button = new InputMouseButton(window);


function MouseEventFunc(e) {
    input_mouse_button.selectEvent(e);
}


function checkSubmit() {
    var playerExist_b = false;
    var goalExist_b = false;
    var mapStr = "";
    var errMes_s = "";
    var uniqueId = uid();
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            if (mapData[i][j] == "p") {
                playerExist_b = true;
            } else if (mapData[i][j] == "g") {
                goalExist_b = true;
            }
            makeHidden("c_map[" + i + "][" + j + "]", mapData[i][j], "mapTrans");
            mapStr = mapStr + mapData[i][j];
        }
    }
    // ユニークIDも生成
    console.log(uniqueId);
    makeHidden('uniqueId', uniqueId, "mapTrans");
    // 再送信防止
    makeHidden('old_map', mapStr, "mapTrans");
    if (old_map == mapStr || !playerExist_b || !goalExist_b) {
        if (!playerExist_b && !goalExist_b) {
            errMes_s = "エラー：プレイヤーとゴールの位置が設定されていません。"
        } else if (!playerExist_b) {
            errMes_s = "エラー：プレイヤーの位置が設定されていません。"
        } else if (!goalExist_b) {
            errMes_s = "エラー：ゴールの位置が設定されていません。"
        } else {
            errMes_s = "エラー：以前と同じMAPを送信しようとしていませんか？"
        }
        alert(errMes_s);
        document.getElementById("hiddenRoot").setAttribute("value", "toCreate");
        return false;
    } else {
        document.getElementById("hiddenRoot").setAttribute("value", "toResult");
        return true;
    }
}
/**
 * makeHiddenメソッド
 * 処理概要:
 *      作成した二次元配列の中の１つ１つのデータを<input type="hidden">に格納して
 *      html側にあるformに挿入する
 * @param name // 配列名[][] 例: c_map[0][1]
 * @param value
 * @param formname // 挿入先formのname
 */

function makeHidden(name, value, formname) {
    var q = document.createElement('input');
    q.setAttribute("type", "hidden");
    q.setAttribute("name", name);
    q.setAttribute("value", value);
    if (formname) {
        document.forms[formname].appendChild(q);
    }
}

// マウスボタンを押すと実行
window.addEventListener("mousedown", MouseEventFunc);
// マウスカーソルを移動するときに実行
window.addEventListener("mousemove", MouseEventFunc);
// マウスボタンを離すと実行
window.addEventListener("mouseup", MouseEventFunc);

blockBtn.addEventListener("click", function () {
    select_i = 0;
});

characterBtn.addEventListener("click", function () {
    select_i = 1;
});

goalBtn.addEventListener("click", function () {
    select_i = 2;
    console.table(mapData);
});

deleteBtn.addEventListener("click", function () {
    mapData = [
        ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]
    ];
    charBlockFlg = false;
    goalBlockFlg = false;
    console.table(mapData);
    c_mid_ctx.clearRect(0, 0, 400, 400);
});

/**
 * ランダムな文字列を返す簡易パスワード生成メソッド
 * // UUIDに似たいわゆる復活の呪文
 * @returns {string}
 */
function uid() {
    var uid = "";
    var str = 'abcdefghijklmnopqrstuvwxyz' +
        '0123456789';
    for (var i = 0; i < 4; i++) {
        uid = uid + str[Math.floor(Math.random() * str.length)];
    }
    document.getElementById('passCode').setAttribute('value', uid);
    return uid;
}