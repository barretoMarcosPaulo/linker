from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from django.http import JsonResponse

class Website(TemplateView):
    template_name = "website.html"
