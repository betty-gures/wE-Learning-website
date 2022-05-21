from django.urls import path
from django.conf.urls.static import static

from . import views

urlpatterns = [
    # ex: /home/
    path('', views.index, name='index'),
]