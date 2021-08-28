from django.urls import path
from django.contrib.auth import views as auth_views
from .views import RegisterUser, ChannelUser

app_name = 'usuario'

urlpatterns = [

    path('entrar/', auth_views.LoginView.as_view(
        template_name='login.html',
        redirect_authenticated_user=True
    ), name='login'),
    path('sair/', auth_views.LogoutView.as_view(), name='logout'),
    path('cadastrar/', RegisterUser.as_view(), name='register'),
    path('channels', ChannelUser.as_view(), name='channel_user'),


]