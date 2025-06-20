from django.shortcuts import render

# Create your views here.

def mainpage(request):
    return render(request, 'main/mainpage.html')

def intropage(request):
    return render(request, 'intro/intropage.html')

def signin(request):
    return render(request, 'signin/signin.html')

def signup(request):
    return render(request, 'signup/signup.html')

def introInputPage(request):
    return render(request, 'intro/introInputPage.html')

def registeration(request):
    return render(request, 'main/registeration.html')

def profileModification(request):
    return render(request, 'main/profileModification.html')