from django.shortcuts import render, redirect
from .forms import SignUpForm
from django.contrib.auth import authenticate, login, logout
from .forms import LoginForm

# Create your views here.
def login_view(request):
    error = None
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            student_id = form.cleaned_data['student_id']
            password = form.cleaned_data['password']
            user = authenticate(request, student_id=student_id, password=password)
            if user is not None:
                login(request, user)
                return redirect('main')  # 메인페이지로 이동 (URL 이름에 맞게 수정)
            else:
                error = '학번 또는 비밀번호가 올바르지 않습니다.'
    else:
        form = LoginForm()
    return render(request, 'accounts/login.html', {'form': form, 'error': error})

def logout_view(request):
    logout(request)
    return redirect('login')

def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')  # 로그인 페이지로 이동(추후 URL에 맞게 수정)
    else:
        form = SignUpForm()
    return render(request, 'accounts/signup.html', {'form': form})
