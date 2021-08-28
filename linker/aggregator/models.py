from django.db import models
from linker.core.models import AuditModel
from linker.accounts.models import User

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Workspaces(AuditModel):
    name = models.CharField("Nome do espaço de trabalho", max_length=50)
    members = models.ManyToManyField(User, verbose_name="Membros", related_name="members")
    created_by = models.ForeignKey(User, verbose_name="Criado por", on_delete=models.PROTECT) 

    def __str__(self):
        return self.name


class Tags(AuditModel):
    name = models.CharField("Nome da tag", max_length=50)
    created_by = models.ForeignKey(User, verbose_name="Criado por", 
        on_delete=models.PROTECT, related_name="user") 

    def __str__(self):
        return self.name


class Links(AuditModel):
    title = models.CharField("Título", max_length=50)
    url = models.TextField("URL")
    description = models.TextField("Descrição")
    tags = models.ManyToManyField(Tags, verbose_name="Tags", related_name="tags")
    workspaces = models.ManyToManyField(Workspaces, verbose_name="Espaços de trabalho", 
        related_name="workspaces")
    created_by = models.ForeignKey(User, verbose_name="Criado por", on_delete=models.PROTECT) 
    is_active = models.BooleanField(default=True)

    @property
    def tags_list(self):
        tags = self.tags.all()
        list_tags = []
        [list_tags.append(tag.name) for tag in tags]

        return ", ".join(list_tags)
    def __str__(self):
        return self.title


class Friendships(AuditModel):
    user = models.ForeignKey(User, verbose_name="Usuário", 
        related_name="User", on_delete=models.PROTECT) 
    friend = models.ForeignKey(User, verbose_name="Amigo", 
        on_delete=models.PROTECT) 
    is_active = models.BooleanField(default=False)
    was_rejected = models.BooleanField(default=False)
    was_accepted = models.BooleanField(default=False)
    is_pending = models.BooleanField(default=False)

    def __str__(self):
        return "{}".format(self.friend.full_name)


class LinkShared(AuditModel):
    user = models.ForeignKey(User, verbose_name="Usuário", 
        related_name="link_user", on_delete=models.PROTECT) 
    friends = models.ManyToManyField(User, verbose_name="Amigo") 
    link = models.ForeignKey(Links, verbose_name="Link", 
        on_delete=models.PROTECT) 
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return "{}".format(self.link.title)


class Notification(AuditModel):
    TYPES_NOTIFICATION_CHOICES = (
        ("link", "Link"),
        ("friendships", "Friendships"),
        ("workspace", "Workspace"),
    )

    create_by = models.ForeignKey(User, verbose_name="Usuário", 
        related_name="notification_user", on_delete=models.PROTECT) 
    send_to = models.ForeignKey(User, verbose_name="Usuário", 
        related_name="notification_send", on_delete=models.PROTECT) 
    has_read = models.BooleanField(default=False)
    tipo_servico = models.CharField(
        choices=TYPES_NOTIFICATION_CHOICES,
        max_length=50
    )
    friendship = models.ForeignKey(Friendships, verbose_name="amizades", 
        related_name="friendship", on_delete=models.PROTECT) 

