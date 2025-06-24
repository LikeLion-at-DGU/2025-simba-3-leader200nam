from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .forms import SignUpForm, LoginForm, ProfileUpdateForm
from django.contrib.auth.decorators import login_required
from django import forms
from accounts.models import User
from quest.models import Quest
from feed.models import Feed
from datetime import date
from django.http import JsonResponse

# 로그인 페이지 렌더링
def signin(request):
    return render(request, 'signin.html')

# 닉네임 입력 및 저장 페이지 
@login_required #로그인이 기본 조건
def introInputPage(request):
    if request.method == 'POST':
        nickname = request.POST.get('name', '').strip()
        if 2 <= len(nickname) <= 6: #닉네임 길이가 2자 이상 6자 이하 검사
            request.user.nickname = nickname
            request.user.save()
            return redirect('mainpage') #닉네임 저장 후 메인페이지로 이동
        else: #조건을 만족하지 못하면 같은 페이지를 다시 보여줌
            error = '닉네임은 2~6자 이내로 입력해주세요.'
            return render(request, 'intro/introInputPage.html', {'error': error})
    return render(request, 'intro/introInputPage.html')

# 인트로 페이지 (닉네임 입력 페이지)
def intropage(request):
    return render(request, 'accounts/intro/intropage.html')

# 회원가입 처리 GET: 회원가입 페이지 보여줌, POST: 회원가입 유효 확인 및 저장
def signup(request): 
    if request.method == 'POST':
        form = SignUpForm(request.POST) #폼 객체 생성
        if form.is_valid(): #폼 유효성 검사
                user = form.save() #폼 데이터 저장
                return redirect('signin') #회원가입 완료 후 로그인 페이지로 이동
    else: #GET
        form = SignUpForm()
    return render(request, 'signup.html', {'form': form})

# 로그인 처리
def login_view(request):
    error = None #에러 메시지용 변수
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            #아이디/비밀번호가 맞는지 확인
            user = authenticate(request, username=username, password=password)
            if user is not None: #정보 일치 시
                login(request, user)
                if not user.nickname: # 닉네임이 없을 시
                    return redirect('intropage')
                return redirect('mainpage')
            else:
                error = '아이디 또는 비밀번호가 올바르지 않습니다.'
    else: #GET
        form = LoginForm()
    return render(request, 'signin.html', {'form': form, 'error': error})

# 로그아웃 처리
def logout_view(request):
    logout(request)
    return redirect('login')

# 프로필 보기
@login_required
def profile_view(request):
    return render(request, 'profile.html', {'user': request.user})

# 프로필 수정
@login_required
def profile_update(request):
    if request.method == 'POST':
        form = ProfileUpdateForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect('accounts:profile')
    else: #GET
        form = ProfileUpdateForm(instance=request.user)
    return render(request, 'profile_update.html', {'form': form})

# 메인페이지 (레벨, 학교명, 퀘스트 정보 등 전달)
@login_required
def mainpage(request):
    if not request.user.nickname: #닉네임이 없으면 닉네임 입력 페이지로 이동
        return redirect('set_nickname')
    exp = getattr(request.user, 'exp', 0) #경험치 가져오기
    level = exp // 100 + 1 #레벨 계산
    school = request.user.univ_name #학교명 가져오기
    today = date.today() 
    month = today.month
    week = (today.day - 1) // 7 + 1 
    quests = Quest.objects.filter(month=month, week=week) #퀘스트 목록 가져오기
    quest_exp = sum(q.exp for q in quests) #퀘스트 경험치 합계
    context = {
        'nickname': request.user.nickname,
        'level': level,
        'school': school,
        'quests': quests,
        'is_all_completed': is_all_completed,
        'quest_exp': quest_exp,
    }
    return render(request, 'main/mainpage.html', context)

# 아이디 중복 체크 API (AJAX 요청 처리용)
def check_username(request):
    username = request.GET.get('username', '')
    exists = User.objects.filter(username=username).exists()
    return JsonResponse({'exists': exists})
