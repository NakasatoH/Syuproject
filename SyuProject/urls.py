"""SyuProject URLの設定

ビューに `urlpatterns`リストルートのURL。詳細については、参照してください。
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
例：
ファンクションビュー
    1.インポートを追加します。MY_APPインポートビューから
    2. urlpatternsにURLを追加します：URL（R '^ $'、views.home、名前=「ホーム」）
クラスベースのビュー
    1.インポートを追加します。other_app.viewsインポートホームから
    2. urlpatternsにURLを追加します：URL（R '^ $'、Home.as_view（）、名前=「ホーム」）
別のURLconfを含みます
    、django.conf.urls輸入されたURLから、次のとおりです。1.インポートインクルード（）関数が含まれます
    2. urlpatternsにURLを追加します：URL（R '^ブログ/'、）（ 'blog.urls」を含みます）
"""
from django.conf.urls import url, include
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', include('algApp.urls', namespace='index')),
    url(r'^algApp/', include('algApp.urls', namespace='algApp')),
    # url(r'^main/', include('algApp.urls', namespace='main')),
]
