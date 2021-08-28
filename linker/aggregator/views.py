from django.views.generic import TemplateView, View
from django.shortcuts import render
from django.http import JsonResponse
import json
from django.db.models import Q

from linker.aggregator.models import (
    Tags,
    Links,
    Workspaces,
    Friendships,
    LinkShared,
    Notification,
)
from linker.accounts.models import User
from .helpers import format_users_list_result
import pusher

pusher_client = pusher.Pusher(
    app_id="1194177",
    key="7f66f8f13624f8813eac",
    secret="709d8715aba90973802f",
    cluster="us2",
    #   ssl=True
    ssl=False,
)


class IndexPage(TemplateView):
    template_name = "aggregator/index.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context["tags_user"] = Tags.objects.filter(created_by=self.request.user)

        context["links"] = Links.objects.filter(created_by=self.request.user)

        context["spaces"] = Workspaces.objects.filter(
            Q(created_by=self.request.user) | Q(members=self.request.user)
        ).distinct()

        context["friends"] = Friendships.objects.filter(user=self.request.user)

        return context


class TagCreate(View):
    def post(self, request, *args, **kwargs):
        datas = json.loads(request.body.decode("utf-8"))
        new_tag = datas["name"]

        tag = Tags.objects.create(name=new_tag, created_by=self.request.user)
        return JsonResponse({"message": "ok", "tag_id": tag.id}, safe=False)


class LinksAggregator(View):
    def post(self, request, *args, **kwargs):
        datas = json.loads(request.body.decode("utf-8"))
        print(datas)

        if datas["workspace"] == "false" or datas["workspace"] == False :
            print('NO SPACE')
            tags = Tags.objects.filter(id__in=datas["tags"])
            new_link = Links.objects.create(
                title=datas["title"],
                url=datas["url"],
                description=datas["description"],
                created_by=self.request.user,
            )

            new_link.tags.add(*tags)
        else:
            workspace = Workspaces.objects.get( id=int(datas["workspace"]) )
            new_link = Links.objects.create(
                title=datas["title"],
                url=datas["url"],
                description=datas["description"],
                created_by=self.request.user,
            )
            new_link.workspaces.add(workspace)
            
            for member in workspace.members.all():
                pusher_client.trigger(str(member.uuid_channel), "reload-spaces-links", {
                    "space":workspace.id
                })
            pusher_client.trigger(str(workspace.created_by.uuid_channel), "reload-spaces-links", {
                "space":workspace.id
            })

        return JsonResponse({"message": "Link criado com sucesso!"}, safe=False)

    def get(self, request):
        links_response = []
        shareds_me = LinkShared.objects.filter(
            friends__id__in=[self.request.user.id],
            is_active=True
        ).values_list("link", flat=True)

        ids = list(shareds_me)

        links = Links.objects.filter(
            Q(Q(created_by=self.request.user) & Q(is_active=True) & Q(workspaces=None)) | Q(id__in=ids)
        )

        for link in links:

            created_by = ""
            tags = link.tags_list
            shared = False
            if link.created_by.id != self.request.user.id:
                created_by = "Compartilhado por: " + link.created_by.full_name
                tags = ""
                shared = True

            links_response.append(
                {
                    "title": link.title,
                    "description": link.description,
                    "url": link.url,
                    "tags": tags,
                    "id": link.id,
                    "created_by": created_by,
                    "shared": shared,
                }
            )

        return JsonResponse(
            status=200,
            data={"links": links_response},
        )


