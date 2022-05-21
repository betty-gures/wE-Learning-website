from django.urls import path
from . import views
#from .views import colearn_home

urlpatterns= [
	# ex: /colearning/
	path('', views.home, name='home')
]

