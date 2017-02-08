from django.conf.urls import url
from algApp import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^subanime/', views.subanime, name='subanime'),
    url(r'^imagemove/', views.imagemove, name='imagemove'),
    url(r'^movesample/', views.movesample, name='movesample'),
    url(r'^ddplusmove/', views.ddpulsmove, name='ddplusmove'),
    url(r'^createmap/', views.createmap, name='createmap')
]
