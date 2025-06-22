from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from accounts.models import User
from django.contrib import messages
from django.http import JsonResponse
from quest.models import Quest
from datetime import datetime
import random

# Create your views here.

@login_required
def mainpage(request):
    user=User.objects.all();
    return render(request, 'main/mainpage.html')

    # 현재 날짜 기준으로 월/주차 계산
    now = datetime.now()
    current_month = now.month
    current_week = (now.day - 1) // 7 + 1
    
    # 해당 월/주차의 퀘스트 조회 (랜덤 3개)
    quests = Quest.objects.filter(month=current_month, week=current_week)
    if quests.count() >= 3:
        current_quests = random.sample(list(quests), 3)
    else:
        current_quests = list(quests)
    
    # 사용자 정보
    user_data = {
        'nickname': request.user.nickname or '서누',
        'univ_name': request.user.univ_name,
        'major_name': request.user.major_name,
        'bio': request.user.bio or ''
    }
    
    # 퀘스트 정보
    quest_data = [
        {
            'id': quest.id,
            'title': quest.title,
            'description': quest.description,
            'exp': quest.exp
        } for quest in current_quests
    ]
    
    context = {
        'user_data': user_data,
        'quests': quest_data,
        'current_month': current_month,
        'current_week': current_week
    }
    
    return render(request, 'main/mainpage.html', context)

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

@login_required
def profileModification(request):
    if request.method == 'POST':
        # 현재 사용자 정보 가져오기
        user = request.user
        
        # 폼 데이터에서 정보 추출
        nickname = request.POST.get('nickname', '').strip()
        major_name = request.POST.get('major_name', '').strip()
        bio = request.POST.get('bio', '').strip()
        
        # 유효성 검사
        if not nickname or len(nickname) < 2 or len(nickname) > 15:
            error = '닉네임은 2~15자 이내로 입력해주세요.'
            return render(request, 'main/profileModification.html', {'user': user, 'error': error})
        
        try:
            # 사용자 정보 업데이트
            user.nickname = nickname
            user.major_name = major_name
            user.bio = bio
            
            # 이미지 파일 처리
            if 'image' in request.FILES:
                user.image = request.FILES['image']
            
            user.save()
            return redirect('mainpage')
            
        except Exception as e:
            error = f'프로필 수정 중 오류가 발생했습니다: {e}'
            return render(request, 'main/profileModification.html', {'user': user, 'error': error})
    
    # GET 요청: 현재 사용자 정보를 폼에 표시
    return render(request, 'main/profileModification.html', {'user': request.user})


def rankPage(request):
    return render(request, 'main/rankPage.html')

def ending(request):
    return render(request, 'ending/endingpage.html')

# API 엔드포인트 - 사용자 정보 제공
@login_required
def get_user_info(request):
    """사용자 정보를 JSON으로 제공하는 API"""
    user_data = {
        'nickname': request.user.nickname or '서누',
        'univ_name': request.user.univ_name,
        'major_name': request.user.major_name,
        'bio': request.user.bio or '',
        'image_url': request.user.image.url if request.user.image else None
    }
    return JsonResponse(user_data)

# API 엔드포인트 - 닉네임 업데이트
@login_required
def update_nickname(request):
    """닉네임 업데이트 API"""
    if request.method == 'POST':
        nickname = request.POST.get('nickname')
        
        if nickname and len(nickname) >= 2 and len(nickname) <= 15:
            request.user.nickname = nickname
            request.user.save()
            return JsonResponse({
                'status': 'success',
                'message': '닉네임이 성공적으로 업데이트되었습니다.',
                'nickname': nickname
            })
        else:
            return JsonResponse({
                'status': 'error',
                'message': '닉네임은 2~15자 이내로 입력해주세요.'
            }, status=400)
    
    return JsonResponse({'status': 'error', 'message': 'POST 요청만 허용됩니다.'}, status=405)