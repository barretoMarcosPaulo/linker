import re
import uuid
from django.db import models
from django.urls import reverse
from django.core import validators
from django.contrib.auth.models import AbstractBaseUser, UserManager, PermissionsMixin
from linker.core.models import AuditModel

class User(AbstractBaseUser, PermissionsMixin, AuditModel):

    username = models.CharField(
        'Usuário', max_length=200, unique=True, validators=[
        validators.RegexValidator(
            re.compile('^[\w.@+-]+$'),
            'Informe um nome de usuário válido. '
            'Este valor deve conter apenas letras, números '
            'e os caracteres: @/./+/-/_ .'
            , 'invalid'
        )
        ], help_text='Um nome curto que será usado para identificá-lo de forma única na plataforma'
    )
    full_name = models.CharField('Nome Completo', max_length=100)
    email = models.EmailField('Email', max_length=100, unique=True)
    is_staff = models.BooleanField('is staff', default=False)
    uuid_channel = models.UUIDField("UUID ", default=uuid.uuid4, editable=False)
    
    def __str__(self):
        return self.full_name
    
    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def get_absolute_url(self):
        return reverse('accounts:login')

    def get_short_name(self):
        return self.full_name.split(' ')[0]

    class Meta:
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'

class Friends(AuditModel):
    user = models.ForeignKey(User, related_name="user_request_friend",verbose_name="Usuário", on_delete=models.CASCADE)
    friend = models.ForeignKey(User, related_name="user_friend",verbose_name="Usuário", on_delete=models.CASCADE)
    is_active = models.BooleanField("Amizade ativa")