class LinkDelete(View):
    def post(self, request, *args, **kwargs):
        datas = json.loads(request.body.decode("utf-8"))

        if datas["is_shared"] == "true":
            print("Compartilhado")
            link_id = int(datas["link"])

            link_shared = LinkShared.objects.get(
                link__id=link_id,
                friends__id__in=[self.request.user.id]
            )
            link_shared.is_active = False
            link_shared.save()
        else:
            print("MEU")
            link = Links.objects.get(
                id=int(datas["link"])
            )
            link.is_active =False
            link.save()
        
        if link.workspaces.first():
            for member in link.workspaces.first().members.all():  
                pusher_client.trigger(str(member.uuid_channel), "reload-spaces-links", {
                    "space":link.workspaces.first().id
                })
                
            pusher_client.trigger(str(link.workspaces.first().created_by.uuid_channel), "reload-spaces-links", {
                "space":link.workspaces.first().id
            })

        return JsonResponse({"message": "Link criado com sucesso!"}, safe=False)


class LinksSearch(View):
    def post(self, request, *args, **kwargs):
        datas = json.loads(request.body.decode("utf-8"))
        links_response = []
        print(datas["tags"])

        shareds_me = LinkShared.objects.filter(
                Q(
                    Q(friends__id__in=[self.request.user.id])&
                    Q(is_active=True)
                )&
                Q(
                    Q(link__title__icontains=datas["string"])|
                    Q(link__description__icontains=datas["string"])|
                    Q(user__username__icontains=datas["string"])|
                    Q(user__full_name__icontains=datas["string"])
                )
            ).values_list("link", flat=True)

        ids = list(shareds_me)
        if len(datas["tags"]) > 0:
            links = Links.objects.filter(
                Q(
                    Q(
                        Q(created_by=self.request.user) & Q(is_active=True) & Q(workspaces=None)
                    ) | Q(id__in=ids)
                )&
                Q(
                    Q(title__icontains=datas["string"])|
                    Q(description__icontains=datas["string"])|
                    Q(id__in=ids)
                )
                &
                Q(
                    tags__id__in=datas["tags"]
                )
            ).distinct()
        else:
            links = Links.objects.filter(
                Q(
                    Q(
                        Q(created_by=self.request.user) & Q(is_active=True) & Q(workspaces=None)
                    ) | Q(id__in=ids)
                )&
                Q(
                    Q(title__icontains=datas["string"])|
                    Q(description__icontains=datas["string"])|
                    Q(id__in=ids)
                )
            ).distinct()


        for link in links:

            created_by = ""
            tags = link.tags_list
            shared = False
            if link.created_by.id != self.request.user.id:
                created_by = "Compartilhado por: " + link.created_by.full_name
                tags = ""
                shared = True

            links_response.append(
                {
                    "title": link.title,
                    "description": link.description,
                    "url": link.url,
                    "tags": tags,
                    "id": link.id,
                    "created_by": created_by,
                    "shared": shared,
                }
            )


        print(datas)
        return JsonResponse({"links": links_response}, safe=False)



class Friends(View):
    def get(self, request):
        friends_list = {}
        friendships = Friendships.objects.filter(user=self.request.user, is_active=True)

        for friendship in friendships:
            friends_list[friendship.id] = {
                "friendship_id": friendship.id,
                "friend_name": friendship.friend.full_name,
                "friend_username": friendship.friend.username,
            }

        return JsonResponse(
            status=200,
            data={"friendships": friends_list},
        )

    def post(self, request, *args, **kwargs):
        return JsonResponse(
            status=200,
            data={"friends-post": "marcos"},
        )


class FriendshipRemove(View):
    def post(self, request, *args, **kwargs):
        datas = json.loads(request.body.decode("utf-8"))

        try:
            friendships = Friendships.objects.get(
                id=datas["id"], user=self.request.user, is_active=True
            )
            friendships.is_active = False
            friendships.save()

            friendships_reverse = Friendships.objects.get(
                user=friendships.friend, friend=self.request.user, is_active=True
            )
            friendships_reverse.is_active = False
            friendships_reverse.save()

            pusher_client.trigger(
                str(friendships.friend.uuid_channel), "reload-friend-list", {}
            )

            return JsonResponse(
                status=200,
                data={"detail": "vinculo de amizade removido"},
            )

        except Exception as e:
            print(e)

            return JsonResponse(
                status=400,
                data={"friends-post": "marcos"},
            )


