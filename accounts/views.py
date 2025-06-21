from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .forms import SignUpForm, LoginForm, ProfileUpdateForm
from django.contrib.auth.decorators import login_required
from django import forms
from accounts.models import User
from quest.models import Quest
from feed.models import Feed
from datetime import date

# Create your views here.

def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')  # 로그인 페이지로 이동(추후 URL에 맞게 수정)
    else:
        form = SignUpForm()
    return render(request, 'accounts/signup.html', {'form': form})

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
                return redirect('mainpage')  # 메인페이지로 이동 (URL 이름에 맞게 수정)
            else:
                error = '학번 또는 비밀번호가 올바르지 않습니다.'
    else:
        form = LoginForm()
    return render(request, 'accounts/login.html', {'form': form, 'error': error})

def logout_view(request):
    logout(request)
    return redirect('login')

class NicknameForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['nickname']

@login_required
def set_nickname(request):
    if request.method == 'POST':
        form = NicknameForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect('mainpage')
    else:
        form = NicknameForm(instance=request.user)
    return render(request, 'accounts/set_nickname.html', {'form': form})

@login_required
def profile_view(request):
    return render(request, 'accounts/profile.html', {'user': request.user})

@login_required
def profile_update(request):
    if request.method == 'POST':
        form = ProfileUpdateForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect('accounts:profile')
    else:
        form = ProfileUpdateForm(instance=request.user)
    return render(request, 'accounts/profile_update.html', {'form': form})

@login_required
def mainpage(request):
    # 닉네임 없으면 닉네임 입력 페이지로 리다이렉트
    if not request.user.nickname:
        return redirect('accounts:set_nickname')
    # 레벨 계산(예: 100exp당 1레벨)
    exp = getattr(request.user, 'exp', 0)
    level = exp // 100 + 1
    # 학교명
    school = request.user.school_name
    # 이번 주 퀘스트
    today = date.today()
    month = today.month
    week = (today.day - 1) // 7 + 1
    quests = Quest.objects.filter(month=month, week=week)
    # 퀘스트 완료 여부(Feed에 인증된 quest가 3개 이상이면 완료)
    completed_count = Feed.objects.filter(author=request.user, quest__in=quests, is_completed=True).count()
    is_all_completed = completed_count >= 3
    # 퀘스트 경험치 정보
    quest_exp = sum(q.exp for q in quests)
    context = {
        'nickname': request.user.nickname,
        'level': level,
        'school': school,
        'quests': quests,
        'is_all_completed': is_all_completed,
        'quest_exp': quest_exp,
    }
    return render(request, 'main/mainpage.html', context)


