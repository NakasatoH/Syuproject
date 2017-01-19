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