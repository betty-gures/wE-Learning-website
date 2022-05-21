from django.urls import path
from . import views
#from .views import colearn_home

urlpatterns= [
	# ex: /colearning/
	path('', views.home, name='home'),
	path('<str:room>/', views.room, name='room'),
	path('checkview', views.home, name='home'),
]

