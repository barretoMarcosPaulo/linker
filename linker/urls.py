from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('home/', include('linker.aggregator.urls', namespace='home')),
    path('usuarios/', include('linker.accounts.urls', namespace="accounts")),
    path('', include('linker.website.urls', namespace="website")),
    
]

if settings.DEBUG:
    urlpatterns+= static(settings.STATIC_URL , document_root=settings.STATIC_ROOT)
    urlpatterns+= static(settings.MEDIA_URL , document_root=settings.MEDIA_ROOT)