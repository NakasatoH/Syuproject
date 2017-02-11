# -*- coding:utf-8 -*-


import configparser
from numpy import *
from django.shortcuts import render
import sqlite3


def index(request):
    return render(request, 'index.html')


def subanime(request):
    return render(request, 'subAnime.html')


def imagemove(request):
    return render(request, 'imageMove.html')


def movesample(request):
    return render(request, 'moveSample.html')


w_blocks = 0
h_blocks = 0


def ddpulsmove(request):
    # mapという変数名を生成してエラーを確認。

    inifile = configparser.ConfigParser()  # SafeConfigParser()から名称変更
    inifile.read('static/config/stageSample01.ini', encoding='utf-8')

    # Configファイルから設定情報を取得
    block_size = inifile.get('settings', 'block_size')
    cvs_width = inifile.get('settings', 'canvas_width')
    cvs_height = inifile.get('settings', 'canvas_height')
    mapString = inifile.get('settings', 'map')
    mapStrRep = mapString.replace('\n', '')
    mapStrRep = mapStrRep.replace(' ', '')
    str2 = mapStrRep.replace(',', '')

    # ブロックがキャンバス上にそれぞれ何個入るかを調べる
    w_blocks = int(int(cvs_width) / int(block_size))
    h_blocks = int(int(cvs_height) / int(block_size))

    # 空の二次元配列を作成
    mapArray = [[0 for x in range(w_blocks)] for y in range(h_blocks)]

    # 設定ミスがある場合エラーを返す
    e_num1 = w_blocks * h_blocks
    e_num2 = len(str2)
    if (e_num1 != e_num2):
        print("settingsエラー")
    else:
        print("settings正常")

    pPositionX = ""  # プレイヤーのx座標
    pPositionY = ""  # 〃        y座標
    cnt = 0

    print(str2)
    for y in range(0, h_blocks):
        for x in range(0, w_blocks):
            mapArray[y][x] = str2[cnt]
            # プレイヤーの位置を確認する
            if str2[cnt] == "p":
                pPositionX = x
                pPositionY = y
            cnt += 1

    data = {
        'mapData': mapArray,
        'block_size': block_size,
        'pPositionX': pPositionX,
        'pPositionY': pPositionY,
        'cvs_width': cvs_width,
        'cvs_height': cvs_height,
    }
    return render(request, 'ddPlusMove.html', data)


def createmap(request):
    # result.htmlへ
    if request.method == "POST":
        mapData = ""
        mapStr = ""
        uid = ""
        root = "ルートデータ無し　createResult.html　へ"
        pPositionX = ""  # プレイヤーのx座標
        pPositionY = ""  # 〃        y座標
        try:
            root = request.POST['root']
        except:
            print("createMAPへ")

        print('ルート：' + str(root))
        # 送信されたmapデータを取得
        c_map = [[0 for i in range(10)] for j in range(10)]
        try:
            for i in range(0, 10):
                for j in range(0, 10):
                    c_map[i][j] = request.POST['c_map[' + str(i) + '][' + str(j) + ']']
            cnt = 0
            for y in range(0, 10):
                for x in range(0, 10):
                    mapStr = str(mapStr) + str(c_map[y][x])
            uid = request.POST['uniqueId']
            print('uniqueID : ' + str(uid) + ' c_map: ' + str(mapStr))
        except:
            print("取得できず")

        # createResult  -> ddPulsMove.html
        if root == 'toPlay':
            try:
                mapData = request.POST['mapData']
                pPositionX = request.POST['pX']
                pPositionY = request.POST['pY']
            except:
                print("ないわけないやん")
            print(mapData)
            inifile = configparser.ConfigParser()  # SafeConfigParser()から名称変更
            inifile.read('static/config/stageSample01.ini', encoding='utf-8')

            # Configファイルから設定情報を取得
            block_size = inifile.get('settings', 'block_size')
            cvs_width = inifile.get('settings', 'canvas_width')
            cvs_height = inifile.get('settings', 'canvas_height')

            # ブロックがキャンバス上にそれぞれ何個入るかを調べる
            w_blocks = int(int(cvs_width) / int(block_size))
            h_blocks = int(int(cvs_height) / int(block_size))

            cnt = 0

            data = {
                'mapData': mapData,
                'block_size': block_size,
                'pPositionX': pPositionX,
                'pPositionY': pPositionY,
                'cvs_width': cvs_width,
                'cvs_height': cvs_height,
            }
            return render(request, 'ddPlusMove.html', data)
        elif root == 'toResult':
            user = ''
            passCode = ""

            # NULL許可
            try:
                user = request.POST['user']
            except:
                print("ユーザー名なし")
            if(user == ''):
                user = "NoName"

            # パスコード取得　NOTNULL
            try:
                passCode = request.POST['passCode']
            except:
                print("requestエラー　障害在り")

            # データベース接続
            connector = sqlite3.connect("sp.sqlite3")

            # SQL文作成 sv_user テーブル作成 sql
            sql = "CREATE TABLE alg_app(id INTEGER PRIMARY  KEY AUTOINCREMENT, user TEXT, pass_code TEXT NOT NULL, map_data TEXT NOT NULL, ts DEFAULT CURRENT_TIMESTAMP )"
            try:
                # SQL文実行
                connector.execute(sql)
                # SQL文更新
                connector.commit()
            except:
                print("DB作成済み")
            connector.close()

            connector = sqlite3.connect("sp.sqlite3")
            try:
                # 必ずu""でユニコードに変換すること
                connector.execute(u"INSERT INTO alg_app(user, pass_code, map_data) VALUES( ?,?,? )",
                                  (user, passCode, mapStr))
                ins_mes = str("alg_appテーブルに、ユーザー名：【") + str(user) + str("】 パスコード：【") + str(passCode) + str(
                    "】 mapStr：【") + str(mapStr) + str("】")
            except:
                ins_mes = "データベース INSERT エラー"
            connector.commit()
            connector.close()
            data = {
                'uid': uid,
                'mapData': c_map
            }
            return render(request, 'createResult.html', data)
        # 条件を満たしていないためResult画面ではなくCreateMap.htmlに戻す
        elif root == 'toCreate':
            inifile = configparser.ConfigParser()  # SafeConfigParser()から名称変更
            inifile.read('static/config/stageSample01.ini', encoding='utf-8')

            # Configファイルから設定情報を取得
            block_size = inifile.get('settings', 'block_size')
            cvs_width = inifile.get('settings', 'canvas_width')
            cvs_height = inifile.get('settings', 'canvas_height')
            old_map = ""
            data = {
                'block_size': block_size,
                'cvs_width': cvs_width,
                'cvs_height': cvs_height,
                'old_map': old_map,
            }
            return render(request, 'createMap.html', data)
            # createMap.htmlへ
    elif request.method == "GET":  # mapという変数名を生成してエラーを確認。
        print("get")
        inifile = configparser.ConfigParser()  # SafeConfigParser()から名称変更
        inifile.read('static/config/stageSample01.ini', encoding='utf-8')

        # Configファイルから設定情報を取得
        block_size = inifile.get('settings', 'block_size')
        cvs_width = inifile.get('settings', 'canvas_width')
        cvs_height = inifile.get('settings', 'canvas_height')
        old_map = ""
        try:
            old_map = request.GET['old_map']
        except:
            print("map未生成")
        data = {
            'block_size': block_size,
            'cvs_width': cvs_width,
            'cvs_height': cvs_height,
            'old_map': old_map,
        }
        return render(request, 'createMap.html', data)


def tableinfo(request):
    return render(request, 'tableInfo.html')
