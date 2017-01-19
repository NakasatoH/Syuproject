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
        target.style.paddingRight = 4 + "px";
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