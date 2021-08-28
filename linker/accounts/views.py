from django.shortcuts import render, redirect
from django.views.generic import CreateView, View
from django.http import JsonResponse
from .forms import UserForm
from .models import User


class RegisterUser(CreateView):
    template_name = "register.html"
    form_class = UserForm
    
class ChannelUser(View):
    
    def get(self, request):
        return JsonResponse(
            status=200,
            data={"channel" : request.user.uuid_channel },
        )
