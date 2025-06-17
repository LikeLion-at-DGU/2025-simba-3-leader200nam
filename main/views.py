from django.shortcuts import render

# Create your views here.

def mainpage(request):
    return render(request, 'main/mainpage.html')

def intropage(request):
    return render(request, 'intro/intropage.html')