from django.urls import path
from django.contrib.auth import views

from accounts.views import SignUpView

app_name='accounts'

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('signup/', SignUpView.as_view(), name='signup')
]