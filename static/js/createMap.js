/**
 * Created by varuma on 2017/02/02.
 */

// 匿名関数内で実行
(function () {

    // 各エレメントを取得
    var element = document.getElementById("element_06");
    var element_left = document.getElementById("edit_06_left");
    var element_right = document.getElementById("edit_06_right");
    var element_result = document.getElementById("edit_06_result");

// ------------------------------------------------------------
// マウスボタンの入力状態を調べるコンストラクタ
// ------------------------------------------------------------
    function InputMouseButton(window_obj) {

        // ------------------------------------------------------------
        // 初期化
        // ------------------------------------------------------------
        var self = this;
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
        /**
         * 参考URL
         * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
         * " |-  " は ビット論理和 (OR) 代入
         * "a << b" 左シフト    2 進表現の a を b (< 32) ビット分だけ左にシフトします。右から 0 を詰めます。
         */
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
    }

    // ------------------------------------------------------------
    // InputMouseButton オブジェクトを作成
    // ------------------------------------------------------------
    var input_mouse_button = new InputMouseButton(window);

    // ------------------------------------------------------------
    // 表示更新
    // ------------------------------------------------------------
    function update() {
        // マウス左ボタンの押下状態
        element_left.value = input_mouse_button.isDownLeft();
        // マウス右ボタンの押下状態
        element_right.value = input_mouse_button.isDownRight();
    }

    // ------------------------------------------------------------
    // マウス関連のコールバック関数
    // ------------------------------------------------------------
    function MouseEventFunc(e) {
        update();
        element_result.value = "buttons:" + e.buttons + " button:" + e.button + " which:" + e.which + " type:\"" + e.type + "\"";
    }

    // ------------------------------------------------------------
    // イベントのリッスンを開始する
    // ------------------------------------------------------------
    // イベントリスナーに対応している
    // マウスボタンを押すと実行されるイベント
    window.addEventListener("mousedown", MouseEventFunc);
    // マウスカーソルを移動するたびに実行されるイベント
    window.addEventListener("mousemove", MouseEventFunc);
    // マウスボタンを離すと実行されるイベント
    window.addEventListener("mouseup", MouseEventFunc);

    /**
     * 左右のクリックのデフォルトの操作をキャンセル
     */
    element.onmousedown = function (e) {
        return false;
    };
    element.oncontextmenu = function (e) {
        return false;
    };
})();