from django.shortcuts import render


def index(request):
    return render(request, 'index.html')


def subanime(request):
    return render(request, 'subAnime.html')
