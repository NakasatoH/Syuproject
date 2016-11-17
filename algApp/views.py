from django.shortcuts import render
import configparser
import sys
import io


def index(request):
    return render(request, 'index.html')


def subanime(request):
    return render(request, 'subAnime.html')


def imagemove(request):
    return render(request, 'imageMove.html')


def movesample(request):
    return render(request, 'moveSample.html')


def ddpulsmove(request):
    # -*- coding: utf-8 -*-

    message = "こんにちはぱいそんでーたです"
    data = {
        'message' : message,
    }
    return render(request, 'ddPlusMove.html',data)