from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import auth
from accounts.models import User
from django.contrib import messages
from django.http import JsonResponse
from quest.models import Quest
from feed.models import Feed
from datetime import datetime
from friends.models import Friend, FriendCode
import random
from typing import TYPE_CHECKING
from django.db.models import Count

if TYPE_CHECKING:
    from django.http import HttpRequest

# Create your views here.

@login_required
def mainpage(request):
    # 오늘 날짜가 12월 31일이면 endingpage로 이동
    now = datetime.now()
    if now.month == 12 and now.day == 31:
        return render(request, 'main/ending/endingpage.html')
    # 현재 날짜 기준으로 월/주차 계산
    current_month = now.month
    current_week = (now.day - 1) // 7 + 1
    
    # 해당 월/주차의 퀘스트 조회 (랜덤 3개)
    quests = Quest.objects.filter(month=current_month, week=current_week)  # type: ignore
    if quests.count() >= 3:
        current_quests = random.sample(list(quests), 3)
    else:
        current_quests = list(quests)
    
    # 사용자가 완료한 퀘스트 ID 목록
    completed_quest_ids = []
    if current_quests:
        completed_feeds = Feed.objects.filter(
            author=request.user, 
            quest__in=current_quests, 
            is_completed=True
        )
        completed_quest_ids = [feed.quest.id for feed in completed_feeds]
    
    # 사용자 정보
    user_data = {
        'nickname': request.user.nickname or '서누',
        'univ_name': request.user.univ_name,
        'major_name': request.user.major_name,
        'bio': request.user.bio or '',
        'exp': getattr(request.user, 'exp', 0),
        'level': (getattr(request.user, 'exp', 0) // 1000) + 1,
        'current_level_exp': getattr(request.user, 'exp', 0) % 1000,
        'ako_image': request.user.ako_image
    }
    
    # 퀘스트 정보 (완료 상태 포함)
    quest_data = []
    for quest in current_quests:
        is_completed = quest.id in completed_quest_ids
        quest_data.append({
            'id': quest.id,
            'title': quest.title,
            'description': quest.description,
            'exp': quest.exp,
            'is_completed': is_completed
        })
    
    # 모든 퀘스트 완료 여부 체크
    is_all_completed = all(q['is_completed'] for q in quest_data) if quest_data else False

    # 주차별로 고유 플래그 키 생성
    quest_flag_key = f'all_quests_completed_flag_{current_month}_{current_week}'

    # 이번 주차 퀘스트를 처음 모두 완료한 경우에만 True 저장
    if is_all_completed and not request.session.get(quest_flag_key, False):
        request.session['all_quests_completed'] = True
        request.session[quest_flag_key] = True
    elif not is_all_completed:
        # 새로운 주차가 시작되면 플래그를 초기화
        request.session[quest_flag_key] = False

    context = {
        'user': user_data,
        'quests': quest_data,
        'current_month': current_month,
        'current_week': current_week,
        'leveled_up': request.session.pop('leveled_up', False),
        'new_level': request.session.pop('new_level', None),
        'all_quests_completed': request.session.pop('all_quests_completed', False),
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
    if request.method == 'POST':
        # 퀘스트 인증 처리
        quest_id = request.POST.get('quest_id')
        image = request.FILES.get('image')
        image_name = request.POST.get('image_name')
        location = request.POST.get('location')
        memo = request.POST.get('memo', '')
        is_public = request.POST.get('is_public') == 'on'
        is_private = not is_public  # 공개가 아니면 비공개

        if not (quest_id and image and image_name and location):
            messages.error(request, '필수 항목이 누락되었습니다.')
            return redirect('registeration')

        try:
            quest = Quest.objects.get(id=quest_id)
            
            # 이미 완료된 퀘스트인지 확인
            existing_feed = Feed.objects.filter(author=request.user, quest=quest, is_completed=True).first()
            if existing_feed:
                messages.error(request, '이미 완료된 퀘스트입니다.')
                return redirect('mainpage')
            
            # 퀘스트 인증 피드 생성
            feed = Feed.objects.create(
                author=request.user,
                quest=quest,
                image=image,
                image_name=image_name,
                location=location,
                memo=memo,
                is_private=is_private,
                is_completed=True
            )
            
            # 사용자 경험치 증가
            if hasattr(request.user, 'exp'):
                old_level = (request.user.exp // 1000) + 1
                request.user.exp += quest.exp
                request.user.save()
                new_level = (request.user.exp // 1000) + 1
                
                # 레벨업이 발생했는지 확인
                if new_level > old_level:
                    request.session['leveled_up'] = True
                    request.session['new_level'] = new_level
            
            messages.success(request, f'퀘스트 인증이 완료되었습니다! (+{quest.exp} exp)')
            return redirect('mainpage')
            
        except Quest.DoesNotExist:
            messages.error(request, '존재하지 않는 퀘스트입니다.')
            return redirect('mainpage')
        except Exception as e:
            messages.error(request, f'퀘스트 인증 중 오류가 발생했습니다: {e}')
            return redirect('registeration')
    
    # GET 요청: 퀘스트 정보를 context에 포함
    quest_id = request.GET.get('quest_id')
    quest = None
    
    if quest_id:
        try:
            quest = Quest.objects.get(id=quest_id)
            
            # 이미 완료된 퀘스트인지 확인
            existing_feed = Feed.objects.filter(author=request.user, quest=quest, is_completed=True).first()
            if existing_feed:
                messages.error(request, '이미 완료된 퀘스트입니다.')
                return redirect('mainpage')
                
        except Quest.DoesNotExist:
            messages.error(request, '존재하지 않는 퀘스트입니다.')
            return redirect('mainpage')
    
    context = {
        'quest': quest
    }
    return render(request, 'main/registeration.html', context)

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
    # 사용자의 실제 데이터 계산
    user_exp = getattr(request.user, 'exp', 0)
    
    # 사용자가 작성한 게시물 수 (완료된 것만)
    total_posts = Feed.objects.filter(
        author=request.user, 
        is_completed=True,
        is_deleted=False
    ).count()
    
    # 사용자가 방문한 고유한 장소 수
    unique_locations = Feed.objects.filter(
        author=request.user, 
        is_completed=True,
        is_deleted=False,
        location__isnull=False
    ).exclude(location='').values('location').distinct().count()
    
    # 사용자 정보
    user_data = {
        'nickname': request.user.nickname or '서누',
        'univ_name': request.user.univ_name,
        'major_name': request.user.major_name,
        'bio': request.user.bio or '',
        'exp': user_exp,
        'level': (user_exp // 1000) + 1,
        'current_level_exp': user_exp % 1000,
        'ako_image': request.user.ako_image
    }
    
    context = {
        'user': user_data,
        'user_exp': user_exp,
        'total_posts': total_posts,
        'unique_locations': unique_locations,
    }
    
    return render(request, 'ending/endingpage.html', context)

def ending2(request):
    # 사용자 정보
    user_exp = getattr(request.user, 'exp', 0)
    user_data = {
        'nickname': request.user.nickname or '서누',
        'univ_name': request.user.univ_name,
        'major_name': request.user.major_name,
        'bio': request.user.bio or '',
        'exp': user_exp,
        'level': (user_exp // 1000) + 1,
        'current_level_exp': user_exp % 1000,
        'ako_image': request.user.ako_image
    }
    
    context = {
        'user': user_data
    }
    
    return render(request, 'ending2/ending2page.html', context)

# API 엔드포인트 - 사용자 정보 제공
@login_required
def get_user_info(request):
    """사용자 정보를 JSON으로 제공하는 API"""
    user_data = {
        'nickname': request.user.nickname or '서누',
        'univ_name': request.user.univ_name,
        'major_name': request.user.major_name,
        'bio': request.user.bio or '',
        'image_url': request.user.image.url if request.user.image else None,
        'exp': getattr(request.user, 'exp', 0),
        'level': (getattr(request.user, 'exp', 0) // 1000) + 1
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

def logout(request):
    auth.logout(request)
    return redirect('signin')

