from django.contrib import admin
from .models import Workspaces, Tags, Links, Friendships, Notification

admin.site.register(Workspaces)
admin.site.register(Tags)
admin.site.register(Links)
admin.site.register(Friendships)
admin.site.register(Notification)