class Spaces(View):
    def get(self, request):
        workspaces_list = {}
        friendships = Friendships.objects.filter(user=self.request.user)

        workspaces = Workspaces.objects.filter(
            Q(created_by=self.request.user) | Q(members=self.request.user)
        ).distinct()

        for space in workspaces:
            workspaces_list[space.id] = {
                "id": space.id,
                "name": space.name,
            }

        return JsonResponse(
            status=200,
            data={"workspaces": workspaces_list},
        )

    def post(self, request, *args, **kwargs):
        datas = json.loads(request.body.decode("utf-8"))
        details = {
            "name":"",
            "members":{}
        }

        workspace = Workspaces.objects.get(
            id=int(datas["id"])
        )
        details["name"] = workspace.name
        details["id"] = workspace.id

        for user in workspace.members.all():
            if user.id == self.request.user.id:
                details["members"][user.id] = {
                    "username":user.username,
                    "name":"Você",
                    "id":user.id,
                }
            else:
                details["members"][user.id] = {
                    "username":user.username,
                    "name":user.full_name,
                    "id":user.id,
                }


        if workspace.created_by.id == self.request.user.id:
            details["members"][workspace.created_by.id] = {
                "username":workspace.created_by.username,
                "name": "Você",
                "id": workspace.created_by.id,
            }
        else:
            details["members"][workspace.created_by.id] = {
                "username":workspace.created_by.username,
                "name": workspace.created_by.full_name+" (Criou)",
                "id": workspace.created_by.id,
            }
        
        links = Links.objects.filter(
            workspaces__id=workspace.id,
            is_active=True
        )
        links_response = []
        
        for link in links:
            links_response.append(
                {
                    "title": link.title,
                    "description": link.description,
                    "url": link.url,
                    "id": link.id,
                }
            )
        details["links"] = links_response

        return JsonResponse(
            status=200,
            data={"results": details},
        )


class UsersAutoComplete(View):
    def get(self, request):
        search_string = request.GET["nome"]
        friends_only = request.GET["friendsOnly"]

        if friends_only == "true":
            users_ids = Friendships.objects.filter(
                Q(user=self.request.user)
                & Q(is_active=True)
                & Q(
                    Q(friend__full_name__startswith=search_string)
                    | Q(friend__username__startswith=search_string)
                )
            ).values_list("friend", flat=True)

            result = User.objects.filter(id__in=[users_ids]).values_list(
                "full_name", "username", "id"
            )

        else:
            result = (
                User.objects.filter(
                    Q(full_name__startswith=search_string)
                    | Q(username__startswith=search_string)
                )
                .exclude(id=self.request.user.id)
                .values_list("full_name", "username", "id")
            )

        datas = format_users_list_result(result)

        return JsonResponse(
            status=200,
            data={"users": datas},
        )


class FriendshipRequest(View):
    def post(self, request, *args, **kwargs):
        datas = json.loads(request.body.decode("utf-8"))
        # Bloquear repetidos
        try:
            friend = User.objects.get(id=datas["user"])
            friendship = Friendships.objects.create(
                user=self.request.user,
                friend=friend,
            )

            notification = Notification.objects.create(
                create_by=self.request.user,
                send_to=friend,
                friendship=friendship,
                tipo_servico="friendships",
            )

            pusher_client.trigger(
                str(friend.uuid_channel),
                "notification",
                {
                    "type": "friendship",
                    "id": notification.id,
                    "send_by": friend.full_name,
                },
            )

            return JsonResponse(
                status=200,
                data={"detail": "pedido de amizade enviado"},
            )

        except Exception as e:
            return JsonResponse(status=400, data={"error": "error"})


