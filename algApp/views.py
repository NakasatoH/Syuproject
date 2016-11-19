# -*- coding:utf-8 -*-


from django.shortcuts import render
import configparser
import sys
import io
import json
from numpy import *
from django.http import HttpResponse


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
    print("h_blocks : " + str(h_blocks) + " =  cvs_height :" + str(cvs_height) + " / blocksize : " + str(block_size))

    # 空の二次元配列を作成
    mapArray = [[0 for x in range(w_blocks)] for y in range(h_blocks)]

    # 設定ミスがある場合エラーを返す
    e_num1 = w_blocks * h_blocks
    e_num2 = len(str2)
    if (e_num1 != e_num2):
        print("settingsエラー")
    else:
        print("settings正常")

    cnt = 0
    print(str2)
    for y in range(0, h_blocks):
        for x in range(0, w_blocks):
            mapArray[y][x] = str2[cnt]
            cnt += 1
    print(repr(mapArray))

    newArray = [['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '0'],
                ['0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '0'],
                ['0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '0'],
                ['0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '0'],
                ['0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '0'],
                ['0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '0'],
                ['0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']]

    print(type(newArray))
    json.JSONEncoder(mapArray)
    data = {
        'mapData': mapArray,
        'block_size': block_size,
    }
    return render(request, 'ddPlusMove.html', data)
