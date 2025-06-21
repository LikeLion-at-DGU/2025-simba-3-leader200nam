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
def signin(request):
    return render(request, 'signin.html')

def signup(request):
    print("=== signup 뷰 호출됨 ===")
    print(f"요청 메서드: {request.method}")
    
    if request.method == 'POST':
        print("POST 요청 감지!")
        print("POST 데이터:", dict(request.POST))
        
        form = SignUpForm(request.POST)
        print("폼 생성됨")
        
        if form.is_valid():
            print("✅ 폼이 유효함!")
            try:
                user = form.save()
                print(f"✅ 사용자 저장 완료: {user.number_name}")
                return redirect('signin')
            except Exception as e:
                print(f"❌ 저장 실패: {e}")
                import traceback
                traceback.print_exc()
        else:
            print("❌ 폼이 유효하지 않음")
            print("폼 에러:", form.errors)
    else:
        print("GET 요청 - 폼 표시")
        form = SignUpForm()
    
    return render(request, 'signup.html', {'form': form})

def login_view(request):
    error = None
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            number_name = form.cleaned_data['number_name']
            password = form.cleaned_data['password']
            
            print("\n" + "="*50)
            print("=== 로그인 시도 ===")
            print(f"학번: {number_name}")
            
            # 1. 사용자가 DB에 존재하는지 확인
            try:
                user_obj = User.objects.get(number_name=number_name)
                print(f"✅ 사용자를 찾았습니다: {user_obj.number_name}")
                # 2. 비밀번호가 일치하는지 확인
                if user_obj.check_password(password):
                    print("✅ 비밀번호가 일치합니다.")
                else:
                    print("❌ 비밀번호가 일치하지 않습니다!")
            except User.DoesNotExist:
                print("❌ 해당 학번의 사용자가 DB에 없습니다.")

            # 3. Django 인증 시도
            user = authenticate(request, username=number_name, password=password)
            
            if user is not None:
                print("✅ Django 인증(authenticate) 성공!")
                login(request, user)
                print("="*50)
                return redirect('mainpage')
            else:
                print("❌ Django 인증(authenticate) 실패!")
                error = '학번 또는 비밀번호가 올바르지 않습니다.'
                print("="*50)
    else:
        form = LoginForm()
    
    return render(request, 'signin.html', {'form': form, 'error': error})

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
    return render(request, 'set_nickname.html', {'form': form})

@login_required
def profile_view(request):
    return render(request, 'profile.html', {'user': request.user})

@login_required
def profile_update(request):
    if request.method == 'POST':
        form = ProfileUpdateForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect('accounts:profile')
    else:
        form = ProfileUpdateForm(instance=request.user)
    return render(request, 'profile_update.html', {'form': form})

@login_required
def mainpage(request):
    # 닉네임 없으면 닉네임 입력 페이지로 리다이렉트
    if not request.user.nickname:
        return redirect('set_nickname')
    # 레벨 계산(예: 100exp당 1레벨)
    exp = getattr(request.user, 'exp', 0)
    level = exp // 100 + 1
    # 학교명
    school = request.user.univ_name
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


