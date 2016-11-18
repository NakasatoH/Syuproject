# -*- coding:utf-8 -*-


from django.shortcuts import render
import configparser
import sys
import io
import json

def index(request):
    return render(request, 'index.html')


def subanime(request):
    return render(request, 'subAnime.html')


def imagemove(request):
    return render(request, 'imageMove.html')


def movesample(request):
    return render(request, 'moveSample.html')


def ddpulsmove(request):

    '''
        mapという変数名を生成してエラーを確認。
    :param request:
    :return:
    '''
    inifile = configparser.ConfigParser()  # SafeConfigParser()から名称変更
    inifile.read('static/config/stageSample01.ini', encoding='utf-8')

    mapData = inifile.get('settings', 'map')
    block_size = inifile.get('settings', 'block_size')
    print(repr(mapData))
    # 戻り値が文字ならオブジェクトにする
    mapData = json.loads(mapData)
    #print("文字列：" + str(mapData[0][2]) + str(mapData[1][3])) # 配列であるか確認 -> Python側では配列
    data = {
        'mapData': mapData,
        'block_size': block_size,
    }
    print(repr(data))
    return render(request, 'ddPlusMove.html', data)
