from django.urls import path
from .views import Website

app_name = 'usuario'

urlpatterns = [
    path('', Website.as_view(), name='homepage'),
]