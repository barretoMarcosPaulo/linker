from django.urls import path
from .views import *

app_name = 'links'

urlpatterns = [
    path('', IndexPage.as_view(), name='index'),
    path('links/', LinksAggregator.as_view(), name='links'),
    path('links/delete/', LinkDelete.as_view(), name='links_delete'),
    path('links/buscar/', LinksSearch.as_view(), name='links_search'),
    path('amigos/', Friends.as_view(), name='friends'),
    path('amigos/remover/', FriendshipRemove.as_view(), name='friendship_remove'),
    path('usuarios/autocomplete/', UsersAutoComplete.as_view(), name='users_autocomplete'),
    path('usuarios/amizade/', FriendshipRequest.as_view(), name='friendship_request'),
    path('workspaces/', Spaces.as_view(), name='workspaces'),
    path('workspaces/remover/', WorkspaceRemove.as_view(), name='workspace_remove'),
    path('workspaces/novo/', WorkspaceCreate.as_view(), name='workspace_add'),
    path('tags/', TagsCreate.as_view(), name='tags_add'),
    path('compartilhar/', ShareLink.as_view(), name='share_link'),
    path('notificacoes/', NotificationsList.as_view(), name='notifications_list'),
]