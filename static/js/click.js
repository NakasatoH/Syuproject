/**
 * Created by nakasato on 2017/01/17.
 */

function CloseHelp() {
    document.getElementById("helpWindow").style.display = "none";
}

function OpenHelp() {
    document.getElementById("helpWindow").style.display = "block";
}

// キャラクターを変更用メソッド
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
            this.image1.src = akitoSrc;
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
function resetImage() {
    var upper_elm = document.getElementById("upper");
    var bottom_elm = document.getElementById("bottom");
    // 右クリック時に画像をupperに戻し、配列からターゲットを排除する
    bottom_elm.addEventListener("contextmenu", function (e) {
        // メニュ表示をしない
        e.preventDefault();
        var target = e.target;
        console.log(target.localName);
        if (target.localName !== ("img") && target.className != ("divCode")) {
            return;
        }
        console.log("wCnt: " + wCnt + " hMax : " + hMax);
        outputArray2(target.id);
        target.style.marginLeft = 0 + "px";
        target.style.paddingRight = 0 + "px";
        target.style.width = 280 + "px";
        upper_elm.appendChild(target);
    }, false);
}


/**
 * while画像をクリックした際、繰り返し回数と画像を変更する処理
 */
function whileImageOnClick(e) {
    switch (e.getAttribute("data-n")) {
        case "2":
            e.setAttribute("data-n", 3);
            e.src = whileStr3Src;
            break;
        case "3":
            e.setAttribute("data-n", 4);
            e.src = whileStr4Src;
            break;
        case "4":
            e.setAttribute("data-n", 2);
            e.src = whileStr2Src;
            break;
    }
}

/**
 * 前に進む画像をクリックした際、移動距離と画像を変更する処理
 */
function forwardImageOnClick(e) {
    switch (e.getAttribute("data-n")) {
        case "1":
            e.setAttribute("data-n", 2);
            e.src = forward2Src;
            break;
        case "2":
            e.setAttribute("data-n", 3);
            e.src = forward3Src;
            break;
        case "3":
            e.setAttribute("data-n", 4);
            e.src = forward4Src;
            break;
        case "4":
            e.setAttribute("data-n", 1);
            e.src = forward1Src;
            break;
    }
}

/**
 * 方向画像をクリックした際、方向と画像を変更する処理
 */
function directionImageOnClick(e) {
    switch (e.getAttribute("data-d")) {
        case "l":
            e.setAttribute("data-d", "r");
            e.src = turnWestSrc;
            break;
        case "r":
            e.setAttribute("data-d", "b");
            e.src = turnSouthSrc;
            break;
        case "b":
            e.setAttribute("data-d", "t");
            e.src = turnNorthSrc;
            break;
        case "t":
            e.setAttribute("data-d", "l");
            e.src = turnEastSrc;
            break;
    }
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
        drag_elm.style.paddingRight = 0 + "px";
        drag_elm.style.width = 280 + "px";
        // コードボックス内に移動
        upper_elm.appendChild(drag_elm);
    }
    // 配列の長さを0にすることで配列を初期化（全要素を削除）
    images.length = 0;
    wCnt = 0;
    hMax = 32;
    console.log("ドロップされた画像、配列を初期化")
}