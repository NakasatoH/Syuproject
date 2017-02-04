/**
 * Created by varuma on 2017/02/02.
 */
// html取得
var root = document.documentElement;

// 各Canvasをインスタンス化
var cBackCvs = document.getElementById("backCreateCvs");
var c_bk_ctx = cBackCvs.getContext('2d');
var cCvs = document.getElementById("createCvs");
var c_ctx = cCvs.getContext('2d');

var c_old_x = undefined;
var c_old_y = undefined;

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

var rect = cCvs.getBoundingClientRect();
var mouseEvent = function (e) {

    // デフォルト動作を停止
    e.preventDefault();

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
    console.log("x : " + x + " y : " + y);
    // c_ctx.drawImage(c_select_img, x, y);
    c_ctx.drawImage(block_img, x, y);
};
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
    blur_handler = function (e) {
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
    // buttons 形式で取得
    // ------------------------------------------------------------
    this.getButtons = function () {
        return (this.buttons);
    };

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

    // ------------------------------------------------------------
    // 解放する
    // ------------------------------------------------------------
    this.release = function () {
        if (window_obj.removeEventListener) {
            window_obj.removeEventListener("mousedown", mouse_handler, true);
            window_obj.removeEventListener("mouseup", mouse_handler, false);
            window_obj.removeEventListener("mousemove", mouse_handler, true);
            window_obj.removeEventListener("dragstart", mouse_handler, true);
            window_obj.removeEventListener("dragend", mouse_handler, false);
            window_obj.removeEventListener("drag", mouse_handler, true);
            window_obj.removeEventListener("blur", blur_handler);
        } else if (window_obj.detachEvent) {
            document_obj.detachEvent("onmousedown", mouse_handler);
            document_obj.detachEvent("onmouseup", mouse_handler);
            document_obj.detachEvent("onmousemove", mouse_handler);
            document_obj.detachEvent("ondragstart", mouse_handler);
            document_obj.detachEvent("ondragend", mouse_handler);
            document_obj.detachEvent("ondrag", mouse_handler);
            window_obj.detachEvent("onblur", blur_handler);
        }
    };

}

var input_mouse_button = new InputMouseButton(window);

function MouseEventFunc(e) {

    if (document.addEventListener) {
        console.log("左" + input_mouse_button.isDownLeft() + " 右：" + input_mouse_button.isDownRight());
    } else if (document.attachEvent) {
        setTimeout(
            console.log("左" + input_mouse_button.isDownLeft() + " 右：" + input_mouse_button.isDownRight()), 1);
    }

    console.log("buttons:" + e.buttons + " button:" + e.button + " which:" + e.which + " type:\"" + e.type + "\"");
}

//
cCvs.addEventListener("click", mouseEvent);

cCvs.addEventListener("mousemove", mouseEvent);
// マウスボタンを押すと実行
window.addEventListener("mousedown", MouseEventFunc);
// マウスカーソルを移動するときに実行
window.addEventListener("mousemove", MouseEventFunc);
// マウスボタンを離すと実行
window.addEventListener("mouseup", MouseEventFunc);