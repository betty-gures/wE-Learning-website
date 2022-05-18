from django.urls import path

from . import views

urlpatterns = [
    # ex: /courses/
    path('', views.index, name='index'),
]
