from . import views
from django.conf.urls import url

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^subanime/', views.subanime, name='subanime'),
    url(r'^imagemove/', views.imagemove, name='imagemove'),
]