class WorkspaceRemove(View):
    def post(self, request, *args, **kwargs):
        datas = json.loads(request.body.decode("utf-8"))

        try:

            workspace = Workspaces.objects.filter(
                id=datas["id"], created_by=self.request.user
            ).delete()

            return JsonResponse(
                status=200,
                data={"detail": "workspace removido"},
            )

        except Exception as e:

            return JsonResponse(
                status=400,
                data={"error": "workspace nao removido!"},
            )


class WorkspaceCreate(View):
    def post(self, request, *args, **kwargs):
        datas = json.loads(request.body.decode("utf-8"))

        try:
            users = User.objects.filter(id__in=datas["users"])
            workspace = Workspaces.objects.create(
                name=datas["name"], created_by=self.request.user
            )
            workspace.members.add(*users)
            workspace.save()
            for member in workspace.members.all():
                pusher_client.trigger(str(member.uuid_channel), "reload-spaces-list", {})


            return JsonResponse(
                status=200,
                data={"detail": "workspace criado", "id": workspace.id},
            )

        except Exception as e:

            return JsonResponse(
                status=400,
                data={"error": "workspace nao criado!"},
            )


class TagsCreate(View):
    def get(self, request):
        tags_list = {}
        tags = Tags.objects.filter(created_by=self.request.user)

        for tag in tags:
            tags_list[tag.id] = {
                "id": tag.id,
                "name": tag.name,
            }

        return JsonResponse(
            status=200,
            data={"tags": tags_list},
        )

    def post(self, request, *args, **kwargs):
        datas = json.loads(request.body.decode("utf-8"))
        try:
            tag = Tags.objects.create(name=datas["name"], created_by=self.request.user)

            return JsonResponse(
                status=200,
                data={"detail": "tag criada", "id": tag.id},
            )
        except Exception as e:

            return JsonResponse(
                status=400,
                data={"error": "tag não criada!"},
            )


class ShareLink(View):
    def post(self, request, *args, **kwargs):
        datas = json.loads(request.body.decode("utf-8"))
        try:
            link = Links.objects.get(id=datas["link"], created_by=self.request.user)
            users = User.objects.filter(id__in=datas["users"])

            if LinkShared.objects.filter(
                user=self.request.user, 
                link=link, 
                is_active=True
            ).count() == 0:
                shared = LinkShared.objects.create(user=self.request.user, link=link)
                shared.friends.add(*users)

                for friend in shared.friends.all():
                    pusher_client.trigger(str(friend.uuid_channel), "reload-links-list", {})

            return JsonResponse(
                status=200,
                data={"detail": "compartilhado com sucesso!"},
            )
        except Exception as e:
            print(e)
            return JsonResponse(
                status=400,
                data={"detail": "verifique os dados!"},
            )


class NotificationsList(View):
    def get(self, request):
        notifications_list = {"results": [], "total": 0}

        notifications = Notification.objects.filter(
            send_to=self.request.user, tipo_servico="friendships", has_read=False
        )

        notifications_list["total"] = notifications.count()

        for notification in notifications:
            notifications_list["results"].append(
                {
                    "type": "friendship",
                    "id": notification.id,
                    "send_by": notification.create_by.full_name,
                }
            )

        return JsonResponse(
            status=200,
            data={"notifications": notifications_list},
        )

    def post(self, request, *args, **kwargs):
        datas = json.loads(request.body.decode("utf-8"))
        notification = Notification.objects.get(id=datas["notification"])

        if datas["action"] == "accept":
            notification.friendship.was_accepted = True
            notification.friendship.is_active = True
            notification.friendship.save()

            notification.has_read = True
            notification.save()

            friendship = Friendships.objects.create(
                user=self.request.user,
                friend=notification.create_by,
                was_accepted=True,
                is_active=True,
            )

            pusher_client.trigger(
                str(friendship.friend.uuid_channel), "reload-friend-list", {}
            )

        else:

            notification.friendship.was_rejected = True
            notification.friendship.save()

            notification.has_read = True
            notification.save()

        return JsonResponse({"message": "Link criado com sucesso!"}, safe=False)
