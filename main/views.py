from django.shortcuts import render
from accounts.models import User

def mainpage(request):
    user=User.objects.all();
    return render(request, 'main/mainpage.html')

def intropage(request):
    return render(request, 'intro/intropage.html')

def signin(request):
    return render(request, 'signin.html')

def signup(request):
    return render(request, 'signup.html')

def introInputPage(request):
    return render(request, 'intro/introInputPage.html')

def registeration(request):
    return render(request, 'main/registeration.html')

def profileModification(request):
    return render(request, 'main/profileModification.html')

def rankPage(request):
    return render(request, 'main/rankPage.html')